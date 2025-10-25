<template>
  <div class="bg-card border border-border rounded-lg shadow-sm p-6">
    <h2 class="text-xl font-semibold text-foreground mb-4 flex items-center">
      <span class="mr-2">📁</span>
      Upload de Arquivo
    </h2>
    
    <form @submit.prevent="uploadFile" class="space-y-4">
      <!-- Phone Number ID -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Phone Number ID
        </label>
        <input
          v-model="phoneNumberId"
          type="text"
          placeholder="Ex: 106540352242922"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          required
        />
      </div>

      <!-- File Input -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Arquivo
        </label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          @change="handleFileSelect"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90"
          required
        />
        <p class="text-xs text-muted-foreground mt-1">
          Suporta: imagens, vídeos, áudios, PDF, DOC
        </p>
      </div>

      <!-- Upload Button -->
      <button
        type="submit"
        :disabled="isUploading || !selectedFile"
        class="w-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-md transition-all"
      >
        <span v-if="isUploading">⏳ Fazendo upload...</span>
        <span v-else>📤 Fazer Upload</span>
      </button>
    </form>

    <!-- Upload Result -->
    <div v-if="uploadResult" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h3 class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✅ Upload realizado!</h3>
      <div class="text-xs text-green-700 dark:text-green-300 space-y-1">
        <p><strong>Media ID:</strong> {{ uploadResult.media_id }}</p>
        <p><strong>Arquivo:</strong> {{ uploadResult.filename }}</p>
        <p><strong>Tipo:</strong> {{ uploadResult.type }}</p>
        <p><strong>Tamanho:</strong> {{ formatFileSize(uploadResult.size) }}</p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
      <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">❌ Erro no upload</h3>
      <p class="text-xs text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  phoneNumberId?: string
}

const props = withDefaults(defineProps<Props>(), {
  phoneNumberId: ''
})

// Emits
const emit = defineEmits<{
  uploaded: [result: any]
}>()

// Estados reativos
const phoneNumberId = ref(props.phoneNumberId)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadResult = ref<any>(null)
const error = ref('')
const fileInput = ref<HTMLInputElement>()

// Handlers
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

const uploadFile = async () => {
  if (!selectedFile.value || !phoneNumberId.value) return

  isUploading.value = true
  error.value = ''
  uploadResult.value = null

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('phone_number_id', phoneNumberId.value)

    const response = await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    uploadResult.value = response
    
    // Emitir evento para o componente pai
    emit('uploaded', response)

  } catch (err: any) {
    error.value = err.data?.message || 'Erro no upload'
  } finally {
    isUploading.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Watch para atualizar o phoneNumberId quando a prop mudar
watch(() => props.phoneNumberId, (newValue) => {
  phoneNumberId.value = newValue
})
</script>
