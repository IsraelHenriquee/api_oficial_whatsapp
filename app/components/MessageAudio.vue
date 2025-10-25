<template>
  <div>
    <h3 class="text-lg font-semibold text-foreground mb-6 flex items-center">
      <span class="mr-3">🎵</span>
      Enviar Mensagem de Áudio
    </h3>
    
    <form @submit.prevent="sendAudio" class="space-y-6">
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
        <div class="flex space-x-2">
          <input
            v-model="mediaId"
            type="text"
            placeholder="Ex: 1013859600285441"
            class="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <button
            v-if="mediaId"
            type="button"
            @click="checkMediaInfo"
            :disabled="isCheckingMedia"
            class="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:opacity-90 disabled:opacity-50"
          >
            {{ isCheckingMedia ? '⏳' : '🔍' }}
          </button>
        </div>
        <p class="text-xs text-muted-foreground mt-1">
          ID da mídia obtido após o upload
        </p>
        
        <!-- Informações da mídia -->
        <div v-if="mediaInfo" class="mt-2 p-2 bg-secondary/50 rounded-md">
          <p class="text-xs font-medium text-foreground mb-1">📊 Informações do arquivo:</p>
          <div class="text-xs text-muted-foreground space-y-1">
            <p v-if="mediaInfo.mime_type"><strong>Tipo:</strong> {{ mediaInfo.mime_type }}</p>
            <p v-if="mediaInfo.file_size"><strong>Tamanho:</strong> {{ formatFileSize(mediaInfo.file_size) }}</p>
            <p v-if="mediaInfo.url"><strong>URL:</strong> {{ mediaInfo.url.substring(0, 50) }}...</p>
          </div>
          <!-- Alerta se arquivo muito grande para waveform -->
          <div v-if="mediaInfo.file_size && mediaInfo.file_size > 512000" class="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p class="text-xs text-amber-700 dark:text-amber-300">
              ⚠️ <strong>Atenção:</strong> Arquivo maior que 512KB - aparecerá como download em vez de player
            </p>
          </div>
        </div>
      </div>

      <!-- Campo URL do Áudio (Alternativa) -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          URL do Áudio (Alternativa)
        </label>
        <input
          v-model="mediaUrl"
          type="url"
          placeholder="Ex: https://exemplo.com/audio.mp3"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <p class="text-xs text-muted-foreground mt-1">
          URL pública do áudio (use Media ID ou URL, não ambos)
        </p>
      </div>

      <!-- Informações sobre Voice Messages -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <p class="text-xs text-blue-700 dark:text-blue-300 mb-2">
          🎤 <strong>Enviando como Mensagem de Voz (voice: true)</strong>
        </p>
        <p class="text-xs text-blue-700 dark:text-blue-300 mb-2">
          💡 <strong>Para o waveform aparecer corretamente:</strong>
        </p>
        <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4">
          <li>• <strong>Formato ideal:</strong> .ogg com codec OPUS</li>
          <li>• <strong>Tamanho:</strong> máximo 512KB (senão vira download)</li>
          <li>• <strong>Duração:</strong> mínimo 1 segundo</li>
          <li>• <strong>Compatíveis:</strong> MP3, WAV, OGG, AAC, AMR, M4A</li>
        </ul>
        <p class="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
          ⚠️ Apenas arquivos .ogg com OPUS garantem waveform + transcrição
        </p>
      </div>

      <!-- Botão de Envio -->
      <button
        type="submit"
        :disabled="!canSend || isLoading"
        class="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="flex items-center justify-center">
          <span v-if="isLoading" class="mr-2">⏳</span>
          <span v-else class="mr-2">🎵</span>
          {{ isLoading ? 'Enviando...' : 'Enviar Áudio' }}
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
          <p><strong>Tipo:</strong> 🎤 Mensagem de Voz (sempre)</p>
        </div>
      </div>
    </form>

    <!-- Resultado do Envio -->
    <div v-if="success" class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h4 class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✅ Áudio enviado com sucesso!</h4>
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
}

const props = withDefaults(defineProps<Props>(), {
  initialRecipient: '',
  initialPhoneNumberId: '',
  initialMediaId: '',
  initialMediaUrl: ''
})

// Estados reativos
const recipient = ref(props.initialRecipient || '5541991480924')
const phoneNumberId = ref(props.initialPhoneNumberId || '833381263194512') // Valor padrão
const mediaId = ref(props.initialMediaId)
const mediaUrl = ref(props.initialMediaUrl)
const isLoading = ref(false)
const success = ref<any>(null)
const error = ref('')

// Estados para verificação de mídia
const isCheckingMedia = ref(false)
const mediaInfo = ref<any>(null)

// Computed para validar se pode enviar
const canSend = computed(() => {
  return phoneNumberId.value.trim() !== '' && 
         recipient.value.trim() !== '' && 
         (mediaId.value.trim() !== '' || mediaUrl.value.trim() !== '')
})

// Função para verificar informações da mídia
const checkMediaInfo = async () => {
  if (!mediaId.value.trim() || !phoneNumberId.value.trim()) return

  isCheckingMedia.value = true
  mediaInfo.value = null

  try {
    const response = await $fetch(`/api/media/info?mediaId=${mediaId.value.trim()}&phoneNumberId=${phoneNumberId.value.trim()}`)

    mediaInfo.value = response.data
  } catch (err: any) {
    console.error('Erro ao buscar informações da mídia:', err)
  } finally {
    isCheckingMedia.value = false
  }
}

// Função para formatar tamanho do arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Função para enviar áudio
const sendAudio = async () => {
  if (!canSend.value) return

  isLoading.value = true
  error.value = ''
  success.value = null

  try {
    const payload = {
      to: recipient.value.trim(),
      phoneNumberId: phoneNumberId.value.trim(),
      ...(mediaId.value.trim() && { mediaId: mediaId.value.trim() }),
      ...(mediaUrl.value.trim() && { mediaUrl: mediaUrl.value.trim() })
    }

    console.log('📤 Enviando áudio com payload:', payload)

    const response = await $fetch('/api/messages/audio', {
      method: 'POST',
      body: payload
    })

    success.value = response.data
    
    // Limpar campos após sucesso (opcional)
    // recipient.value = ''
    // mediaId.value = ''
    // mediaUrl.value = ''

  } catch (err: any) {
    error.value = err.data?.message || 'Erro ao enviar áudio'
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
</script>
