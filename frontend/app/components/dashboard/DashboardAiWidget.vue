<template>
  <section class="ai-widget">
    <div class="ai-widget__glow" />
    <div class="ai-widget__content">
      <div class="ai-widget__text">
        <div class="ai-widget__title-row">
          <h2 class="ai-widget__title">Souvo, seu assistente com IA</h2>
          <span class="ai-widget__beta">BETA</span>
        </div>
        <p class="ai-widget__subtitle">
          Pergunte, peça um resumo ou crie tarefas a partir de qualquer informação.
        </p>
        <div class="ai-widget__actions">
          <span v-for="action in actions" :key="action" class="ai-widget__chip">{{ action }}</span>
        </div>
      </div>
      <button type="button" class="ai-widget__cta">
        Conversar com Souvo
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L13 3L8 13L7 9L3 8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const actions = [
  'Resumir conversas',
  'Criar tarefas',
  'Detectar oportunidades',
  'Gerar relatórios',
]
</script>

<style scoped>
.ai-widget {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.25);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(5, 8, 22, 0.95) 60%);
}

.ai-widget__glow {
  position: absolute;
  top: -40%;
  left: -10%;
  width: 50%;
  height: 120%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%);
  pointer-events: none;
}

.ai-widget__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 28px;
}

.ai-widget__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.ai-widget__title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ai-widget__beta {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 7px;
  border-radius: 6px;
  background: rgba(139, 92, 246, 0.25);
  color: var(--accent-neon);
  border: 1px solid rgba(139, 92, 246, 0.35);
}

.ai-widget__subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 14px;
  max-width: 480px;
}

.ai-widget__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ai-widget__chip {
  font-size: 11px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.ai-widget__cta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  background: rgba(5, 8, 22, 0.8);
  border: 1px solid var(--border-medium);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--transition);
}

.ai-widget__cta:hover {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.1);
  color: var(--accent-neon);
}

@media (max-width: 768px) {
  .ai-widget__content {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }

  .ai-widget__cta {
    justify-content: center;
  }
}
</style>
