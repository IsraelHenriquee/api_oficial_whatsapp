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

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

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
    // Montar objeto do documento
    const documentData: any = {}
    
    if (body.mediaId) {
      documentData.id = body.mediaId
    } else if (body.mediaUrl) {
      documentData.link = body.mediaUrl
    }
    
    if (body.caption) {
      documentData.caption = body.caption
    }

    if (body.filename) {
      documentData.filename = body.filename
    }

    // Payload para envio
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: body.to,
      type: "document",
      document: documentData
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
    console.error('Erro ao enviar documento:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.error?.message || 'Erro ao enviar documento'
    })
  }
})
