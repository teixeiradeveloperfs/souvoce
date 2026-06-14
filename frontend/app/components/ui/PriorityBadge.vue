<template>
  <span class="priority" :class="`priority--${priority}`">
    <svg v-if="priority === 'high'" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2L10 9H2L6 2Z" fill="currentColor" />
    </svg>
    <svg v-else-if="priority === 'medium'" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 3L8.5 8H3.5L6 3Z" fill="currentColor" />
    </svg>
    <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 4L7.5 7.5H4.5L6 4Z" fill="currentColor" />
    </svg>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { Priority } from '~/types/project'

const props = defineProps<{ priority: Priority }>()

const label = computed(() => ({
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}[props.priority]))
</script>

<style scoped>
.priority {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
}

.priority--low { color: var(--text-muted); }
.priority--medium { color: #F59E0B; }
.priority--high { color: #EF4444; }
</style>
