<template>
  <div class="auth-shell">
    <div class="auth-shell__brand">
      <NuxtLink :to="AUTH_ROUTES.login" class="auth-shell__logo">
        <div class="auth-shell__logo-icon gradient-bg">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" opacity="0.9" />
          </svg>
        </div>
        <span class="auth-shell__logo-text">souvoce</span>
      </NuxtLink>

      <div class="auth-shell__hero">
        <p class="auth-shell__eyebrow">Plataforma Souvoce</p>
        <h1 class="auth-shell__headline">
          Transforme conversas em
          <span class="gradient-text">tarefas com IA</span>
        </h1>
        <p class="auth-shell__desc">
          WhatsApp, Instagram, Telegram e comunicação interna — tudo num fluxo de trabalho inteligente.
        </p>
      </div>

      <ul class="auth-shell__features">
        <li v-for="feature in features" :key="feature">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          {{ feature }}
        </li>
      </ul>
    </div>

    <div class="auth-shell__panel">
      <div class="auth-card glass-card">
        <header class="auth-card__header">
          <h2 class="auth-card__title">{{ title }}</h2>
          <p v-if="subtitle" class="auth-card__subtitle">{{ subtitle }}</p>
        </header>

        <slot />

        <footer v-if="$slots.footer" class="auth-card__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AUTH_ROUTES } from '~/constants/routes'

defineProps<{
  title: string
  subtitle?: string
}>()

const features = [
  'Inbox unificada com menções e IA',
  'Fluxos por equipe e espaço de trabalho',
  'Calendário, rituais e relatórios',
]
</script>

<style scoped>
.auth-shell {
  display: grid;
  grid-template-columns: 1fr 480px;
  min-height: 100vh;
  min-height: 100dvh;
}

.auth-shell__brand {
  display: flex;
  flex-direction: column;
  padding: 48px 56px;
  min-height: 0;
}

.auth-shell__logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  margin-bottom: 64px;
}

.auth-shell__logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-shell__logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.auth-shell__hero {
  max-width: 440px;
  margin-bottom: 40px;
}

.auth-shell__eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-to);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.auth-shell__headline {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.auth-shell__desc {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.auth-shell__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: auto;
}

.auth-shell__features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-secondary);
}

.auth-shell__features svg {
  color: #4ade80;
  flex-shrink: 0;
}

.auth-shell__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 48px;
  border-left: 1px solid var(--border-subtle);
  background: rgba(6, 11, 26, 0.5);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
}

.auth-card__header {
  margin-bottom: 28px;
}

.auth-card__title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.auth-card__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.auth-card__footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-subtle);
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 960px) {
  .auth-shell {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .auth-shell__brand {
    padding: 24px 20px 0;
    margin-bottom: 0;
  }

  .auth-shell__logo {
    margin-bottom: 24px;
  }

  .auth-shell__hero {
    margin-bottom: 20px;
  }

  .auth-shell__headline {
    font-size: 26px;
  }

  .auth-shell__desc {
    font-size: 14px;
  }

  .auth-shell__features {
    display: none;
  }

  .auth-shell__panel {
    border-left: none;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 16px 20px calc(32px + env(safe-area-inset-bottom, 0px));
    background: transparent;
  }

  .auth-card {
    padding: 24px 20px;
  }
}
</style>

<style>
.glass-card {
  background: var(--glass-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}
</style>
