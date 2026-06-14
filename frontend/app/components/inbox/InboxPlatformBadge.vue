<template>
  <span class="badge" :class="`badge--${platform}`">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { InboxPlatform } from '~/types/inbox'

const props = defineProps<{ platform: InboxPlatform }>()

const label = computed(() => ({
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  telegram: 'Telegram',
  internal: 'Interno',
}[props.platform]))
</script>

<style scoped>
.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  flex-shrink: 0;
}

.badge--whatsapp { background: rgba(34, 197, 94, 0.12); color: #4ade80; }
.badge--instagram { background: rgba(236, 72, 153, 0.12); color: #f472b6; }
.badge--telegram { background: rgba(96, 165, 250, 0.12); color: #60a5fa; }
.badge--internal { background: rgba(139, 92, 246, 0.12); color: var(--accent-neon); }
</style>
