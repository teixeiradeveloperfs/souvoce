<template>
  <AuthShell title="Entrar na conta" subtitle="Acesse seus fluxos, inbox e automações de IA.">
    <form class="auth-form" @submit.prevent="handleSubmit">
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
        placeholder="••••••••"
        autocomplete="current-password"
        :error="errors.password"
      />

      <div class="auth-form__row">
        <label class="auth-checkbox">
          <input v-model="remember" type="checkbox" />
          <span>Lembrar de mim</span>
        </label>
        <NuxtLink :to="AUTH_ROUTES.recover" class="auth-link">Esqueceu a senha?</NuxtLink>
      </div>

      <p v-if="formError" class="auth-form__error">{{ formError }}</p>

      <button type="submit" class="auth-form__submit" :disabled="loading">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <template #footer>
      Não tem conta?
      <NuxtLink :to="AUTH_ROUTES.register" class="auth-link">Criar conta</NuxtLink>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
import { APP_ROUTES, AUTH_ROUTES } from '~/constants/routes'

const router = useRouter()

const email = ref('')
const password = ref('')
const remember = ref(true)
const loading = ref(false)
const formError = ref('')
const errors = reactive({ email: '', password: '' })

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem('souvoce-auth-email')
    if (saved) email.value = saved
  }
})

function validate() {
  errors.email = ''
  errors.password = ''
  formError.value = ''

  if (!email.value.trim()) {
    errors.email = 'Informe seu e-mail.'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'E-mail inválido.'
    return false
  }
  if (!password.value) {
    errors.password = 'Informe sua senha.'
    return false
  }
  if (password.value.length < 6) {
    errors.password = 'Mínimo de 6 caracteres.'
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 700))
  loading.value = false

  if (remember.value && import.meta.client) {
    localStorage.setItem('souvoce-auth-email', email.value)
  }

  router.push(APP_ROUTES.home)
}
</script>

<style scoped>
.auth-form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.auth-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.auth-checkbox input {
  width: 14px;
  height: 14px;
  accent-color: var(--accent-neon);
}

.auth-link {
  color: var(--accent-to);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-form__error {
  font-size: 12px;
  color: #f87171;
  margin-bottom: 14px;
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

.auth-form__submit:hover:not(:disabled) {
  transform: translateY(-1px);
}

.auth-form__submit:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
