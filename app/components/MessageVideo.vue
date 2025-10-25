<template>
  <div>
    <h3 class="text-lg font-semibold text-foreground mb-6 flex items-center">
      <span class="mr-3">🎬</span>
      Enviar Mensagem de Vídeo
    </h3>
    
    <form @submit.prevent="sendVideo" class="space-y-6">
      <!-- Campo Número Remetente -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Número Remetente (Phone Number ID)
        </label>
        <input
          v-model="phoneNumberId"
          type="text"
          placeholder="Ex: 106540352242922"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <p class="text-xs text-muted-foreground mt-1">
          Phone Number ID do WhatsApp Business
        </p>
      </div>

      <!-- Campo Número Destinatário -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Número Destinatário
        </label>
        <input
          v-model="recipient"
          type="text"
          placeholder="Ex: 5541999887766"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <p class="text-xs text-muted-foreground mt-1">
          Número do WhatsApp do destinatário (com código do país)
        </p>
      </div>

      <!-- Campo Media ID -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Media ID
        </label>
        <input
          v-model="mediaId"
          type="text"
          placeholder="Ex: 1166846181421424"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <p class="text-xs text-muted-foreground mt-1">
          ID da mídia obtido após o upload do vídeo
        </p>
      </div>

      <!-- Campo URL do Vídeo (Alternativa) -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          URL do Vídeo (Alternativa)
        </label>
        <input
          v-model="mediaUrl"
          type="url"
          placeholder="Ex: https://exemplo.com/video.mp4"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <p class="text-xs text-muted-foreground mt-1">
          URL pública do vídeo (use Media ID ou URL, não ambos)
        </p>
      </div>

      <!-- Campo Caption -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Legenda (Opcional)
        </label>
        <textarea
          v-model="caption"
          placeholder="Digite uma legenda para o vídeo..."
          rows="3"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
        ></textarea>
        <p class="text-xs text-muted-foreground mt-1">
          Texto que aparecerá junto com o vídeo (opcional)
        </p>
      </div>

      <!-- Informações sobre formatos suportados -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p class="text-xs text-blue-700 dark:text-blue-300 mb-2">
          📹 <strong>Formatos de vídeo suportados:</strong>
        </p>
        <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4">
          <li>• <strong>MP4, MOV:</strong> H.264 video codec, AAC audio codec</li>
          <li>• <strong>3GPP:</strong> H.263 video codec, AMR audio codec</li>
          <li>• <strong>Tamanho máximo:</strong> 16 MB</li>
          <li>• <strong>Duração máxima:</strong> 10 minutos</li>
        </ul>
      </div>

      <!-- Botão de Envio -->
      <button
        type="submit"
        :disabled="!canSend || isLoading"
        class="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="flex items-center justify-center">
          <span v-if="isLoading" class="mr-2">⏳</span>
          <span v-else class="mr-2">🎬</span>
          {{ isLoading ? 'Enviando...' : 'Enviar Vídeo' }}
        </span>
      </button>

      <!-- Informações dos Campos -->
      <div class="bg-muted rounded-md p-4">
        <h3 class="text-sm font-medium text-foreground mb-2">📋 Resumo</h3>
        <div class="text-xs text-muted-foreground space-y-1">
          <p><strong>Remetente:</strong> {{ phoneNumberId || 'Não informado' }}</p>
          <p><strong>Destinatário:</strong> {{ recipient || 'Não informado' }}</p>
          <p><strong>Media ID:</strong> {{ mediaId || 'Não informado' }}</p>
          <p><strong>URL:</strong> {{ mediaUrl || 'Não informado' }}</p>
          <p><strong>Legenda:</strong> {{ caption || 'Sem legenda' }}</p>
        </div>
      </div>
    </form>

    <!-- Resultado do Envio -->
    <div v-if="success" class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h4 class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✅ Vídeo enviado com sucesso!</h4>
      <div class="text-xs text-green-700 dark:text-green-300 space-y-1">
        <p><strong>ID da Mensagem:</strong> {{ success.messages?.[0]?.id }}</p>
        <p><strong>Enviado para:</strong> {{ success.contacts?.[0]?.input }}</p>
        <p><strong>WhatsApp ID:</strong> {{ success.contacts?.[0]?.wa_id }}</p>
      </div>
    </div>

    <!-- Erro -->
    <div v-if="error" class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
      <h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">❌ Erro no envio</h4>
      <p class="text-xs text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props (se necessário receber valores iniciais)
interface Props {
  initialRecipient?: string
  initialPhoneNumberId?: string
  initialMediaId?: string
  initialMediaUrl?: string
  initialCaption?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialRecipient: '',
  initialPhoneNumberId: '',
  initialMediaId: '',
  initialMediaUrl: '',
  initialCaption: ''
})

// Estados reativos
const recipient = ref(props.initialRecipient || '5541991480924')
const phoneNumberId = ref(props.initialPhoneNumberId || '833381263194512') // Valor padrão
const mediaId = ref(props.initialMediaId)
const mediaUrl = ref(props.initialMediaUrl)
const caption = ref(props.initialCaption)
const isLoading = ref(false)
const success = ref<any>(null)
const error = ref('')

// Computed para validar se pode enviar
const canSend = computed(() => {
  return phoneNumberId.value.trim() !== '' && 
         recipient.value.trim() !== '' && 
         (mediaId.value.trim() !== '' || mediaUrl.value.trim() !== '')
})

// Função para enviar vídeo
const sendVideo = async () => {
  if (!canSend.value) return

  isLoading.value = true
  error.value = ''
  success.value = null

  try {
    const payload = {
      to: recipient.value.trim(),
      phoneNumberId: phoneNumberId.value.trim(),
      ...(mediaId.value.trim() && { mediaId: mediaId.value.trim() }),
      ...(mediaUrl.value.trim() && { mediaUrl: mediaUrl.value.trim() }),
      ...(caption.value.trim() && { caption: caption.value.trim() })
    }

    console.log('📤 Enviando vídeo com payload:', payload)

    const response = await $fetch('/api/messages/video', {
      method: 'POST',
      body: payload
    })

    success.value = response.data
    
    // Limpar campos após sucesso (opcional)
    // recipient.value = ''
    // mediaId.value = ''
    // mediaUrl.value = ''
    // caption.value = ''

  } catch (err: any) {
    error.value = err.data?.message || 'Erro ao enviar vídeo'
  } finally {
    isLoading.value = false
  }
}

// Watch para atualizar valores quando props mudarem
watch(() => props.initialRecipient, (newValue) => {
  recipient.value = newValue
})

watch(() => props.initialPhoneNumberId, (newValue) => {
  phoneNumberId.value = newValue
})

watch(() => props.initialMediaId, (newValue) => {
  mediaId.value = newValue
})

watch(() => props.initialMediaUrl, (newValue) => {
  mediaUrl.value = newValue
})

watch(() => props.initialCaption, (newValue) => {
  caption.value = newValue
})
</script>
