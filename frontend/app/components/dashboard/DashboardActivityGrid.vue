<template>
  <div class="grid">
    <section class="panel glass-card">
      <div class="section-head">
        <h2 class="section-head__title">Atividade recente</h2>
      </div>
      <ul class="feed">
        <li v-for="item in activities" :key="item.id" class="feed__item">
          <DashboardPlatformIcon :platform="item.platform" />
          <div class="feed__body">
            <p class="feed__title">{{ item.title }}</p>
            <p class="feed__source">{{ item.source }}</p>
            <div class="feed__meta">
              <span v-if="item.tag" class="feed__tag">{{ item.tag }}</span>
              <span class="feed__time">{{ item.timestamp }}</span>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <section class="panel glass-card">
      <div class="section-head">
        <h2 class="section-head__title">Tarefas prioritárias</h2>
      </div>
      <ul class="tasks">
        <li v-for="task in tasks" :key="task.id" class="task">
          <span class="task__priority" :class="`task__priority--${task.priority}`">
            <svg v-if="task.priority === 'high'" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2L10 9H2L6 2Z" fill="currentColor"/>
            </svg>
            <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4" stroke="currentColor" stroke-width="1.2"/>
            </svg>
          </span>
          <div class="task__body">
            <p class="task__title">{{ task.title }}</p>
            <div class="task__meta">
              <span class="task__flow">{{ task.flow }}</span>
              <span class="task__dot">·</span>
              <span>{{ task.assignee }}</span>
            </div>
          </div>
          <span class="task__due" :class="{ 'task__due--today': task.due === 'Hoje' }">{{ task.due }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ActivityItem, PriorityTask } from '~/types/dashboard'

defineProps<{
  activities: ActivityItem[]
  tasks: PriorityTask[]
}>()
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.panel {
  padding: 20px;
}

.feed,
.tasks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feed__item,
.task {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.feed__item:last-child,
.task:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.feed__body,
.task__body {
  flex: 1;
  min-width: 0;
}

.feed__title,
.task__title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 3px;
}

.feed__source,
.task__meta {
  font-size: 11px;
  color: var(--text-muted);
}

.feed__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.feed__tag {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-neon);
}

.feed__time {
  font-size: 10px;
  color: var(--text-muted);
}

.task__priority {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.task__priority--high {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.task__priority--medium {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.task__flow {
  color: var(--accent-neon);
}

.task__dot {
  margin: 0 2px;
}

.task__due {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.task__due--today {
  color: #fb923c;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
