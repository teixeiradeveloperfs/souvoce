<template>
  <div class="dashboard">
    <div class="dashboard__main">
      <DashboardHero />
      <DashboardStats :stats="stats" />
      <DashboardFlows :flows="flows" />
      <DashboardActivityGrid :activities="activities" :tasks="priorityTasks" />
      <DashboardAiWidget />
    </div>

    <aside class="dashboard__rail">
      <DashboardSmartAlerts :alerts="alerts" />
      <DashboardAgenda :items="agenda" />
      <DashboardTeamActivity :items="teamActivity" />
    </aside>
  </div>
</template>

<script setup lang="ts">
const { stats, flows, alerts, activities, priorityTasks, agenda, teamActivity } = useDashboardData()
</script>

<style scoped>
.dashboard {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.dashboard__main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.dashboard__rail {
  width: 340px;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 28px 20px 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-left: 1px solid var(--border-subtle);
}

.dashboard__main::-webkit-scrollbar,
.dashboard__rail::-webkit-scrollbar {
  width: 5px;
}

@media (max-width: 1100px) {
  .dashboard {
    flex-direction: column;
    overflow-y: auto;
  }

  .dashboard__main {
    overflow: visible;
    padding: 20px 20px;
  }

  .dashboard__rail {
    width: 100%;
    overflow: visible;
    padding: 24px 20px 32px;
    border-left: none;
    border-top: 1px solid var(--border-subtle);
  }
}

@media (max-width: 768px) {
  .dashboard__main {
    padding: 16px 20px 8px;
  }

  .dashboard__rail {
    padding: 24px 20px calc(16px + var(--mobile-nav-offset));
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

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-head__title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.section-head__badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-neon);
}
</style>
