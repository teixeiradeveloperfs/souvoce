<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background:
    radial-gradient(ellipse 80% 60% at 15% -10%, rgba(139, 92, 246, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 90% 110%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
    var(--bg-base);
}
</style>

<style>
html:has(.auth-layout),
body:has(.auth-layout),
#__nuxt:has(.auth-layout) {
  overflow: auto !important;
  height: auto !important;
  min-height: 100%;
}
</style>
