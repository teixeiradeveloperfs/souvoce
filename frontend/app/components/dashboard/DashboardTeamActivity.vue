<template>
  <section class="panel glass-card">
    <div class="section-head">
      <h2 class="section-head__title">Atividade da equipe</h2>
    </div>

    <ul class="team">
      <li v-for="item in items" :key="item.id" class="team__item">
        <div class="team__avatar" :style="{ background: item.user.color }">
          {{ item.user.avatar }}
          <span v-if="item.online" class="team__online" />
        </div>
        <div class="team__body">
          <p class="team__action-text">
            <strong>{{ item.user.name }}</strong> — {{ item.action }}
          </p>
          <span class="team__time">{{ item.timestamp }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { TeamActivityItem } from '~/types/dashboard'

defineProps<{ items: TeamActivityItem[] }>()
</script>

<style scoped>
.panel {
  padding: 20px;
}

.team {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.team__item {
  display: flex;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.team__item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.team__avatar {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.team__online {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--bg-elevated);
}

.team__action {
  display: none;
}

.team__action-text {
  font-size: 12px;
  line-height: 1.45;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.team__time {
  font-size: 10px;
  color: var(--text-muted);
}
</style>
