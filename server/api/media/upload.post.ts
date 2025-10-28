export default defineEventHandler(async (event) => {
  try {
    // Verificar se é um POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Ler o form data
    const formData = await readMultipartFormData(event)
    
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data provided'
      })
    }

    // Buscar o arquivo no form data
    const fileField = formData.find(field => field.name === 'file')
    const phoneNumberIdField = formData.find(field => field.name === 'phone_number_id')
    
    if (!fileField || !fileField.data || !fileField.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File is required'
      })
    }

    if (!phoneNumberIdField || !phoneNumberIdField.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'phone_number_id is required'
      })
    }

    const phoneNumberId = phoneNumberIdField.data.toString()
    const config = useRuntimeConfig()
    const accessToken = config.whatsappAccessToken

    if (!accessToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'WhatsApp access token not configured'
      })
    }

    console.log('📤 Fazendo upload de mídia:', {
      filename: fileField.filename,
      size: fileField.data.length,
      type: fileField.type,
      phoneNumberId
    })

    // Criar FormData para enviar para a API do WhatsApp
    const whatsappFormData = new FormData()
    whatsappFormData.append('messaging_product', 'whatsapp')
    
    // Criar blob do arquivo a partir do Buffer
    const uint8Array = new Uint8Array(fileField.data)
    const blob = new Blob([uint8Array], { type: fileField.type || 'application/octet-stream' })
    whatsappFormData.append('file', blob, fileField.filename)

    // Fazer upload para a API do WhatsApp
    const response = await fetch(`https://graph.facebook.com/v24.0/${phoneNumberId}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: whatsappFormData
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
    
    console.log('✅ Upload realizado com sucesso! Media ID:', result.id)

    return {
      success: true,
      media_id: result.id,
      filename: fileField.filename,
      type: fileField.type,
      size: fileField.data.length
    }

  } catch (error: any) {
    console.error('❌ Erro no upload de mídia:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
