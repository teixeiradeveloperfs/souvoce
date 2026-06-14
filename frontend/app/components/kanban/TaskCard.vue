<template>
  <article
    class="task-card"
    :class="{ 'task-card--selected': selected, 'task-card--done': task.columnId === 'done' }"
    @click="emit('select', task.id)"
  >
    <div class="task-card__labels">
      <span
        v-for="label in task.labels"
        :key="label.id"
        class="label"
        :style="{ backgroundColor: `${label.color}20`, color: label.color }"
      >
        {{ label.name }}
      </span>
    </div>

    <h3 class="task-card__title">{{ task.title }}</h3>

    <div v-if="task.progress > 0 && task.columnId !== 'done'" class="task-card__progress">
      <div class="progress-bar">
        <div class="progress-bar__fill" :style="{ width: `${task.progress}%` }" />
      </div>
    </div>

    <div class="task-card__footer">
      <UiAvatarStack :users="task.assignees" />

      <div class="task-card__meta">
        <UiPriorityBadge :priority="task.priority" />

        <span v-if="task.dueDate" class="meta-item">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="2" width="9" height="8" rx="1" stroke="currentColor" stroke-width="1" />
            <path d="M1.5 4.5H10.5" stroke="currentColor" stroke-width="1" />
          </svg>
          {{ task.dueDate }}
        </span>

        <span v-if="task.commentsCount" class="meta-item">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2.5H10V8.5H5L2 10.5V8.5V2.5Z" stroke="currentColor" stroke-width="1" stroke-linejoin="round" />
          </svg>
          {{ task.commentsCount }}
        </span>

        <span v-if="task.columnId === 'done'" class="done-check">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" fill="#22C55E" opacity="0.15" />
            <path d="M4.5 7L6.5 9L9.5 5.5" stroke="#22C55E" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Task } from '~/types/project'

defineProps<{
  task: Task
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<style scoped>
.task-card {
  padding: 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-medium);
}

.task-card--selected {
  border-color: rgba(124, 58, 237, 0.5);
  box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.3), var(--shadow-md);
}

.task-card--done {
  opacity: 0.65;
}

.task-card--done .task-card__title {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.task-card__labels {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.label {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.task-card__title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.task-card__progress {
  margin-bottom: 12px;
}

.progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.task-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted);
}

.done-check {
  display: flex;
}
</style>
