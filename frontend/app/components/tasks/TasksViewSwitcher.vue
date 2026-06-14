<template>
  <div class="view-switcher">
    <button
      v-for="view in views"
      :key="view.id"
      type="button"
      class="view-btn"
      :class="{ active: modelValue === view.id }"
      @click="emit('update:modelValue', view.id)"
    >
      <span class="view-btn__icon" v-html="view.icon" />
      {{ view.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TaskViewId, TaskViewOption } from '~/types/tasks'

defineProps<{
  modelValue: TaskViewId
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TaskViewId]
}>()

const views: TaskViewOption[] = [
  { id: 'list', label: 'Lista', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5H12M2 7H12M2 10.5H8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' },
  { id: 'kanban', label: 'Kanban', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2" width="3" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="5.5" y="2" width="3" height="7" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9.5" y="2" width="3" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>' },
  { id: 'timeline', label: 'Timeline', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M7 2V12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.2"/></svg>' },
  { id: 'gantt', label: 'Gantt', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/><rect x="3" y="6.5" width="10" height="2" rx="1" fill="currentColor" opacity="0.7"/><rect x="2" y="10" width="6" height="2" rx="1" fill="currentColor"/></svg>' },
]
</script>

<style scoped>
.view-switcher {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all var(--transition);
}

.view-btn:hover {
  color: var(--text-secondary);
}

.view-btn.active {
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.view-btn__icon {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .view-switcher {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .view-btn {
    padding: 6px 10px;
    font-size: 11px;
    white-space: nowrap;
  }
}
</style>
