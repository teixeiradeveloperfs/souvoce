<template>
  <button
    ref="el"
    type="button"
    class="magnetic-btn"
    :class="variant"
    :style="{ transform }"
    v-bind="$attrs"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'icon'
}>(), { variant: 'primary' })

const { el, transform, onMove, onLeave } = useMagnetic(0.15)
</script>

<style scoped>
.magnetic-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 13px;
  transition: transform 0.15s ease, box-shadow var(--transition), background var(--transition);
  will-change: transform;
}

.primary {
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
  color: white;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
}

.primary:hover {
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.5);
}

.ghost {
  padding: 8px 12px;
  color: var(--text-secondary);
  background: transparent;
}

.ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.icon {
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
}

.icon:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
</style>
