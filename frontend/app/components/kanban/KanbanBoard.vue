<template>
  <section class="board">
    <div class="board__columns">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :tasks="getTasksByColumn(column.id)"
        :selected-task-id="selectedTaskId"
        @select="emit('select', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Column, ColumnId, Task } from '~/types/project'

defineProps<{
  columns: Column[]
  selectedTaskId: string | null
  getTasksByColumn: (id: ColumnId) => Task[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.board__columns {
  display: flex;
  gap: 16px;
  padding: 0 24px 24px;
  overflow-x: auto;
  flex: 1;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
}

@media (max-width: 768px) {
  .board__columns {
    padding: 0 16px 8px;
    gap: 12px;
  }
}
</style>
