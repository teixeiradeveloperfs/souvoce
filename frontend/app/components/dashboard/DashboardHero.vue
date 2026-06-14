<template>
  <section class="hero">
    <div class="hero__text">
      <h1 class="hero__title">Bom dia, Lucas 👋</h1>
      <p class="hero__subtitle">Aqui está o que está acontecendo nos seus fluxos hoje.</p>
    </div>

    <button type="button" class="hero__cta">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2V12M2 7H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      Nova tarefa
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="hero__cta-chevron">
        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      </svg>
    </button>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.hero__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.hero__subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.hero__cta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--accent-neon), var(--accent-to));
  color: white;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
  transition: transform var(--transition), box-shadow var(--transition);
  flex-shrink: 0;
}

.hero__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(139, 92, 246, 0.45);
}

.hero__cta-chevron {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    margin-bottom: 20px;
  }

  .hero__title {
    font-size: 22px;
  }

  .hero__cta {
    width: 100%;
    justify-content: center;
  }
}
</style>
