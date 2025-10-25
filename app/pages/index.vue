<template>
  <NuxtLayout name="admin-layout">
    <div class="p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-primary">Dashboard</h1>
        <p class="text-muted-foreground mt-2">Testando o tema personalizado do Tweakn</p>
      </header>

      <!-- Main Content -->
      <div class="space-y-8">
      <!-- Cards Section -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Cards com Tema</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Primary Card -->
          <div class="bg-card border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-semibold text-primary mb-2">Primary Card</h3>
            <p class="text-muted-foreground mb-4">Este card usa as cores primárias do tema.</p>
            <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              Botão Primary
            </button>
          </div>

          <!-- Secondary Card -->
          <div class="bg-secondary border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-semibold text-secondary-foreground mb-2">Secondary Card</h3>
            <p class="text-muted-foreground mb-4">Este card usa as cores secundárias.</p>
            <button class="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              Botão Accent
            </button>
          </div>

          <!-- Muted Card -->
          <div class="bg-muted border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-semibold text-foreground mb-2">Muted Card</h3>
            <p class="text-muted-foreground mb-4">Este card usa cores mais sutis.</p>
            <button class="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              Botão Danger
            </button>
          </div>
        </div>
      </section>

      <!-- Form Section -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Formulário de Exemplo</h2>
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <form class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-foreground mb-2">Nome</label>
              <input 
                id="name"
                type="text" 
                class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Digite seu nome"
              >
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-foreground mb-2">Email</label>
              <input 
                id="email"
                type="email" 
                class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="seu@email.com"
              >
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-foreground mb-2">Mensagem</label>
              <textarea 
                id="message"
                rows="4"
                class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Sua mensagem aqui..."
              ></textarea>
            </div>
            <button 
              type="submit"
              class="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>

      <!-- Typography Section -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Tipografia</h2>
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <h3 class="text-xl font-semibold text-foreground">Fonte Sans (Poppins)</h3>
            <p class="text-muted-foreground font-sans">Esta é a fonte padrão do sistema usando Poppins.</p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-foreground font-serif">Fonte Serif (Libre Baskerville)</h3>
            <p class="text-muted-foreground font-serif">Esta usa a fonte serif Libre Baskerville.</p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-foreground font-mono">Fonte Mono (IBM Plex Mono)</h3>
            <p class="text-muted-foreground font-mono">Esta usa a fonte monospace IBM Plex Mono.</p>
          </div>
        </div>
      </section>

      <!-- Colors Showcase -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Paleta de Cores</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-primary h-20 rounded-lg flex items-center justify-center">
            <span class="text-primary-foreground font-medium">Primary</span>
          </div>
          <div class="bg-secondary h-20 rounded-lg flex items-center justify-center">
            <span class="text-secondary-foreground font-medium">Secondary</span>
          </div>
          <div class="bg-accent h-20 rounded-lg flex items-center justify-center">
            <span class="text-accent-foreground font-medium">Accent</span>
          </div>
          <div class="bg-muted h-20 rounded-lg flex items-center justify-center">
            <span class="text-muted-foreground font-medium">Muted</span>
          </div>
        </div>
      </section>

      <!-- Navigation -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Páginas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink 
            to="/media"
            class="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <h3 class="text-lg font-semibold text-primary mb-2 group-hover:text-primary/80">
              📤 Upload e Envio de Mídia
            </h3>
            <p class="text-muted-foreground">
              Interface para testar upload e envio de arquivos via WhatsApp Business API
            </p>
          </NuxtLink>
        </div>
      </section>

      <!-- Dark Mode Toggle -->
      <section>
        <h2 class="text-2xl font-semibold mb-4">Modo Escuro</h2>
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <p class="text-muted-foreground mb-4">
            O tema suporta modo escuro. Use o botão na sidebar para alternar.
          </p>
          <div class="flex items-center text-muted-foreground">
            <span class="mr-2">💡</span>
            <span class="text-sm">Botão de alternância disponível na sidebar</span>
          </div>
        </div>
      </section>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Meta tags
useSeoMeta({
  title: 'Dashboard - WhatsApp Admin',
  description: 'Dashboard principal do sistema WhatsApp Business API'
})
</script>
