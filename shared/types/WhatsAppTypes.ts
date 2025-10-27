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
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location' | 'contacts' | 'sticker';
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  audio?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  video?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  document?: {
    id: string;
    mime_type: string;
    sha256: string;
    filename?: string;
    caption?: string;
  };
  sticker?: {
    id: string;
    mime_type: string;
    sha256: string;
    animated: boolean;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
}

// Tipo normalizado para saída
export interface NormalizedMessage {
  // Dados do remetente
  senderName: string;
  senderPhone: string;
  
  // Dados do receptor (seu negócio)
  businessDisplayPhone: string;
  businessPhoneId: string;
  businessAccountId: string; // ID da conta do WhatsApp Business
  
  // Dados da mensagem
  messageType: WhatsAppMessage['type'];
  messageId: string;
  timestamp: Date;
  content: string;
  
  // Dados de mídia (opcional)
  media?: {
    id: string;
    mimeType: string;
    url?: string; // URL do arquivo baixado
    filename?: string;
    caption?: string;
  };
}
