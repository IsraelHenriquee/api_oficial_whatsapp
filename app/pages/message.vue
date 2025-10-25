<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">
          💬 Envio de Mensagens
        </h1>
        <p class="text-muted-foreground">
          Interface para envio de mensagens via WhatsApp Business API
        </p>
      </header>

      <!-- Tabs Container -->
      <div class="bg-card border border-border rounded-lg shadow-sm">
        <!-- Tab Headers -->
        <div class="border-b border-border">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeTab = 'text'"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
              :class="{
                'border-primary text-primary': activeTab === 'text',
                'border-transparent text-muted-foreground hover:text-foreground': activeTab !== 'text'
              }"
            >
              📝 Texto
            </button>
            <button
              @click="activeTab = 'image'"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
              :class="{
                'border-primary text-primary': activeTab === 'image',
                'border-transparent text-muted-foreground hover:text-foreground': activeTab !== 'image'
              }"
            >
              🖼️ Imagem
            </button>
            <button
              @click="activeTab = 'document'"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
              :class="{
                'border-primary text-primary': activeTab === 'document',
                'border-transparent text-muted-foreground hover:text-foreground': activeTab !== 'document'
              }"
            >
              📄 Documento
            </button>
            <button
              @click="activeTab = 'audio'"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
              :class="{
                'border-primary text-primary': activeTab === 'audio',
                'border-transparent text-muted-foreground hover:text-foreground': activeTab !== 'audio'
              }"
            >
              🎵 Áudio
            </button>
            <button
              @click="activeTab = 'video'"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
              :class="{
                'border-primary text-primary': activeTab === 'video',
                'border-transparent text-muted-foreground hover:text-foreground': activeTab !== 'video'
              }"
            >
              🎬 Vídeo
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Tab Texto -->
          <div v-if="activeTab === 'text'">
            <MessageText />
          </div>

          <!-- Tab Imagem -->
          <div v-if="activeTab === 'image'">
            <MessageImage />
          </div>

          <!-- Tab Documento -->
          <div v-if="activeTab === 'document'">
            <MessageDocument />
          </div>

          <!-- Tab Áudio -->
          <div v-if="activeTab === 'audio'">
            <MessageAudio />
          </div>

          <!-- Tab Vídeo -->
          <div v-if="activeTab === 'video'">
            <MessageVideo />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Meta tags
useSeoMeta({
  title: 'Mensagens - WhatsApp Admin',
  description: 'Interface para envio de mensagens via WhatsApp Business API'
})

// Estado para controlar a aba ativa
const activeTab = ref<'text' | 'image' | 'document' | 'audio' | 'video'>('text')
</script>
