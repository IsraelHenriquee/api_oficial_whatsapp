import type { 
  WhatsAppWebhookPayload, 
  WhatsAppMessage,
  WhatsAppValue,
  WhatsAppContact,
  NormalizedMessage 
} from '../../../shared/types/WhatsAppTypes'

export default defineEventHandler(async (event) => {
  try {
    // Log inicial com timestamp
    const timestamp = new Date().toISOString()
    console.log(`\n🚀 ===== WEBHOOK WHATSAPP RECEBIDO - ${timestamp} =====`)
    
    // Log dos headers
    console.log('📋 HEADERS:')
    const headers = getHeaders(event)
    Object.entries(headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`)
    })
    
    // Log da URL e método
    console.log(`📍 URL: ${getRequestURL(event)}`)
    console.log(`🔧 METHOD: ${getMethod(event)}`)
    
    // Verificar se é um POST
    if (getMethod(event) !== 'POST') {
      console.log('❌ Método não permitido:', getMethod(event))
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Ler o payload do webhook
    const payload: WhatsAppWebhookPayload = await readBody(event)
    
    // Log completo do payload
    console.log('� PAYLOAD COMPLETO:')
    console.log(JSON.stringify(payload, null, 2))
    
    // Log resumido para facilitar análise
    console.log('📊 RESUMO DO PAYLOAD:')
    console.log(`  - Objeto: ${payload.object}`)
    console.log(`  - Número de entries: ${payload.entry?.length || 0}`)

    // Processar cada entrada do webhook
    const normalizedMessages: NormalizedMessage[] = []

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages' && change.value.messages) {
          // Processar cada mensagem
          for (const message of change.value.messages) {
            const contact = change.value.contacts?.find((c: WhatsAppContact) => c.wa_id === message.from)
            
            const normalizedMessage = normalizeMessage(message, change.value, contact)
            if (normalizedMessage) {
              normalizedMessages.push(normalizedMessage)
            }
          }
        }
      }
    }

    // Aqui você pode salvar no banco de dados, enviar para outro serviço, etc.
    for (const msg of normalizedMessages) {
      // 🤖 RESPOSTA AUTOMÁTICA TEMPORÁRIA PARA TESTE
      if (msg.messageType === 'text') {
        await sendAutoReply(msg)
      }
    }

    // Responder com sucesso (WhatsApp espera status 200)
    return {
      success: true,
      messagesProcessed: normalizedMessages.length,
      messages: normalizedMessages
    }

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})

// Função para normalizar a mensagem
function normalizeMessage(
  message: WhatsAppMessage, 
  value: WhatsAppValue, 
  contact?: WhatsAppContact
): NormalizedMessage | null {
  try {
    // Extrair conteúdo baseado no tipo
    let content = ''
    
    switch (message.type) {
      case 'text':
        content = message.text?.body || ''
        break
      case 'image':
        content = `[Imagem: ${message.image?.mime_type || 'image'}]`
        break
      case 'audio':
        content = `[Áudio: ${message.audio?.mime_type || 'audio'}]`
        break
      case 'video':
        content = '[Vídeo]'
        break
      case 'document':
        content = '[Documento]'
        break
      case 'location':
        content = '[Localização]'
        break
      default:
        content = `[${message.type}]`
    }

    return {
      // Dados do remetente
      senderName: contact?.profile?.name || 'Usuário Desconhecido',
      senderPhone: message.from,
      
      // Dados do receptor (seu negócio)
      businessDisplayPhone: value.metadata.display_phone_number,
      businessPhoneId: value.metadata.phone_number_id,
      
      // Dados da mensagem
      messageType: message.type,
      messageId: message.id,
      timestamp: new Date(parseInt(message.timestamp) * 1000), // Converter timestamp Unix
      content
    }
  } catch (error) {
    console.error('❌ Erro ao normalizar mensagem:', error)
    return null
  }
}



// 🤖 Função temporária para resposta automática
async function sendAutoReply(message: NormalizedMessage) {
  try {
    console.log('🤖 Enviando resposta automática para:', message.senderPhone)
    
    // Montar resposta com o texto recebido
    const replyText = `Resposta: ${message.content}`
    
    console.log('📋 Dados sendo enviados:')
    console.log('  - Para:', message.senderPhone)
    console.log('  - Texto (body):', replyText)
    console.log('  - Phone Number ID:', message.businessPhoneId)
    
    // Usar o endpoint que já criamos
    const response = await $fetch('/api/messages/text', {
      method: 'POST',
      body: {
        to: message.senderPhone,
        body: replyText,
        phone_number_id: message.businessPhoneId,
        preview_url: false
      }
    })

    console.log('✅ Resposta automática enviada via endpoint!')
    
  } catch (error: any) {
    console.error('❌ Erro ao enviar resposta automática:', error)
    console.error('🔍 Número:', message.senderPhone)
  }
}
