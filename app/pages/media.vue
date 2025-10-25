<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">
          📤 Upload e Envio de Mídia
        </h1>
        <p class="text-muted-foreground">
          Faça upload de arquivos e envie para o WhatsApp Business API
        </p>
      </header>

      <!-- Upload Container -->
      <div class="w-full space-y-8">
        <MediaUpload 
          :phone-number-id="defaultPhoneNumberId"
          @uploaded="handleUploadSuccess"
        />

        <MediaInfo 
          :initial-media-id="lastMediaId"
          @media-found="handleMediaFound"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Meta tags
useSeoMeta({
  title: 'Upload e Envio de Mídia - WhatsApp',
  description: 'Interface para teste de upload e envio de mídia via WhatsApp Business API'
})

// Estados reativos
const defaultPhoneNumberId = ref('123456789') // Configuração padrão
const lastMediaId = ref('')

// Handler para quando o upload for bem-sucedido
const handleUploadSuccess = (result: any) => {
  console.log('✅ Upload realizado:', result)
  
  // Se o resultado contém um media ID, armazenar para uso no MediaInfo
  if (result?.id) {
    lastMediaId.value = result.id
  }
}

// Handler para quando uma mídia é encontrada pelo MediaInfo
const handleMediaFound = (mediaInfo: any) => {
  console.log('📋 Informações da mídia:', mediaInfo)
}
</script>
