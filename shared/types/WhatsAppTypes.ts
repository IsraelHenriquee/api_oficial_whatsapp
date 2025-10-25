// Tipos para o webhook do WhatsApp Business API
export interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppValue;
  field: string;
}

export interface WhatsAppValue {
  messaging_product: string;
  metadata: WhatsAppMetadata;
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
}

export interface WhatsAppMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface WhatsAppContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location' | 'contacts';
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  audio?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  // Adicionar outros tipos conforme necessário
}

// Tipo normalizado para saída
export interface NormalizedMessage {
  // Dados do remetente
  senderName: string;
  senderPhone: string;
  
  // Dados do receptor (seu negócio)
  businessDisplayPhone: string;
  businessPhoneId: string;
  
  // Dados da mensagem
  messageType: WhatsAppMessage['type'];
  messageId: string;
  timestamp: Date;
  content: string; // Por enquanto apenas texto
}
