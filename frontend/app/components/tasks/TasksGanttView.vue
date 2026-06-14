<template>
  <div class="gantt-view">
    <div class="gantt-view__scroll">
      <div class="gantt-view__grid">
        <div class="gantt-view__sidebar">
          <div class="gantt-view__sidebar-head">Tarefa</div>
          <div
            v-for="task in sortedTasks"
            :key="task.id"
            class="gantt-view__row-label"
            :class="{ 'gantt-view__row-label--selected': selectedTaskId === task.id }"
            @click="emit('select', task.id)"
          >
            <span class="gantt-view__row-dot" :style="{ background: getColumnColor(task.columnId) }" />
            <span class="gantt-view__row-title">{{ task.title }}</span>
          </div>
        </div>

        <div class="gantt-view__chart">
          <div class="gantt-view__ticks">
            <span
              v-for="tick in ticks"
              :key="tick"
              class="gantt-view__tick"
              :style="{ left: `${tickPosition(tick)}%` }"
            >
              {{ formatTimelineLabel(tick) }}
            </span>
          </div>

          <div class="gantt-view__rows">
            <div
              v-for="task in sortedTasks"
              :key="task.id"
              class="gantt-view__row"
              :class="{ 'gantt-view__row--selected': selectedTaskId === task.id }"
              @click="emit('select', task.id)"
            >
              <div class="gantt-view__grid-lines">
                <span v-for="tick in ticks" :key="tick" class="gantt-view__grid-line" :style="{ left: `${tickPosition(tick)}%` }" />
              </div>
              <div
                class="gantt-view__bar"
                :style="{
                  left: `${barFor(task).left}%`,
                  width: `${barFor(task).width}%`,
                  background: getColumnColor(task.columnId),
                }"
              >
                <span class="gantt-view__bar-label">{{ task.progress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/project'
import {
  TASK_TIMELINE_MAX_DAY,
  TASK_TIMELINE_MIN_DAY,
  formatTimelineLabel,
  getBarPosition,
  getTimelineTicks,
  parseDueDay,
} from '~/utils/taskDates'

const props = defineProps<{
  tasks: Task[]
  selectedTaskId: string | null
  getColumnColor: (columnId: Task['columnId']) => string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const ticks = getTimelineTicks()

const sortedTasks = computed(() =>
  [...props.tasks].sort((a, b) => parseDueDay(a.dueDate) - parseDueDay(b.dueDate)),
)

function tickPosition(day: number) {
  const range = TASK_TIMELINE_MAX_DAY - TASK_TIMELINE_MIN_DAY
  return ((day - TASK_TIMELINE_MIN_DAY) / range) * 100
}

function barFor(task: Task) {
  return getBarPosition(task.dueDate, task.progress)
}
</script>

<style scoped>
.gantt-view {
  flex: 1;
  min-height: 0;
  padding: 0 24px 24px;
}

.gantt-view__scroll {
  height: 100%;
  overflow: auto;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: rgba(12, 18, 36, 0.45);
}

.gantt-view__grid {
  display: grid;
  grid-template-columns: 240px minmax(520px, 1fr);
  min-width: 760px;
}

.gantt-view__sidebar {
  border-right: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}

.gantt-view__sidebar-head {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 14px 16px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}

.gantt-view__row-label {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: background var(--transition);
}

.gantt-view__row-label:hover,
.gantt-view__row--selected {
  background: var(--bg-hover);
}

.gantt-view__row-label--selected {
  background: var(--bg-active);
}

.gantt-view__row-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.gantt-view__row-title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gantt-view__chart {
  min-width: 0;
}

.gantt-view__ticks {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 44px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}

.gantt-view__tick {
  position: absolute;
  top: 14px;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

.gantt-view__rows {
  display: flex;
  flex-direction: column;
}

.gantt-view__row {
  position: relative;
  height: 52px;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
}

.gantt-view__grid-lines {
  position: absolute;
  inset: 0;
}

.gantt-view__grid-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.04);
}

.gantt-view__bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 24px;
  min-width: 48px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  opacity: 0.92;
}

.gantt-view__bar-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
}

@media (max-width: 768px) {
  .gantt-view {
    padding: 0 16px 16px;
  }
}
</style>
