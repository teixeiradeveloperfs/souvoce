<template>
  <section class="panel glass-card">
    <div class="section-head">
      <h2 class="section-head__title">Agenda de hoje</h2>
    </div>

    <ul class="agenda">
      <li v-for="item in items" :key="item.id" class="agenda__item">
        <span class="agenda__time">{{ item.time }}</span>
        <div class="agenda__bar" :style="{ background: item.color }" />
        <div class="agenda__body">
          <p class="agenda__title">{{ item.title }}</p>
          <span class="agenda__cat">{{ item.category }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { AgendaItem } from '~/types/dashboard'

defineProps<{ items: AgendaItem[] }>()
</script>

<style scoped>
.panel {
  padding: 20px;
}

.agenda {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.agenda__item {
  display: flex;
  align-items: stretch;
  gap: 12px;
}

.agenda__time {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  width: 40px;
  flex-shrink: 0;
  padding-top: 2px;
}

.agenda__bar {
  width: 3px;
  border-radius: 999px;
  flex-shrink: 0;
}

.agenda__title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.agenda__cat {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
