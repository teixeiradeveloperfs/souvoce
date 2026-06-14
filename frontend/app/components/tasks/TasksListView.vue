<template>
  <div class="list-view">
    <div class="list-view__table-wrap">
      <table class="list-view__table">
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Status</th>
            <th>Responsáveis</th>
            <th>Prioridade</th>
            <th>Prazo</th>
            <th>Progresso</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in sortedTasks"
            :key="task.id"
            class="list-view__row"
            :class="{ 'list-view__row--selected': selectedTaskId === task.id }"
            @click="emit('select', task.id)"
          >
            <td>
              <div class="list-view__task">
                <span
                  v-if="task.labels[0]"
                  class="list-view__label"
                  :style="{ color: task.labels[0].color, background: `${task.labels[0].color}20` }"
                >
                  {{ task.labels[0].name }}
                </span>
                <span class="list-view__title">{{ task.title }}</span>
              </div>
            </td>
            <td>
              <span class="list-view__status" :style="{ '--status-color': getColumnColor(task.columnId) }">
                {{ getColumnTitle(task.columnId) }}
              </span>
            </td>
            <td>
              <UiAvatarStack :users="task.assignees" :max="3" />
            </td>
            <td>
              <UiPriorityBadge :priority="task.priority" />
            </td>
            <td class="list-view__due">{{ task.dueDate }}</td>
            <td>
              <div class="list-view__progress">
                <div class="list-view__progress-bar">
                  <div class="list-view__progress-fill" :style="{ width: `${task.progress}%` }" />
                </div>
                <span>{{ task.progress }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/project'
import { parseDueDay } from '~/utils/taskDates'

const props = defineProps<{
  tasks: Task[]
  selectedTaskId: string | null
  getColumnTitle: (columnId: Task['columnId']) => string
  getColumnColor: (columnId: Task['columnId']) => string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const sortedTasks = computed(() =>
  [...props.tasks].sort((a, b) => parseDueDay(a.dueDate) - parseDueDay(b.dueDate)),
)
</script>

<style scoped>
.list-view {
  flex: 1;
  min-height: 0;
  padding: 0 24px 24px;
  overflow: hidden;
}

.list-view__table-wrap {
  height: 100%;
  overflow: auto;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: rgba(12, 18, 36, 0.45);
}

.list-view__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.list-view__table th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.list-view__row {
  cursor: pointer;
  transition: background var(--transition);
}

.list-view__row:hover {
  background: var(--bg-hover);
}

.list-view__row--selected {
  background: var(--bg-active);
}

.list-view__row td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.list-view__task {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-view__label {
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
}

.list-view__title {
  font-weight: 500;
  color: var(--text-primary);
}

.list-view__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.list-view__status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-color);
}

.list-view__due {
  color: var(--text-secondary);
  white-space: nowrap;
}

.list-view__progress {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 120px;
}

.list-view__progress-bar {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: var(--bg-hover);
  overflow: hidden;
}

.list-view__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
}

.list-view__progress span {
  font-size: 11px;
  color: var(--text-muted);
  min-width: 32px;
}

@media (max-width: 768px) {
  .list-view {
    padding: 0 16px 16px;
  }

  .list-view__table-wrap {
    overflow-x: auto;
  }

  .list-view__table {
    min-width: 720px;
  }
}
</style>
