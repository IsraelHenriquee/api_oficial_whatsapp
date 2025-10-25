export default defineEventHandler(async (event) => {
  const mediaId = getRouterParam(event, 'id')
  
  if (!mediaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Media ID é obrigatório'
    })
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  
  if (!accessToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Token de acesso do WhatsApp não configurado'
    })
  }

  try {
    // Primeiro, obter as informações da mídia para pegar a URL
    const mediaInfoResponse = await $fetch<{
      id: string
      url: string
      mime_type: string
      file_size: string
      sha256: string
    }>(`https://graph.facebook.com/v24.0/${mediaId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!mediaInfoResponse.url) {
      throw createError({
        statusCode: 404,
        statusMessage: 'URL da mídia não encontrada'
      })
    }

    // Fazer o download da mídia usando o token de autenticação
    const mediaResponse = await fetch(mediaInfoResponse.url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!mediaResponse.ok) {
      throw createError({
        statusCode: mediaResponse.status,
        statusMessage: 'Erro ao fazer download da mídia'
      })
    }

    // Obter o conteúdo como ArrayBuffer
    const mediaBuffer = await mediaResponse.arrayBuffer()
    
    // Configurar headers para download
    const contentType = mediaInfoResponse.mime_type || 'application/octet-stream'
    const filename = `media_${mediaId}.${getFileExtension(contentType)}`
    
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
    setHeader(event, 'Content-Length', mediaBuffer.byteLength)

    // Retornar o buffer da mídia
    return new Uint8Array(mediaBuffer)

  } catch (error: any) {
    console.error('Erro ao fazer download da mídia:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro interno do servidor'
    })
  }
})

// Função auxiliar para obter extensão do arquivo baseada no MIME type
function getFileExtension(mimeType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt'
  }
  
  return extensions[mimeType] || 'bin'
}
