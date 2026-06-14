<template>
  <div class="my-day">
    <div class="my-day__main">
      <header class="my-day__hero">
        <div>
          <p class="my-day__date">{{ dateLabel }}</p>
          <h1 class="my-day__title">Meu dia</h1>
          <p class="my-day__subtitle">
            Seu plano pessoal — tarefas, reuniões e o que precisa de atenção agora.
          </p>
        </div>
        <div class="my-day__progress glass-card">
          <div class="my-day__progress-ring">
            <svg viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" class="my-day__progress-bg" />
              <circle
                cx="32"
                cy="32"
                r="26"
                class="my-day__progress-fill"
                :style="{ strokeDashoffset: ringOffset }"
              />
            </svg>
            <span class="my-day__progress-value">{{ progress }}%</span>
          </div>
          <div>
            <p class="my-day__progress-label">{{ completedCount }}/{{ totalCount }} tarefas</p>
            <p class="my-day__progress-meta">{{ pendingTasks.length }} restantes hoje</p>
          </div>
        </div>
      </header>

      <section class="my-day__focus">
        <div
          v-for="block in focusBlocks"
          :key="block.id"
          class="focus-block glass-card"
          :style="{ '--focus-color': block.color }"
        >
          <span class="focus-block__label">{{ block.label }}</span>
          <span class="focus-block__time">{{ block.time }}</span>
          <p class="focus-block__desc">{{ block.description }}</p>
        </div>
      </section>

      <section class="my-day__timeline glass-card">
        <div class="section-head">
          <h2 class="section-head__title">Linha do tempo</h2>
          <span class="section-head__meta">Hoje</span>
        </div>
        <ul class="timeline">
          <li v-for="item in timeline" :key="`${item.type}-${item.id}`" class="timeline__item">
            <span class="timeline__time">{{ item.time }}</span>
            <div class="timeline__track">
              <span class="timeline__dot" :style="{ background: item.color }" />
              <span class="timeline__line" />
            </div>
            <div class="timeline__body">
              <div class="timeline__top">
                <p class="timeline__title">{{ item.title }}</p>
                <span class="timeline__type">{{ item.type === 'event' ? 'Reunião' : 'Prazo' }}</span>
              </div>
              <p class="timeline__meta">{{ item.meta }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section class="my-day__tasks glass-card">
        <div class="section-head">
          <h2 class="section-head__title">Tarefas de hoje</h2>
          <span class="section-head__meta">{{ pendingTasks.length }} pendentes</span>
        </div>
        <ul class="task-list">
          <li v-for="task in tasks" :key="task.id" class="task-item">
            <button
              type="button"
              class="task-item__check"
              :class="{
                'task-item__check--done': task.status === 'done',
                'task-item__check--active': task.status === 'in_progress',
              }"
              :aria-label="task.status === 'done' ? 'Marcar como pendente' : 'Marcar como concluída'"
              @click="toggleTask(task.id)"
            >
              <svg v-if="task.status === 'done'" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <button type="button" class="task-item__body" @click="setInProgress(task.id)">
              <p class="task-item__title" :class="{ 'task-item__title--done': task.status === 'done' }">
                {{ task.title }}
              </p>
              <div class="task-item__meta">
                <span class="task-item__flow" :style="{ color: task.flowColor }">{{ task.flow }}</span>
                <span v-if="task.dueTime">· {{ task.dueTime }}</span>
                <span v-if="task.source">· {{ task.source }}</span>
              </div>
            </button>
            <span v-if="task.status === 'in_progress'" class="task-item__badge">Em andamento</span>
          </li>
        </ul>
      </section>
    </div>

    <aside class="my-day__rail">
      <section class="rail-card glass-card rail-card--ai">
        <div class="rail-card__ai-icon">✦</div>
        <p class="rail-card__ai-title">Souvo IA</p>
        <p class="rail-card__ai-text">
          Priorize o orçamento do Grupo Vendas SP antes das 15h — há 2 menções e uma oportunidade detectada.
        </p>
      </section>

      <section v-if="nextEvent" class="rail-card glass-card">
        <h3 class="rail-card__title">Próximo na agenda</h3>
        <div class="next-event">
          <span class="next-event__time">{{ nextEvent.time }}</span>
          <p class="next-event__title">{{ nextEvent.title }}</p>
          <p class="next-card__flow">{{ nextEvent.flow }}</p>
        </div>
      </section>

      <section class="rail-card glass-card">
        <div class="section-head">
          <h3 class="rail-card__title">Inbox urgente</h3>
          <NuxtLink :to="APP_ROUTES.inbox" class="rail-card__link">Ver tudo</NuxtLink>
        </div>
        <ul class="inbox-list">
          <li v-for="item in urgentInbox" :key="item.id">
            <NuxtLink :to="APP_ROUTES.inbox" class="urgent-item">
              <div class="urgent-item__body">
                <p class="urgent-item__title">{{ item.title }}</p>
                <p class="urgent-item__preview">{{ item.preview }}</p>
                <div class="urgent-item__meta">
                  <InboxPlatformBadge :platform="item.platform" />
                  <span>{{ item.source }}</span>
                  <span class="urgent-item__sep">·</span>
                  <span>{{ item.timestamp }}</span>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { APP_ROUTES } from '~/constants/routes'

