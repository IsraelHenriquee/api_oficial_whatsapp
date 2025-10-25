// Tipos para envio de mensagens via WhatsApp Business API

export interface SendTextMessageRequest {
  to: string; // Número do destinatário
  body: string; // Texto da mensagem
  preview_url?: boolean; // Habilitar preview de links (opcional)
  phone_number_id: string; // ID do número de telefone do negócio
}

export interface WhatsAppSendResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

export interface WhatsAppErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}
