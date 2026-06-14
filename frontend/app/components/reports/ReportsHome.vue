<template>
  <div class="reports">
    <header class="reports__header">
      <div>
        <h1 class="reports__title">Relatórios</h1>
        <p class="reports__subtitle">
          Métricas de desempenho — tarefas, fluxos, plataformas e detecções de IA.
        </p>
      </div>
      <div class="reports__actions">
        <div class="period-switch">
          <button
            v-for="(label, key) in reportPeriodLabels"
            :key="key"
            type="button"
            class="period-switch__btn"
            :class="{ active: period === key }"
            @click="period = key"
          >
            {{ label }}
          </button>
        </div>
        <button type="button" class="reports__export">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2V9M4 6L7 9L10 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 11H12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          Exportar
        </button>
      </div>
    </header>

    <div class="reports__kpis">
      <article v-for="kpi in kpis" :key="kpi.id" class="kpi-card glass-card">
        <span class="kpi-card__label">{{ kpi.label }}</span>
        <span class="kpi-card__value">{{ kpi.value }}</span>
        <span class="kpi-card__change" :class="{ up: kpi.up }">{{ kpi.change }} vs período anterior</span>
      </article>
    </div>

    <div class="reports__filters">
      <button
        v-for="filter in flowFilters"
        :key="filter.id"
        type="button"
        class="reports__filter"
        :class="{ active: flowFilter === filter.id }"
        @click="flowFilter = filter.id"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="reports__body">
      <div class="reports__main">
        <section class="panel glass-card">
          <div class="panel__head">
            <h2 class="panel__title">Volume de tarefas</h2>
            <span class="panel__meta">Últimos 7 dias</span>
          </div>
          <div class="bar-chart">
            <div v-for="(value, i) in weeklyVolume" :key="weekDays[i]" class="bar-chart__col">
              <span class="bar-chart__value">{{ value }}</span>
              <div class="bar-chart__track">
                <span
                  class="bar-chart__fill"
                  :style="{ height: `${(value / Math.max(...weeklyVolume)) * 100}%` }"
                />
              </div>
              <span class="bar-chart__label">{{ weekDays[i] }}</span>
            </div>
          </div>
        </section>

        <section class="panel glass-card">
          <div class="panel__head">
            <h2 class="panel__title">Desempenho por fluxo</h2>
          </div>
          <div class="flow-table">
            <div class="flow-table__head">
              <span>Fluxo</span>
              <span>Concluídas</span>
              <span>Abertas</span>
              <span>Taxa</span>
              <span>Resposta</span>
              <span>IA</span>
              <span>Tendência</span>
            </div>
            <div v-for="flow in flowReports" :key="flow.id" class="flow-table__row">
              <div class="flow-table__flow">
                <span class="flow-table__dot" :style="{ background: flow.color }" />
                {{ flow.name }}
              </div>
              <span>{{ flow.tasksCompleted }}</span>
              <span>{{ flow.tasksOpen }}</span>
              <span class="flow-table__rate">{{ flow.completionRate }}%</span>
              <span>{{ flow.avgResponseTime }}</span>
              <span>{{ flow.aiDetections }}</span>
              <DashboardSparkline :data="flow.chart" :color="flow.color" :width="80" :height="32" />
            </div>
          </div>
        </section>
      </div>

      <aside class="reports__rail">
        <section class="panel glass-card">
          <div class="panel__head">
            <h2 class="panel__title">Por plataforma</h2>
          </div>
          <ul class="platform-list">
            <li v-for="platform in platformData" :key="platform.id" class="platform-item">
              <div class="platform-item__top">
                <span class="platform-item__name">{{ platform.name }}</span>
                <span class="platform-item__share">{{ platform.share }}%</span>
              </div>
              <div class="platform-item__bar">
                <span class="platform-item__fill" :style="{ width: `${platform.share}%`, background: platform.color }" />
              </div>
              <div class="platform-item__meta">
                <span>{{ platform.conversations }} conversas</span>
                <span>{{ platform.tasksCreated }} tarefas</span>
              </div>
            </li>
          </ul>
        </section>

        <section class="panel glass-card">
          <div class="panel__head">
            <h2 class="panel__title">Detecções de IA</h2>
          </div>
          <ul class="ai-list">
            <li v-for="metric in aiMetrics" :key="metric.id" class="ai-item">
              <div class="ai-item__top">
                <span>{{ metric.label }}</span>
                <span class="ai-item__value">{{ metric.value }}</span>
              </div>
              <div class="ai-item__bar">
                <span
                  class="ai-item__fill"
                  :style="{ width: `${(metric.value / metric.total) * 100}%` }"
                />
              </div>
            </li>
          </ul>
        </section>

        <section class="panel glass-card">
          <div class="panel__head">
            <h2 class="panel__title">Equipe</h2>
          </div>
          <ul class="team-list">
            <li v-for="member in teamPerformance" :key="member.id" class="team-item">
              <span class="team-item__avatar" :style="{ background: member.color }">{{ member.avatar }}</span>
              <div class="team-item__body">
                <span class="team-item__name">{{ member.name }}</span>
                <span class="team-item__meta">{{ member.tasksDone }} tarefas · {{ member.responseRate }}% resposta</span>
              </div>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reportPeriodLabels } from '~/types/reports'

