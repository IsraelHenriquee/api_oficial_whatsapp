export default defineEventHandler(async (event) => {
  // Só aceita POST
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método não permitido'
    })
  }

  const body = await readBody(event)
  
  // Validar campos obrigatórios
  if (!body.to) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Campo "to" é obrigatório'
    })
  }

  if (!body.mediaId && !body.mediaUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Campo "mediaId" ou "mediaUrl" é obrigatório'
    })
  }

  const config = useRuntimeConfig()
  const accessToken = config.whatsappAccessToken

  if (!accessToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Token de acesso do WhatsApp não configurado'
    })
  }

  if (!body.phoneNumberId && !body.phone_number_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Campo "phoneNumberId" ou "phone_number_id" é obrigatório'
    })
  }

  const phoneNumberId = body.phoneNumberId || body.phone_number_id

  try {
    // Montar objeto do áudio
    const audioData: any = {}
    
    if (body.mediaId) {
      audioData.id = body.mediaId
    } else if (body.mediaUrl) {
      audioData.link = body.mediaUrl
    }
    
    // Sempre enviar como mensagem de voz (voice: true)
    audioData.voice = true
    console.log('🎤 Enviando como mensagem de voz (sempre true)')
    console.log('⚠️  IMPORTANTE: Voice messages requerem:')
    console.log('   - Arquivo .ogg codificado com codec OPUS')
    console.log('   - Tamanho máximo 512KB para exibir waveform')
    console.log('   - Duração mínima ~1 segundo')

    // Payload para envio
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: body.to,
      type: "audio",
      audio: audioData
    }

    // Enviar para WhatsApp API
    const response = await $fetch(`https://graph.facebook.com/v24.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: payload
    })

    return {
      success: true,
      data: response
    }

  } catch (error: any) {
    console.error('Erro ao enviar áudio:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.error?.message || 'Erro ao enviar áudio'
    })
  }
})
