// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '~/assets/css/theme.css'
  ],
  runtimeConfig: {
    // Configurações privadas (server-side only)
    // O Nuxt automaticamente mapeia NUXT_WHATSAPP_ACCESS_TOKEN -> whatsappAccessToken
    whatsappAccessToken: '',
    whatsappVerifyToken: '',
    
    // Cloudflare R2
    // O Nuxt automaticamente mapeia NUXT_R2_ACCESS_KEY_ID -> r2AccessKeyId
    r2AccessKeyId: '',
    r2SecretAccessKey: '',
    r2AccountId: '',
    r2Bucket: ''
  }
})