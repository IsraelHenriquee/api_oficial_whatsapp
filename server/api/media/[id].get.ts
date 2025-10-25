export default defineEventHandler(async (event) => {
  try {
    // Verificar se é um GET
    if (getMethod(event) !== 'GET') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Pegar o media_id da URL
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
        statusMessage: 'WhatsApp access token not configured'
      })
    }

    console.log('🔍 Buscando informações da mídia:', mediaId)

    // Fazer requisição para a API do WhatsApp
    const response = await fetch(`https://graph.facebook.com/v24.0/${mediaId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Erro da API WhatsApp:', errorData)
      throw createError({
        statusCode: response.status,
        statusMessage: `WhatsApp API Error: ${response.statusText}`
      })
    }

    const result = await response.json()
    
    console.log('✅ Informações da mídia obtidas com sucesso!')

    return {
      success: true,
      ...result
    }

  } catch (error: any) {
    console.error('❌ Erro ao obter informações da mídia:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
