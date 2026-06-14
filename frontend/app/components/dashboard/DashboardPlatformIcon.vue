<template>
  <span class="platform-icon" :class="`platform-icon--${platform}`">
    <svg v-if="platform === 'whatsapp'" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8C1.5 9.3 1.9 10.5 2.6 11.5L1.5 14.5L4.6 13.4C5.6 14 6.7 14.3 8 14.3C11.6 14.3 14.5 11.4 14.5 7.8C14.5 4.2 11.6 1.5 8 1.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M6 6.5C6.2 7.8 7.2 9.8 9.5 10.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
    </svg>
    <svg v-else-if="platform === 'instagram'" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="8" cy="8" r="2.8" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="11.5" cy="4.5" r="0.8" fill="currentColor"/>
    </svg>
    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 7.5L8 2L13.5 7.5V12.5C13.5 13.05 13.05 13.5 12.5 13.5H3.5C2.95 13.5 2.5 13.05 2.5 12.5V7.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M6 13.5V9H10V13.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
    </svg>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  platform: 'whatsapp' | 'instagram' | 'telegram'
}>()
</script>

<style scoped>
.platform-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.platform-icon--whatsapp {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

.platform-icon--instagram {
  background: rgba(236, 72, 153, 0.12);
  color: #f472b6;
}

.platform-icon--telegram {
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
}
</style>
