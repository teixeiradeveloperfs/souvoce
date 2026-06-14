<template>
  <div class="timeline-view">
    <div class="timeline-view__scroll">
      <div
        v-for="(group, index) in groupedTasks"
        :key="group.day"
        class="timeline-group"
      >
        <div class="timeline-group__date">
          <span class="timeline-group__day">{{ group.day }}</span>
          <span class="timeline-group__month">mai</span>
        </div>

        <div class="timeline-group__track">
          <span class="timeline-group__line" :class="{ 'timeline-group__line--last': index === groupedTasks.length - 1 }" />
          <div class="timeline-group__cards">
            <button
              v-for="task in group.tasks"
              :key="task.id"
              type="button"
              class="timeline-card glass-card"
              :class="{ 'timeline-card--selected': selectedTaskId === task.id }"
              @click="emit('select', task.id)"
            >
              <div class="timeline-card__head">
                <span class="timeline-card__status" :style="{ background: getColumnColor(task.columnId) }" />
                <span class="timeline-card__status-label">{{ getColumnTitle(task.columnId) }}</span>
                <UiPriorityBadge :priority="task.priority" />
              </div>
              <h3 class="timeline-card__title">{{ task.title }}</h3>
              <div class="timeline-card__footer">
                <UiAvatarStack :users="task.assignees" :max="3" />
                <span class="timeline-card__progress">{{ task.progress }}%</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/project'
import { formatTimelineLabel, parseDueDay } from '~/utils/taskDates'

const props = defineProps<{
  tasks: Task[]
  selectedTaskId: string | null
  getColumnTitle: (columnId: Task['columnId']) => string
  getColumnColor: (columnId: Task['columnId']) => string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const groupedTasks = computed(() => {
  const groups = new Map<number, Task[]>()

  props.tasks.forEach((task) => {
    const day = parseDueDay(task.dueDate)
    const list = groups.get(day) ?? []
    list.push(task)
    groups.set(day, list)
  })

  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([day, tasks]) => ({
      day,
      label: formatTimelineLabel(day),
      tasks: [...tasks].sort((a, b) => b.progress - a.progress),
    }))
})
</script>

<style scoped>
.timeline-view {
  flex: 1;
  min-height: 0;
  padding: 0 24px 24px;
}

.timeline-view__scroll {
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
}

.timeline-group {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 20px;
  margin-bottom: 8px;
}

.timeline-group__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
}

.timeline-group__day {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}

.timeline-group__month {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.timeline-group__track {
  position: relative;
  padding: 8px 0 16px 24px;
}

.timeline-group__line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--accent-from), rgba(139, 92, 246, 0.15));
}

.timeline-group__line::before {
  content: '';
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-from);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.18);
}

.timeline-group__line--last {
  bottom: auto;
  height: 28px;
}

.timeline-group__cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.timeline-card {
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  transition: border-color var(--transition), background var(--transition);
}

.timeline-card:hover {
  border-color: var(--border-medium);
}

.timeline-card--selected {
  border-color: rgba(139, 92, 246, 0.45);
  background: rgba(124, 58, 237, 0.08);
}

.timeline-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.timeline-card__status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.timeline-card__status-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin-right: auto;
}

.timeline-card__title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.timeline-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timeline-card__progress {
  font-size: 11px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .timeline-view {
    padding: 0 16px 16px;
  }

  .timeline-group {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
