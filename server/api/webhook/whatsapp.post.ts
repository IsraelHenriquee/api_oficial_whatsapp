import type { 
  WhatsAppWebhookPayload, 
  WhatsAppMessage,
  WhatsAppValue,
  WhatsAppContact,
  NormalizedMessage 
} from '../../../shared/types/WhatsAppTypes'
import { uploadToR2 } from '../../utils/uploadToR2'

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
            
            const normalizedMessage = await normalizeMessage(message, change.value, contact, entry.id)
            if (normalizedMessage) {
              normalizedMessages.push(normalizedMessage)
            }
          }
        }
      }
    }

    // Aqui você pode salvar no banco de dados, enviar para outro serviço, etc.
    
    // 🤖 RESPOSTA AUTOMÁTICA TEMPORÁRIA - APENAS PARA DEMONSTRAÇÃO PARA A META
    // ⚠️  REMOVER EM PRODUÇÃO - Este código é apenas para testes e aprovação da Meta
    for (const normalizedMessage of normalizedMessages) {
      if (normalizedMessage.messageType === 'text') {
        await sendAutoReply(normalizedMessage)
      }
    }
    // 🤖 FIM DA RESPOSTA AUTOMÁTICA TEMPORÁRIA

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
async function normalizeMessage(
  message: WhatsAppMessage, 
  value: WhatsAppValue, 
  contact?: WhatsAppContact,
  businessAccountId?: string
): Promise<NormalizedMessage | null> {
  try {
    // Extrair conteúdo baseado no tipo
    let content = ''
    let media: NormalizedMessage['media'] = undefined
    
    switch (message.type) {
      case 'text':
        content = message.text?.body || ''
        break
        
      case 'image':
        if (message.image) {
          content = message.image.caption || '[Imagem]'
          
          // Baixar mídia do WhatsApp e fazer upload no R2
          const imageUrl = await downloadAndUploadToR2(
            message.image.id,
            'image',
            value.metadata.phone_number_id,
            new Date(parseInt(message.timestamp) * 1000),
            message.image.mime_type
          )
          
          media = {
            id: message.image.id,
            mimeType: message.image.mime_type,
            url: imageUrl || undefined,
            caption: message.image.caption
          }
          
          console.log('🖼️ Imagem processada:', {
            id: message.image.id,
            mimeType: message.image.mime_type,
            url: imageUrl
          })
        }
        break
        
      case 'audio':
        if (message.audio) {
          content = '[Áudio]'
          
          const audioUrl = await downloadAndUploadToR2(
            message.audio.id,
            'audio',
            value.metadata.phone_number_id,
            new Date(parseInt(message.timestamp) * 1000),
            message.audio.mime_type
          )
          
          media = {
            id: message.audio.id,
            mimeType: message.audio.mime_type,
            url: audioUrl || undefined
          }
          
          console.log('🎵 Áudio processado:', {
            id: message.audio.id,
            mimeType: message.audio.mime_type,
            url: audioUrl
          })
        }
        break
        
      case 'video':
        if (message.video) {
          content = message.video.caption || '[Vídeo]'
          
          const videoUrl = await downloadAndUploadToR2(
            message.video.id,
            'video',
            value.metadata.phone_number_id,
            new Date(parseInt(message.timestamp) * 1000),
            message.video.mime_type
          )
          
          media = {
            id: message.video.id,
            mimeType: message.video.mime_type,
            url: videoUrl || undefined,
            caption: message.video.caption
          }
          
          console.log('🎬 Vídeo processado:', {
            id: message.video.id,
            mimeType: message.video.mime_type,
            url: videoUrl
          })
        }
        break
        
      case 'document':
        if (message.document) {
          content = message.document.caption || `[Documento: ${message.document.filename || 'arquivo'}]`
          
          const documentUrl = await downloadAndUploadToR2(
            message.document.id,
            'document',
            value.metadata.phone_number_id,
            new Date(parseInt(message.timestamp) * 1000),
            message.document.mime_type
          )
          
          media = {
            id: message.document.id,
            mimeType: message.document.mime_type,
            url: documentUrl || undefined,
            filename: message.document.filename,
            caption: message.document.caption
          }
          
          console.log('📄 Documento processado:', {
            id: message.document.id,
            mimeType: message.document.mime_type,
            filename: message.document.filename,
            url: documentUrl
          })
        }
        break
        
      case 'sticker':
        if (message.sticker) {
          content = message.sticker.animated ? '[Sticker Animado]' : '[Sticker]'
          
          const stickerUrl = await downloadAndUploadToR2(
            message.sticker.id,
            'sticker',
            value.metadata.phone_number_id,
            new Date(parseInt(message.timestamp) * 1000),
            message.sticker.mime_type
          )
          
          media = {
            id: message.sticker.id,
            mimeType: message.sticker.mime_type,
            url: stickerUrl || undefined
          }
          
          console.log('🎨 Sticker processado:', {
            id: message.sticker.id,
            mimeType: message.sticker.mime_type,
            animated: message.sticker.animated,
            url: stickerUrl
          })
        }
        break
        
      case 'location':
        if (message.location) {
          content = `[Localização: ${message.location.name || 'Local'}]`
          console.log('📍 Localização:', message.location)
        }
        break
        
      default:
        content = `[${message.type}]`
    }

    const normalizedMessage: NormalizedMessage = {
      // Dados do remetente
      senderName: contact?.profile?.name || 'Usuário Desconhecido',
      senderPhone: message.from,
      
      // Dados do receptor (seu negócio)
      businessDisplayPhone: value.metadata.display_phone_number,
      businessPhoneId: value.metadata.phone_number_id,
      businessAccountId: businessAccountId || '',
      
      // Dados da mensagem
      messageType: message.type,
      messageId: message.id,
      timestamp: new Date(parseInt(message.timestamp) * 1000),
      content
    }

    // Adicionar mídia se existir
    if (media) {
      normalizedMessage.media = media
    }

    return normalizedMessage
    
  } catch (error) {
    console.error('❌ Erro ao normalizar mensagem:', error)
    return null
  }
}

// Função helper para baixar mídia do WhatsApp e fazer upload no R2
async function downloadAndUploadToR2(
  mediaId: string,
  messageType: string,
  senderId: string,
  timestamp: Date,
  mimeType: string
): Promise<string | null> {
  try {
    // 1. Baixar a mídia usando o endpoint que já existe
    const mediaBuffer = await $fetch<Uint8Array>(`/api/media/download/${mediaId}`, {
      responseType: 'arrayBuffer'
    })

    // 2. Fazer upload para o R2
    const r2Url = await uploadToR2(
      Buffer.from(mediaBuffer),
      messageType,
      senderId,
      timestamp,
      mimeType
    )

    return r2Url

  } catch (error: any) {
    console.error('❌ Erro ao baixar e fazer upload da mídia:', error)
    return null
  }
}

// 🤖 FUNÇÃO TEMPORÁRIA PARA RESPOSTA AUTOMÁTICA - APENAS PARA DEMONSTRAÇÃO PARA A META
// ⚠️  REMOVER EM PRODUÇÃO - Este código é apenas para testes e aprovação da Meta
async function sendAutoReply(message: NormalizedMessage) {
  try {
    console.log('🤖 Enviando resposta automática para:', message.senderPhone)
    
    // Montar resposta no formato solicitado
    const replyText = `Mensagem recebida: ${message.content}`
    
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
