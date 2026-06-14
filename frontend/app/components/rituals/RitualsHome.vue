<template>
  <div class="rituals">
    <header class="rituals__header">
      <div>
        <h1 class="rituals__title">Rituais</h1>
        <p class="rituals__subtitle">
          Rotinas recorrentes da equipe — stand-ups, reviews e checklists automáticos.
        </p>
      </div>
      <button type="button" class="rituals__cta">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2V12M2 7H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Novo ritual
      </button>
    </header>

    <div class="rituals__stats">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card glass-card">
        <span class="stat-card__value">{{ stat.value }}</span>
        <span class="stat-card__label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="rituals__filters">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        class="rituals__filter"
        :class="{ active: activeFilter === filter.id }"
        @click="activeFilter = filter.id"
      >
        {{ filter.label }}
        <span class="rituals__filter-count">{{ filter.count }}</span>
      </button>
    </div>

    <div class="rituals__body">
      <div class="rituals__list">
        <section v-if="todayRituals.length" class="today-block glass-card">
          <h2 class="today-block__title">Para hoje</h2>
          <ul class="today-list">
            <li v-for="ritual in todayRituals" :key="ritual.id">
              <button
                type="button"
                class="today-item"
                :class="{ 'today-item--selected': selectedId === ritual.id }"
                @click="selectRitual(ritual.id)"
              >
                <span class="today-item__dot" :style="{ background: ritual.color }" />
                <div class="today-item__body">
                  <p class="today-item__name">{{ ritual.name }}</p>
                  <p class="today-item__meta">{{ ritual.nextRun }} · {{ progressFor(ritual) }}%</p>
                </div>
                <span v-if="progressFor(ritual) === 100" class="today-item__done">Feito</span>
              </button>
            </li>
          </ul>
        </section>

        <section class="ritual-grid">
          <button
            v-for="ritual in filteredRituals"
            :key="ritual.id"
            type="button"
            class="ritual-card glass-card"
            :class="{
              'ritual-card--selected': selectedId === ritual.id,
              'ritual-card--paused': !ritual.active,
            }"
            @click="selectRitual(ritual.id)"
          >
            <div class="ritual-card__top">
              <span class="ritual-card__icon" :style="{ background: `${ritual.color}20`, color: ritual.color }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V14M4 6L8 2L12 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="ritual-card__freq">{{ ritualFrequencyLabels[ritual.frequency] }}</span>
            </div>
            <h3 class="ritual-card__name">{{ ritual.name }}</h3>
            <p class="ritual-card__desc">{{ ritual.description }}</p>
            <div class="ritual-card__meta">
              <span>{{ ritual.flow }}</span>
              <span>·</span>
              <span>{{ ritual.schedule }}</span>
            </div>
            <div class="ritual-card__footer">
              <span v-if="ritual.active" class="ritual-card__streak">🔥 {{ ritual.streak }} dias</span>
              <span v-else class="ritual-card__paused">Pausado</span>
              <span class="ritual-card__progress">{{ progressFor(ritual) }}%</span>
            </div>
            <div class="ritual-card__bar">
              <span class="ritual-card__bar-fill" :style="{ width: `${progressFor(ritual)}%`, background: ritual.color }" />
            </div>
          </button>
        </section>
      </div>

      <aside v-if="selectedRitual" class="rituals__detail glass-card">
        <div class="detail__header">
          <div>
            <span class="detail__freq">{{ ritualFrequencyLabels[selectedRitual.frequency] }}</span>
            <h2 class="detail__title">{{ selectedRitual.name }}</h2>
            <p class="detail__desc">{{ selectedRitual.description }}</p>
          </div>
          <button
            type="button"
            class="detail__toggle"
            :class="{ 'detail__toggle--off': !selectedRitual.active }"
            @click="toggleActive(selectedRitual.id)"
          >
            {{ selectedRitual.active ? 'Ativo' : 'Pausado' }}
          </button>
        </div>

        <div class="detail__info">
          <div class="detail__info-item">
            <span class="detail__info-label">Próxima execução</span>
            <span class="detail__info-value">{{ selectedRitual.nextRun }}</span>
          </div>
          <div class="detail__info-item">
            <span class="detail__info-label">Última conclusão</span>
            <span class="detail__info-value">{{ selectedRitual.lastCompleted || '—' }}</span>
          </div>
          <div class="detail__info-item">
            <span class="detail__info-label">Sequência</span>
            <span class="detail__info-value">🔥 {{ selectedRitual.streak }} dias</span>
          </div>
        </div>

        <div class="detail__steps">
          <div class="detail__steps-head">
            <h3 class="detail__steps-title">Checklist</h3>
            <span class="detail__steps-progress">{{ progressFor(selectedRitual) }}%</span>
          </div>
          <ul class="steps-list">
            <li v-for="step in selectedRitual.steps" :key="step.id">
              <button
                type="button"
                class="step-item"
                :class="{ 'step-item--done': step.done }"
                @click="toggleStep(selectedRitual.id, step.id)"
              >
                <span class="step-item__check">
                  <svg v-if="step.done" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </span>
                <span class="step-item__label">{{ step.label }}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ritualFrequencyLabels } from '~/types/rituals'