const {
  tasks,
  focusBlocks,
  completedCount,
  totalCount,
  progress,
  pendingTasks,
  nextEvent,
  timeline,
  dateLabel,
  urgentInbox,
  toggleTask,
  setInProgress,
} = useMyDayData()

const ringOffset = computed(() => {
  const circumference = 2 * Math.PI * 26
  return circumference - (progress.value / 100) * circumference
})
</script>

<style scoped>
.my-day {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.my-day__main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.my-day__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.my-day__date {
  font-size: 13px;
  color: var(--accent-to);
  font-weight: 500;
  text-transform: capitalize;
  margin-bottom: 6px;
}

.my-day__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.my-day__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 480px;
}

.my-day__progress {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  flex-shrink: 0;
}

.my-day__progress-ring {
  position: relative;
  width: 64px;
  height: 64px;
}

.my-day__progress-ring svg {
  transform: rotate(-90deg);
}

.my-day__progress-bg {
  fill: none;
  stroke: var(--bg-elevated);
  stroke-width: 5;
}

.my-day__progress-fill {
  fill: none;
  stroke: var(--accent-neon);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 163.36;
  transition: stroke-dashoffset 0.4s ease;
}

.my-day__progress-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.my-day__progress-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.my-day__progress-meta {
  font-size: 12px;
  color: var(--text-muted);
}

.my-day__focus {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.focus-block {
  padding: 16px 18px;
  border-left: 3px solid var(--focus-color);
}

.focus-block__label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--focus-color);
  margin-bottom: 4px;
}

.focus-block__time {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.focus-block__desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.45;
}

.my-day__timeline,
.my-day__tasks {
  padding: 20px;
  margin-bottom: 16px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-head__title,
.rail-card__title {
  font-size: 14px;
  font-weight: 600;
}

.section-head__meta {
  font-size: 11px;
  color: var(--text-muted);
}

.timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline__item {
  display: flex;
  gap: 12px;
  min-height: 64px;
}

.timeline__time {
  width: 42px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  padding-top: 2px;
  flex-shrink: 0;
}

.timeline__track {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12px;
  flex-shrink: 0;
}

.timeline__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
}

.timeline__line {
  flex: 1;
  width: 2px;
  background: var(--border-subtle);
  margin: 4px 0;
}

.timeline__item:last-child .timeline__line {
  display: none;
}

.timeline__body {
  flex: 1;
  padding-bottom: 16px;
}

.timeline__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.timeline__title {
  font-size: 14px;
  font-weight: 500;
}

.timeline__type {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  flex-shrink: 0;
}

.timeline__meta {
  font-size: 12px;
  color: var(--text-muted);
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
}

.task-item__check {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1.5px solid var(--border-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  transition: all var(--transition);
}

.task-item__check--active {
  border-color: var(--accent-neon);
  background: rgba(139, 92, 246, 0.15);
}

.task-item__check--done {
  background: var(--accent-neon);
  border-color: var(--accent-neon);
}

.task-item__body {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.task-item__title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 3px;
}

.task-item__title--done {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-item__meta {
  font-size: 11px;
  color: var(--text-muted);
}

.task-item__flow {
  font-weight: 500;
}

.task-item__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-to);
  flex-shrink: 0;
}

.my-day__rail {
  width: 340px;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 28px 20px 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-left: 1px solid var(--border-subtle);
}

.my-day__main::-webkit-scrollbar,
.my-day__rail::-webkit-scrollbar {
  width: 5px;
}

.rail-card {
  padding: 20px;
}

.rail-card--ai {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08));
}

.rail-card__ai-icon {
  font-size: 18px;
  color: var(--accent-neon);
  margin-bottom: 8px;
}

.rail-card__ai-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.rail-card__ai-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.rail-card__link {
  font-size: 11px;
  color: var(--accent-to);
}

.next-event__time {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-neon);
  margin-bottom: 6px;
}

.next-event__title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.next-card__flow {
  font-size: 12px;
  color: var(--text-muted);
}

.inbox-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.urgent-item {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: opacity var(--transition);
}

.urgent-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.urgent-item:first-child {
  padding-top: 0;
}

.urgent-item:hover {
  opacity: 0.85;
}

.urgent-item__body {
  min-width: 0;
}

.urgent-item__title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 4px;
}

.urgent-item__preview {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.urgent-item__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 10px;
  color: var(--text-muted);
}

.urgent-item__sep {
  opacity: 0.6;
}

@media (max-width: 1100px) {
  .my-day {
    flex-direction: column;
    overflow-y: auto;
  }

  .my-day__main {
    overflow: visible;
  }

  .my-day__rail {
    width: 100%;
    overflow: visible;
    padding: 24px 20px 32px;
    border-left: none;
    border-top: 1px solid var(--border-subtle);
  }
}

@media (max-width: 768px) {
  .my-day__main {
    padding: 20px 20px 16px;
  }

  .my-day__rail {
    padding: 24px 20px calc(16px + var(--mobile-nav-offset));
  }

  .my-day__hero {
    flex-direction: column;
  }

  .my-day__focus {
    grid-template-columns: 1fr;
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
