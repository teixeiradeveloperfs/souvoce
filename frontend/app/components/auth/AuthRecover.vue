<template>
  <AuthShell
    :title="sent ? 'E-mail enviado' : 'Recuperar senha'"
    :subtitle="sent
      ? 'Enviamos um link de redefinição para o seu e-mail.'
      : 'Informe seu e-mail e enviaremos um link para redefinir a senha.'"
  >
    <form v-if="!sent" class="auth-form" @submit.prevent="handleSubmit">
      <AuthField
        v-model="email"
        label="E-mail"
        type="email"
        icon="email"
        placeholder="voce@empresa.com"
        autocomplete="email"
        :error="errors.email"
      />

      <button type="submit" class="auth-form__submit" :disabled="loading">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4.5L8 9L14 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 8V11.5C2 12.05 2.45 12.5 3 12.5H13C13.55 12.5 14 12.05 14 11.5V8" stroke="currentColor" stroke-width="1.3"/>
        </svg>
        {{ loading ? 'Enviando...' : 'Enviar link' }}
      </button>
    </form>

    <div v-else class="auth-success">
      <div class="auth-success__icon">✉️</div>
      <p class="auth-success__text">
        Verifique a caixa de entrada de <strong>{{ email }}</strong> e siga as instruções.
      </p>
      <button type="button" class="auth-form__submit auth-form__submit--ghost" @click="sent = false">
        Usar outro e-mail
      </button>
    </div>

    <template #footer>
      <NuxtLink :to="AUTH_ROUTES.login" class="auth-link">← Voltar para o login</NuxtLink>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
import { AUTH_ROUTES } from '~/constants/routes'

const email = ref('')
const sent = ref(false)
const loading = ref(false)
const errors = reactive({ email: '' })

function validate() {
  errors.email = ''
  if (!email.value.trim()) {
    errors.email = 'Informe seu e-mail.'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'E-mail inválido.'
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 900))
  loading.value = false
  sent.value = true
}
</script>

<style scoped>
.auth-success {
  text-align: center;
  padding: 12px 0 8px;
}

.auth-success__icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.auth-success__text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}

.auth-success__text strong {
  color: var(--text-primary);
}

.auth-link {
  color: var(--accent-to);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-form__submit {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--accent-neon), var(--accent-to));
  color: white;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
  transition: opacity var(--transition), transform var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.auth-form__submit--ghost {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  box-shadow: none;
}

.auth-form__submit:hover:not(:disabled) {
  transform: translateY(-1px);
}

.auth-form__submit:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