const {
  period,
  flowFilter,
  kpis,
  flowReports,
  platformData,
  aiMetrics,
  teamPerformance,
  weeklyVolume,
  weekDays,
  flowFilters,
} = useReportsData()
</script>

<style scoped>
.reports {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.reports__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.reports__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.reports__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.reports__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.period-switch {
  display: flex;
  padding: 3px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.period-switch__btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all var(--transition);
}

.period-switch__btn.active {
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.reports__export {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition);
}

.reports__export:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.reports__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.kpi-card {
  padding: 18px;
}

.kpi-card__label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.kpi-card__value {
  display: block;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.kpi-card__change {
  font-size: 11px;
  color: var(--text-muted);
}

.kpi-card__change.up {
  color: #4ade80;
}

.reports__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.reports__filter {
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px solid transparent;
  transition: all var(--transition);
}

.reports__filter.active {
  color: var(--text-primary);
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
}

.reports__body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.reports__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reports__rail {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel {
  padding: 20px;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.panel__title {
  font-size: 14px;
  font-weight: 600;
}

.panel__meta {
  font-size: 11px;
  color: var(--text-muted);
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 160px;
  padding-top: 8px;
}

.bar-chart__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-chart__value {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.bar-chart__track {
  flex: 1;
  width: 100%;
  max-width: 40px;
  display: flex;
  align-items: flex-end;
  background: var(--bg-elevated);
  border-radius: 8px 8px 4px 4px;
  overflow: hidden;
}

.bar-chart__fill {
  display: block;
  width: 100%;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, var(--accent-neon), var(--accent-to));
  transition: height 0.3s ease;
}

.bar-chart__label {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 8px;
}

.flow-table__head,
.flow-table__row {
  display: grid;
  grid-template-columns: 1.4fr repeat(5, 0.7fr) 90px;
  gap: 8px;
  align-items: center;
  padding: 10px 0;
}

.flow-table__head {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 12px;
}

.flow-table__row {
  font-size: 13px;
  border-bottom: 1px solid var(--border-subtle);
}

.flow-table__row:last-child {
  border-bottom: none;
}

.flow-table__flow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.flow-table__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.flow-table__rate {
  font-weight: 600;
  color: #4ade80;
}

.platform-list,
.ai-list,
.team-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.platform-item__top,
.ai-item__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.platform-item__share,
.ai-item__value {
  font-weight: 600;
  color: var(--accent-to);
}

.platform-item__bar,
.ai-item__bar {
  height: 6px;
  border-radius: 999px;
  background: var(--bg-elevated);
  overflow: hidden;
  margin-bottom: 8px;
}

.platform-item__fill,
.ai-item__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.ai-item__fill {
  background: linear-gradient(90deg, var(--accent-neon), var(--accent-to));
}

.platform-item__meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
}

.team-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-item__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.team-item__body {
  min-width: 0;
}

.team-item__name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.team-item__meta {
  font-size: 11px;
  color: var(--text-muted);
}

@media (max-width: 1100px) {
  .reports__body {
    flex-direction: column;
  }

  .reports__rail {
    width: 100%;
  }

  .flow-table__head,
  .flow-table__row {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .flow-table__head span:nth-child(n+3),
  .flow-table__row span:nth-child(n+3),
  .flow-table__row :deep(svg) {
    display: none;
  }
}

@media (max-width: 900px) {
  .reports__kpis {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .reports {
    padding: 20px 20px 16px;
  }

  .reports__header {
    flex-direction: column;
  }

  .reports__actions {
    width: 100%;
    flex-wrap: wrap;
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
