<template>
  <div class="activities">
    <header class="activities__header">
      <div>
        <h1 class="activities__title">Atividades</h1>
        <p class="activities__subtitle">
          Histórico em tempo real — mensagens, tarefas, ações da equipe e detecções de IA.
        </p>
      </div>
    </header>

    <div class="activities__stats">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card glass-card">
        <span class="stat-card__value">{{ stat.value }}</span>
        <span class="stat-card__label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="activities__filters">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        class="activities__filter"
        :class="{ active: activeFilter === filter.id }"
        @click="activeFilter = filter.id"
      >
        {{ filter.label }}
        <span class="activities__filter-count">{{ filter.count }}</span>
      </button>
    </div>

    <div class="activities__feed">
      <section
        v-for="group in groupedActivities"
        :key="group.group"
        class="feed-group glass-card"
      >
        <h2 class="feed-group__label">{{ group.label }}</h2>
        <ul class="feed-list">
          <li v-for="item in group.items" :key="item.id" class="feed-item">
            <div class="feed-item__icon" :class="`feed-item__icon--${item.kind}`">
              <DashboardPlatformIcon
                v-if="item.platform && item.platform !== 'internal'"
                :platform="item.platform"
              />
              <span v-else-if="item.actor" class="feed-item__avatar" :style="{ background: item.actor.color }">
                {{ item.actor.avatar }}
              </span>
              <svg v-else-if="item.kind === 'ai'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L9.5 6.5L14 7L10.5 10L11.5 14.5L8 12L4.5 14.5L5.5 10L2 7L6.5 6.5L8 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M3 4H10M3 12H8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </div>

            <div class="feed-item__body">
              <div class="feed-item__top">
                <p class="feed-item__title">{{ item.title }}</p>
                <span class="feed-item__kind">{{ activityKindLabels[item.kind] }}</span>
              </div>
              <p class="feed-item__desc">{{ item.description }}</p>
              <div class="feed-item__meta">
                <span v-if="item.flow" class="feed-item__flow" :style="{ color: item.flowColor }">{{ item.flow }}</span>
                <InboxPlatformBadge v-if="item.platform" :platform="item.platform" />
                <span class="feed-item__time">{{ item.timestamp }}</span>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <p v-if="!groupedActivities.length" class="activities__empty glass-card">
        Nenhuma atividade neste filtro.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { activityKindLabels } from '~/types/activities'

const { activeFilter, stats, filters, groupedActivities } = useActivitiesData()

const statCards = computed(() => [
  { label: 'Hoje', value: stats.value.today },
  { label: 'Tarefas', value: stats.value.tasks },
  { label: 'Detecções IA', value: stats.value.ai },
  { label: 'Equipe', value: stats.value.team },
])
</script>

<style scoped>
.activities {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.activities__header {
  margin-bottom: 24px;
}

.activities__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.activities__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.activities__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 16px 18px;
}

.stat-card__value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.stat-card__label {
  font-size: 12px;
  color: var(--text-muted);
}

.activities__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.activities__filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px solid transparent;
  transition: all var(--transition);
}

.activities__filter.active {
  color: var(--text-primary);
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
}

.activities__filter-count {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.12);
  color: var(--accent-to);
}

.activities__feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-group {
  padding: 20px;
}

.feed-group__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.feed-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.feed-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.feed-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.feed-item:first-child {
  padding-top: 0;
}

.feed-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feed-item__icon--message { background: rgba(96, 165, 250, 0.12); color: #60a5fa; }
.feed-item__icon--task { background: rgba(139, 92, 246, 0.12); color: var(--accent-neon); }
.feed-item__icon--team { background: rgba(34, 197, 94, 0.12); color: #4ade80; }
.feed-item__icon--ai { background: rgba(249, 115, 22, 0.12); color: #fb923c; }

.feed-item__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
}

.feed-item__body {
  flex: 1;
  min-width: 0;
}

.feed-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.feed-item__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.feed-item__kind {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  flex-shrink: 0;
}

.feed-item__desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 8px;
}

.feed-item__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.feed-item__flow {
  font-size: 11px;
  font-weight: 600;
}

.feed-item__time {
  font-size: 11px;
  color: var(--text-muted);
  margin-left: auto;
}

.activities__empty {
  padding: 40px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 900px) {
  .activities__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .activities {
    padding: 20px 20px 16px;
  }

  .feed-item__time {
    margin-left: 0;
    width: 100%;
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
  box-shadow: var(--shadow-sm);
}
</style>
