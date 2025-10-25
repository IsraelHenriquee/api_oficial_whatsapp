<template>
  <div class="h-screen bg-background text-foreground flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r border-border flex flex-col flex-shrink-0">
      <!-- Header da Sidebar -->
      <div class="p-6 border-b border-border">
        <h1 class="text-xl font-bold text-primary">WhatsApp Admin</h1>
        <p class="text-sm text-muted-foreground mt-1">Business API</p>
      </div>

      <!-- Menu de Navegação -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <!-- Home -->
          <li>
            <NuxtLink
              to="/"
              class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              :class="{
                'bg-primary text-primary-foreground': $route.path === '/',
                'text-muted-foreground': $route.path !== '/'
              }"
            >
              <span class="mr-3">🏠</span>
              Home
            </NuxtLink>
          </li>

          <!-- Separador -->
          <li class="pt-4">
            <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              WhatsApp API
            </div>
          </li>

          <!-- Media -->
          <li>
            <NuxtLink
              to="/media"
              class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              :class="{
                'bg-primary text-primary-foreground': $route.path === '/media',
                'text-muted-foreground': $route.path !== '/media'
              }"
            >
              <span class="mr-3">📤</span>
              Media
            </NuxtLink>
          </li>

          <!-- Message -->
          <li>
            <NuxtLink
              to="/message"
              class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              :class="{
                'bg-primary text-primary-foreground': $route.path === '/message',
                'text-muted-foreground': $route.path !== '/message'
              }"
            >
              <span class="mr-3">💬</span>
              Message
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Footer da Sidebar -->
      <div class="p-4 border-t border-border">
        <div class="flex items-center justify-between">
          <span class="text-xs text-muted-foreground">Nuxt 4 + WhatsApp</span>
          <button 
            @click="toggleDarkMode"
            class="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            :title="isDark ? 'Modo Claro' : 'Modo Escuro'"
          >
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="flex-1 overflow-y-auto overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
}

// Inicializar o estado do dark mode no client
onMounted(() => {
  if (import.meta.client) {
    isDark.value = document.documentElement.classList.contains('dark')
  }
})
</script>
