import type { 
  SendTextMessageRequest,
  WhatsAppSendResponse,
  WhatsAppErrorResponse 
} from '../../../shared/types/WhatsAppSendTypes'

export default defineEventHandler(async (event) => {
  try {
    // Verificar se é um POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Ler os dados da requisição
    const body: SendTextMessageRequest = await readBody(event)
    
    // Validar campos obrigatórios
    if (!body.to || !body.body || !body.phone_number_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Campos obrigatórios: to, body, phone_number_id'
      })
    }

    // Pegar o token diretamente do ambiente
    const accessToken = process?.env?.WHATSAPP_ACCESS_TOKEN
    if (!accessToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Token de acesso não configurado'
      })
    }

    // Montar o payload para a API do WhatsApp
    const whatsappPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: body.to,
      type: "text",
      text: {
        preview_url: body.preview_url || false,
        body: body.body
      }
    }

    console.log('📤 Enviando mensagem para:', body.to)
    console.log('💬 Conteúdo:', body.body)

    // Fazer a requisição para a API do WhatsApp
    const response = await $fetch<WhatsAppSendResponse | WhatsAppErrorResponse>(
      `https://graph.facebook.com/v24.0/${body.phone_number_id}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: whatsappPayload
      }
    )

    // Verificar se houve erro
    if ('error' in response) {
      console.error('❌ Erro da API WhatsApp:', response.error)
      throw createError({
        statusCode: 400,
        statusMessage: response.error.message
      })
    }

    console.log('✅ Mensagem enviada com sucesso!')
    console.log('📨 ID da mensagem:', response.messages[0]?.id)

    return {
      success: true,
      messageId: response.messages[0]?.id,
      contact: response.contacts[0],
      sentTo: body.to,
      content: body.body
    }

  } catch (error: any) {
    console.error('❌ Erro ao enviar mensagem:', error)
    
    // Se for um erro do $fetch, extrair detalhes
    if (error.data?.error) {
      throw createError({
        statusCode: error.status || 400,
        statusMessage: error.data.error.message || 'Erro ao enviar mensagem'
      })
    }

    throw error
  }
})
