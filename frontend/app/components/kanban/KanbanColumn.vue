<template>
  <div class="column">
    <div class="column__header">
      <span class="column__dot" :style="{ backgroundColor: column.color }" />
      <span class="column__title">{{ column.title }}</span>
      <span class="column__count">{{ tasks.length }}</span>
    </div>

    <div class="column__cards">
      <TransitionGroup name="card">
        <KanbanTaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :selected="selectedTaskId === task.id"
          @select="emit('select', $event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Column, Task } from '~/types/project'

defineProps<{
  column: Column
  tasks: Task[]
  selectedTaskId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<style scoped>
.column {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  scroll-snap-align: start;
}

.column__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px 14px;
  flex-shrink: 0;
}

.column__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.column__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.column__count {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: 999px;
}

.column__cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 2px 4px 16px;
  flex: 1;
}

.column__cards::-webkit-scrollbar {
  width: 4px;
}

@media (max-width: 768px) {
  .column {
    flex: 0 0 min(78vw, 300px);
  }
}
</style>
