<template>
  <div>
    <h3 class="text-lg font-semibold text-foreground mb-6 flex items-center">
      <span class="mr-3">📝</span>
      Enviar Mensagem de Texto
    </h3>
    
    <form @submit.prevent="sendMessage" class="space-y-6">
      <!-- Campo Número Remetente -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Número Remetente (Phone Number ID)
        </label>
        <input
          v-model="senderPhone"
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
          v-model="recipientPhone"
          type="text"
          placeholder="Ex: 5541999887766"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <p class="text-xs text-muted-foreground mt-1">
          Número do WhatsApp do destinatário (com código do país)
        </p>
      </div>

      <!-- Campo de Texto da Mensagem -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Mensagem
        </label>
        <textarea
          v-model="messageText"
          placeholder="Digite sua mensagem aqui..."
          rows="4"
          class="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
        ></textarea>
        <p class="text-xs text-muted-foreground mt-1">
          Máximo de 4096 caracteres
        </p>
      </div>

      <!-- Botão de Envio -->
      <button
        type="submit"
        :disabled="!canSend || isSending"
        class="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="flex items-center justify-center">
          <span v-if="isSending" class="mr-2">⏳</span>
          <span v-else class="mr-2">🚀</span>
          {{ isSending ? 'Enviando...' : 'Enviar Mensagem' }}
        </span>
      </button>

      <!-- Informações dos Campos -->
      <div class="bg-muted rounded-md p-4">
        <h3 class="text-sm font-medium text-foreground mb-2">📋 Resumo</h3>
        <div class="text-xs text-muted-foreground space-y-1">
          <p><strong>Remetente:</strong> {{ senderPhone || 'Não informado' }}</p>
          <p><strong>Destinatário:</strong> {{ recipientPhone || 'Não informado' }}</p>
          <p><strong>Caracteres:</strong> {{ messageText.length }}/4096</p>
        </div>
      </div>
    </form>

    <!-- Resultado do Envio -->
    <div v-if="sendResult" class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <h4 class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✅ Mensagem enviada com sucesso!</h4>
      <div class="text-xs text-green-700 dark:text-green-300 space-y-1">
        <p><strong>ID da Mensagem:</strong> {{ sendResult.messageId }}</p>
        <p><strong>Enviado para:</strong> {{ sendResult.sentTo }}</p>
        <p><strong>Conteúdo:</strong> {{ sendResult.content }}</p>
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
// Estados reativos
const senderPhone = ref('833381263194512')
const recipientPhone = ref('5541991480924')
const messageText = ref('')
const isSending = ref(false)
const sendResult = ref<any>(null)
const error = ref('')

// Computed para validar se pode enviar
const canSend = computed(() => {
  return senderPhone.value.trim() !== '' && 
         recipientPhone.value.trim() !== '' && 
         messageText.value.trim() !== ''
})

// Função para enviar mensagem
const sendMessage = async () => {
  if (!canSend.value) return

  isSending.value = true
  error.value = ''
  sendResult.value = null

  try {
    const response = await $fetch('/api/messages/text', {
      method: 'POST',
      body: {
        to: recipientPhone.value.trim(),
        body: messageText.value.trim(),
        phone_number_id: senderPhone.value.trim(),
        preview_url: false
      }
    })

    sendResult.value = response
    console.log('✅ Mensagem enviada com sucesso:', response)

    // Limpar campos após envio bem-sucedido
    messageText.value = ''

  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Erro ao enviar mensagem'
    console.error('❌ Erro ao enviar mensagem:', err)
  } finally {
    isSending.value = false
  }
}
</script>
