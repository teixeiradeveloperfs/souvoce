<template>
  <div class="app-shell">
    <LayoutAppSidebar class="app-shell__sidebar" />

    <div class="main-area">
      <LayoutAppTopbar class="main-area__topbar" />
      <LayoutMobileHeader />

      <div class="workspace workspace--page">
        <slot />
      </div>
    </div>

    <LayoutMobileNav />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  height: 100dvh;
  background: var(--bg-base);
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.workspace {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.workspace--page {
  background:
    radial-gradient(ellipse 80% 50% at 20% -10%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 90% 100%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    var(--bg-base);
}

@media (max-width: 768px) {
  .app-shell__sidebar {
    display: none;
  }

  .main-area {
    width: 100%;
  }

  .main-area__topbar {
    display: none;
  }

  .workspace--page {
    overflow-y: auto;
    padding-bottom: var(--mobile-nav-offset);
  }
}
</style>