const {
  activeFilter,
  selectedId,
  stats,
  filters,
  filteredRituals,
  todayRituals,
  selectedRitual,
  selectRitual,
  toggleStep,
  toggleActive,
  progressFor,
} = useRitualsData()

const statCards = computed(() => [
  { label: 'Ativos', value: stats.value.active },
  { label: 'Para hoje', value: stats.value.dueToday },
  { label: 'Concluídos hoje', value: stats.value.completedToday },
  { label: 'Sequência média', value: `${stats.value.avgStreak}d` },
])
</script>

<style scoped>
.rituals {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.rituals__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.rituals__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.rituals__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 520px;
}

.rituals__cta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--accent-neon), var(--accent-to));
  color: white;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
}

.rituals__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 16px 18px;
}

.stat-card__value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.stat-card__label {
  font-size: 12px;
  color: var(--text-muted);
}

.rituals__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.rituals__filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px solid transparent;
  transition: all var(--transition);
}

.rituals__filter.active {
  color: var(--text-primary);
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
}

.rituals__filter-count {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.12);
  color: var(--accent-to);
}

.rituals__body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.rituals__list {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.today-block {
  padding: 20px;
}

.today-block__title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.today-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.today-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  text-align: left;
  transition: background var(--transition);
}

.today-item:hover,
.today-item--selected {
  background: var(--bg-hover);
}

.today-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.today-item__name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.today-item__meta {
  font-size: 11px;
  color: var(--text-muted);
}

.today-item__done {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  color: #4ade80;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
}

.ritual-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.ritual-card {
  padding: 18px;
  text-align: left;
  transition: border-color var(--transition), transform var(--transition);
}

.ritual-card:hover {
  transform: translateY(-1px);
}

.ritual-card--selected {
  border-color: rgba(139, 92, 246, 0.45);
  box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.15);
}

.ritual-card--paused {
  opacity: 0.65;
}

.ritual-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.ritual-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ritual-card__freq {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--bg-elevated);
  color: var(--text-muted);
}

.ritual-card__name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

.ritual-card__desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ritual-card__meta {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.ritual-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 8px;
}

.ritual-card__streak {
  color: var(--text-secondary);
}

.ritual-card__paused {
  color: var(--text-muted);
}

.ritual-card__progress {
  font-weight: 600;
  color: var(--accent-to);
}

.ritual-card__bar {
  height: 4px;
  border-radius: 999px;
  background: var(--bg-elevated);
  overflow: hidden;
}

.ritual-card__bar-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.rituals__detail {
  width: 340px;
  flex-shrink: 0;
  padding: 20px;
  position: sticky;
  top: 0;
}

.detail__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.detail__freq {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.12);
  color: var(--accent-to);
  margin-bottom: 8px;
}

.detail__title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.detail__desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.detail__toggle {
  height: fit-content;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
  flex-shrink: 0;
}

.detail__toggle--off {
  background: var(--bg-elevated);
  color: var(--text-muted);
}

.detail__info {
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.detail__info-label {
  display: block;
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 3px;
}

.detail__info-value {
  font-size: 13px;
  font-weight: 500;
}

.detail__steps-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.detail__steps-title {
  font-size: 14px;
  font-weight: 600;
}

.detail__steps-progress {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-to);
}

.steps-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  text-align: left;
  transition: all var(--transition);
}

.step-item:hover {
  border-color: var(--border-medium);
}

.step-item--done .step-item__label {
  text-decoration: line-through;
  color: var(--text-muted);
}

.step-item__check {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid var(--border-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.step-item--done .step-item__check {
  background: var(--accent-neon);
  border-color: var(--accent-neon);
}

.step-item__label {
  font-size: 13px;
  line-height: 1.4;
}

@media (max-width: 1100px) {
  .rituals__body {
    flex-direction: column;
  }

  .rituals__detail {
    width: 100%;
    position: static;
  }

  .ritual-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .rituals__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .rituals {
    padding: 20px 20px 16px;
  }

  .rituals__header {
    flex-direction: column;
  }

  .rituals__cta {
    width: 100%;
    justify-content: center;
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
