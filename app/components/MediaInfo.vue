<template>
  <div class="bg-card border border-border rounded-lg shadow-sm p-6">
    <h2 class="text-xl font-semibold text-foreground mb-4 flex items-center">
      <span class="mr-2">🔍</span>
      Obter URL da Mídia
    </h2>
    
    <form @submit.prevent="getMediaInfo" class="space-y-4">
      <!-- Media ID Input -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Media ID
        </label>
        <input
          v-model="mediaId"
          type="text"
          placeholder="Ex: 1146112743807797"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          required
        />
        <p class="text-xs text-muted-foreground mt-1">
          ID da mídia retornado pelo upload
        </p>
      </div>

      <!-- Get Info Button -->
      <button
        type="submit"
        :disabled="isLoading || !mediaId.trim()"
        class="w-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-md transition-all"
      >
        <span v-if="isLoading">⏳ Buscando...</span>
        <span v-else>🔍 Obter Informações</span>
      </button>
    </form>

    <!-- Media Info Result -->
    <div v-if="mediaInfo" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h3 class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✅ Informações da mídia</h3>
      <div class="text-xs text-green-700 dark:text-green-300 space-y-1">
        <p><strong>ID:</strong> {{ mediaInfo.id }}</p>
        <p><strong>URL:</strong> 
          <span class="text-muted-foreground text-xs break-all font-mono">
            {{ mediaInfo.url }}
          </span>
          <span class="block text-xs text-orange-600 dark:text-orange-400 mt-1">
            ⚠️ Link requer autenticação - use o botão de download abaixo
          </span>
        </p>
        <p><strong>Tipo MIME:</strong> {{ mediaInfo.mime_type }}</p>
        <p><strong>Tamanho:</strong> {{ formatFileSize(mediaInfo.file_size) }}</p>
        <p><strong>SHA256:</strong> <span class="font-mono text-xs">{{ mediaInfo.sha256 }}</span></p>
      </div>
      
      <!-- Download Button -->
      <div class="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
        <button
          @click="downloadMedia"
          :disabled="isDownloading"
          class="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-medium rounded-md transition-colors"
        >
          <span class="mr-2">📥</span>
          <span v-if="isDownloading">⏳ Baixando...</span>
          <span v-else>✅ Baixar Arquivo (Autenticado)</span>
        </button>
        <p class="text-xs text-muted-foreground mt-2">
          Este botão faz o download através do nosso servidor com autenticação automática
        </p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
      <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">❌ Erro</h3>
      <p class="text-xs text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  initialMediaId?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialMediaId: ''
})

// Emits
const emit = defineEmits<{
  mediaFound: [info: any]
}>()

// Estados reativos
const mediaId = ref(props.initialMediaId)
const isLoading = ref(false)
const isDownloading = ref(false)
const mediaInfo = ref<any>(null)
const error = ref('')

// Função para obter informações da mídia
const getMediaInfo = async () => {
  if (!mediaId.value.trim()) return

  isLoading.value = true
  error.value = ''
  mediaInfo.value = null

  try {
    const response = await $fetch(`/api/media/${mediaId.value.trim()}`)
    
    mediaInfo.value = response
    
    // Emitir evento para o componente pai
    emit('mediaFound', response)

  } catch (err: any) {
    error.value = err.data?.message || 'Erro ao obter informações da mídia'
  } finally {
    isLoading.value = false
  }
}

// Função para fazer download da mídia
const downloadMedia = async () => {
  if (!mediaInfo.value?.id) return

  isDownloading.value = true
  
  try {
    // Criar um link temporário para download
    const downloadUrl = `/api/media/download/${mediaInfo.value.id}`
    
    // Criar elemento <a> temporário para trigger do download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `media_${mediaInfo.value.id}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  } catch (err: any) {
    error.value = 'Erro ao fazer download da mídia'
  } finally {
    isDownloading.value = false
  }
}

// Função para formatar tamanho do arquivo
const formatFileSize = (bytes: number | string): string => {
  const size = typeof bytes === 'string' ? parseInt(bytes) : bytes
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Watch para atualizar o mediaId quando a prop mudar
watch(() => props.initialMediaId, (newValue) => {
  mediaId.value = newValue
})
</script>
