<template>
  <AuthShell title="Criar conta" subtitle="Comece a organizar conversas e tarefas com IA em minutos.">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <AuthField
        v-model="name"
        label="Nome completo"
        type="text"
        icon="user"
        placeholder="Lucas Martins"
        autocomplete="name"
        :error="errors.name"
      />
      <AuthField
        v-model="email"
        label="E-mail"
        type="email"
        icon="email"
        placeholder="voce@empresa.com"
        autocomplete="email"
        :error="errors.email"
      />
      <AuthField
        v-model="password"
        label="Senha"
        type="password"
        icon="password"
        placeholder="Mínimo 8 caracteres"
        autocomplete="new-password"
        :error="errors.password"
      />

      <label class="auth-checkbox auth-checkbox--block">
        <input v-model="acceptedTerms" type="checkbox" />
        <span>Concordo com os termos de uso e política de privacidade</span>
      </label>
      <span v-if="errors.terms" class="auth-field__error">{{ errors.terms }}</span>

      <button type="submit" class="auth-form__submit" :disabled="loading">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ loading ? 'Criando conta...' : 'Criar conta' }}
      </button>
    </form>

    <template #footer>
      Já tem conta?
      <NuxtLink :to="AUTH_ROUTES.login" class="auth-link">Entrar</NuxtLink>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
import { APP_ROUTES, AUTH_ROUTES } from '~/constants/routes'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const acceptedTerms = ref(false)
const loading = ref(false)

const errors = reactive({
  name: '',
  email: '',
  password: '',
  terms: '',
})

function validate() {
  Object.assign(errors, { name: '', email: '', password: '', terms: '' })

  if (!name.value.trim()) errors.name = 'Informe seu nome.'
  if (!email.value.trim()) errors.email = 'Informe seu e-mail.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.email = 'E-mail inválido.'
  if (password.value.length < 8) errors.password = 'Mínimo de 8 caracteres.'
  if (!acceptedTerms.value) errors.terms = 'Aceite os termos para continuar.'

  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false

  if (import.meta.client) {
    localStorage.setItem('souvoce-auth-email', email.value)
  }

  router.push(APP_ROUTES.home)
}
</script>

<style scoped>
.auth-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.auth-checkbox--block {
  margin-bottom: 8px;
}

.auth-checkbox input {
  width: 14px;
  height: 14px;
  margin-top: 2px;
  accent-color: var(--accent-neon);
  flex-shrink: 0;
}

.auth-field__error {
  display: block;
  margin-bottom: 14px;
  font-size: 11px;
  color: #f87171;
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
  margin-top: 8px;
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

.auth-form__submit:hover:not(:disabled) {
  transform: translateY(-1px);
}

.auth-form__submit:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
