<template>
  <section class="panel glass-card">
    <div class="section-head">
      <h2 class="section-head__title">Alertas inteligentes</h2>
      <span class="section-head__badge">{{ alerts.length }}</span>
    </div>

    <ul class="alerts">
      <li v-for="alert in alerts" :key="alert.id" class="alert">
        <div class="alert__content">
          <DashboardPlatformIcon :platform="alert.platform" />
          <div class="alert__body">
            <p class="alert__trigger">{{ alert.trigger }}</p>
            <p class="alert__source">{{ alert.source }}</p>
            <span class="alert__time">{{ alert.timestamp }}</span>
          </div>
        </div>
        <button type="button" class="alert__cta">Ver e criar tarefa</button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { SmartAlert } from '~/types/dashboard'

defineProps<{ alerts: SmartAlert[] }>()
</script>

<style scoped>
.panel {
  padding: 20px;
}

.alerts {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.alert:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.alert__content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.alert__body {
  flex: 1;
  min-width: 0;
}

.alert__trigger {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  margin-bottom: 4px;
}

.alert__source {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
  line-height: 1.4;
}

.alert__time {
  font-size: 10px;
  color: var(--text-muted);
}

.alert__cta {
  width: 100%;
  font-size: 11px;
  font-weight: 500;
  color: var(--accent-neon);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.35);
  text-align: center;
  transition: all var(--transition);
}

.alert__cta:hover {
  background: rgba(139, 92, 246, 0.12);
}
</style>
