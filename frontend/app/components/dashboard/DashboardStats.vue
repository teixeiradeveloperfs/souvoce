<template>
  <div class="stats">
    <article v-for="stat in stats" :key="stat.id" class="stat-card glass-card">
      <div class="stat-card__icon" :style="{ background: stat.iconBg }">
        <svg v-if="stat.icon === 'check'" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6.5" stroke="#8B5CF6" stroke-width="1.3"/>
          <path d="M6 9L8 11L12 7" stroke="#8B5CF6" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="stat.icon === 'done'" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 9.5L7.5 13L14 5.5" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="stat.icon === 'wave'" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 10C4 7 6 13 9 7C12 13 14 7 16 10" stroke="#60A5FA" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3L10.8 7.2L15 8L10.8 8.8L9 13L7.2 8.8L3 8L7.2 7.2L9 3Z" stroke="#FB923C" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="stat-card__body">
        <span class="stat-card__label">{{ stat.label }}</span>
        <span class="stat-card__value">{{ stat.value }}</span>
        <span
          v-if="stat.trend"
          class="stat-card__meta stat-card__meta--up"
        >
          {{ stat.trend }}
        </span>
        <span
          v-else-if="stat.status"
          class="stat-card__meta"
          :style="{ color: stat.statusColor }"
        >
          {{ stat.status }}
        </span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { StatCard } from '~/types/dashboard'

defineProps<{ stats: StatCard[] }>()
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
}

.stat-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card__label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.stat-card__value {
  display: block;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-card__meta {
  font-size: 11px;
  font-weight: 500;
}

.stat-card__meta--up {
  color: #4ade80;
}

@media (max-width: 1200px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
