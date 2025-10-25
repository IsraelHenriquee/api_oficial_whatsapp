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
              �️ Imagem
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
const activeTab = ref<'text' | 'image'>('text')
</script>
