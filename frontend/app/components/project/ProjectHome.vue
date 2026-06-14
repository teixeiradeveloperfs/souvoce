<template>
  <div class="project-page">
    <header class="project-page__header">
      <div class="project-page__identity">
        <span class="project-page__dot" :style="{ background: project?.color }" />
        <div>
          <p class="project-page__org">
            <span class="project-page__org-dot" :style="{ background: organization?.color }" />
            {{ organization?.label }}
          </p>
          <h1 class="project-page__title">{{ project?.label }}</h1>
          <p class="project-page__subtitle">{{ project?.description }}</p>
        </div>
      </div>
      <div class="project-page__stats">
        <div class="project-page__stat glass-card">
          <span class="project-page__stat-value">{{ project?.openTasks }}</span>
          <span class="project-page__stat-label">Tarefas abertas</span>
        </div>
        <div class="project-page__stat glass-card">
          <span class="project-page__stat-value">{{ project?.members }}</span>
          <span class="project-page__stat-label">Membros</span>
        </div>
      </div>
    </header>

    <section class="project-page__panel glass-card">
      <h2 class="project-page__panel-title">Atividade recente</h2>
      <ul class="project-page__list">
        <li v-for="item in activity" :key="item.id" class="project-page__item">
          <span class="project-page__item-dot" :style="{ background: project?.color }" />
          <div>
            <p class="project-page__item-title">{{ item.title }}</p>
            <p class="project-page__item-meta">{{ item.meta }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getProject, getOrganization, selectProject } = useOrganization()

const project = computed(() => getProject(String(route.params.id)))
const organization = computed(() => {
  const orgId = project.value?.organizationId
  return orgId ? getOrganization(orgId) : undefined
})

watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string' && getProject(id)) {
      selectProject(id, { navigate: false })
    }
  },
  { immediate: true },
)

const activity = computed(() => [
  { id: '1', title: 'Tarefa atualizada no fluxo', meta: 'há 12 min' },
  { id: '2', title: 'Nova menção detectada via WhatsApp', meta: 'há 35 min' },
  { id: '3', title: 'Ritual concluído pela equipe', meta: 'há 1h' },
])
</script>

<style scoped>
.project-page {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.project-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.project-page__identity {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.project-page__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-top: 14px;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.04);
}

.project-page__org {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.project-page__org-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.project-page__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.project-page__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 480px;
}

.project-page__stats {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.project-page__stat {
  padding: 14px 18px;
  min-width: 120px;
}

.project-page__stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.project-page__stat-label {
  font-size: 11px;
  color: var(--text-muted);
}

.project-page__panel {
  padding: 20px;
}

.project-page__panel-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.project-page__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-page__item {
  display: flex;
  gap: 12px;
}

.project-page__item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.project-page__item-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 3px;
}

.project-page__item-meta {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .project-page {
    padding: 20px 20px 16px;
  }

  .project-page__header {
    flex-direction: column;
  }
}
</style>

<style>
.glass-card {
  background: var(--glass-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}
</style>
