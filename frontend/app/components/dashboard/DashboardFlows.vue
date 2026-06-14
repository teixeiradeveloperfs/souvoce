<template>
  <section class="flows">
    <div class="section-head">
      <h2 class="section-head__title">Visão geral dos fluxos</h2>
    </div>

    <div class="flows__grid">
      <article
        v-for="flow in flows"
        :key="flow.id"
        class="flow-card glass-card"
      >
        <div class="flow-card__top">
          <div class="flow-card__identity">
            <div class="flow-card__icon" :style="{ background: `${flow.color}18`, color: flow.color }">
              <svg v-if="flow.icon === 'bag'" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 5H14L13 15H5L4 5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                <path d="M7 5V4C7 2.9 7.9 2 9 2C10.1 2 11 2.9 11 4V5" stroke="currentColor" stroke-width="1.3"/>
              </svg>
              <svg v-else-if="flow.icon === 'headset'" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 10V9C3 5.7 5.7 3 9 3C12.3 3 15 5.7 15 9V10" stroke="currentColor" stroke-width="1.3"/>
                <rect x="2" y="10" width="3" height="5" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <rect x="13" y="10" width="3" height="5" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              </svg>
              <svg v-else-if="flow.icon === 'heart'" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 15.5L3.5 10C2 8.5 2 6.2 3.8 4.8C5.4 3.6 7.5 4 9 5.8C10.5 4 12.6 3.6 14.2 4.8C16 6.2 16 8.5 14.5 10L9 15.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 12L6 5L9 9L12 4L15 12H3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="flow-card__name">{{ flow.name }}</span>
          </div>
          <DashboardSparkline :data="flow.chart" :color="flow.color" />
        </div>
        <div class="flow-card__bottom">
          <span class="flow-card__tasks">{{ flow.openTasks }} tarefas abertas</span>
          <span class="flow-card__opp" :style="{ color: flow.color }">{{ flow.opportunities }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FlowCard } from '~/types/dashboard'

defineProps<{ flows: FlowCard[] }>()
</script>

<style scoped>
.flows {
  margin-bottom: 28px;
}

.flows__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.flow-card {
  padding: 18px;
  transition: transform var(--transition), box-shadow var(--transition);
}

.flow-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.flow-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.flow-card__identity {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flow-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-card__name {
  font-size: 14px;
  font-weight: 600;
}

.flow-card__bottom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.flow-card__tasks {
  font-size: 12px;
  color: var(--text-muted);
}

.flow-card__opp {
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .flows__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .flows__grid {
    grid-template-columns: 1fr;
  }
}
</style>
