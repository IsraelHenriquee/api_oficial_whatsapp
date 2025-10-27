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
    whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'meu_token_secreto_12345',
    
    // Cloudflare R2
    r2AccessKeyId: process.env.R2ACCESSKEYID || '',
    r2SecretAccessKey: process.env.R2SECRETACCESSKEY || '',
    r2AccountId: process.env.R2ACCOUNTID || '',
    r2Bucket: process.env.R2BUCKET || ''
  }
})