<template>
  <div class="avatar-stack">
    <div
      v-for="(user, i) in visibleUsers"
      :key="user.id"
      class="avatar"
      :style="{ backgroundColor: user.color, zIndex: visibleUsers.length - i }"
      :title="user.name"
    >
      {{ user.avatar }}
    </div>
    <div v-if="overflow > 0" class="avatar avatar--overflow">
      +{{ overflow }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/project'

const props = withDefaults(defineProps<{
  users: User[]
  max?: number
}>(), { max: 3 })

const visibleUsers = computed(() => props.users.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.users.length - props.max))
</script>

<style scoped>
.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: white;
  border: 2px solid var(--bg-elevated);
  margin-left: -6px;
  flex-shrink: 0;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar--overflow {
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 8px;
}
</style>
