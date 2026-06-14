<template>
  <div class="calendar-page">
    <header class="calendar-page__header">
      <div>
        <h1 class="calendar-page__title">Calendário</h1>
        <p class="calendar-page__subtitle">
          Reuniões, follow-ups e prazos dos seus fluxos num só lugar.
        </p>
      </div>
      <div class="calendar-page__actions">
        <div class="view-switch">
          <button
            type="button"
            class="view-switch__btn"
            :class="{ active: view === 'month' }"
            @click="view = 'month'"
          >
            Mês
          </button>
          <button
            type="button"
            class="view-switch__btn"
            :class="{ active: view === 'week' }"
            @click="view = 'week'"
          >
            Semana
          </button>
        </div>
        <button type="button" class="calendar-page__cta">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2V12M2 7H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Novo evento
        </button>
      </div>
    </header>

    <div class="calendar-page__filters">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="calendar-page__filter"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        <span class="calendar-page__filter-dot" :style="{ background: cat.color }" />
        {{ cat.label }}
      </button>
    </div>

    <div class="calendar-page__body">
      <section class="calendar-main glass-card">
        <div class="calendar-main__toolbar">
          <div class="calendar-main__nav">
            <button type="button" class="icon-btn" aria-label="Mês anterior" @click="prevMonth">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <h2 class="calendar-main__month">{{ monthLabel }}</h2>
            <button type="button" class="icon-btn" aria-label="Próximo mês" @click="nextMonth">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <button type="button" class="today-btn" @click="goToToday">Hoje</button>
        </div>

        <div v-if="view === 'month'" class="month-grid">
          <div v-for="day in weekDaysHeader" :key="day" class="month-grid__head">{{ day }}</div>
          <button
            v-for="(cell, i) in calendarDays"
            :key="i"
            type="button"
            class="month-grid__cell"
            :class="{
              'month-grid__cell--muted': !cell.isCurrentMonth,
              'month-grid__cell--today': cell.isToday,
              'month-grid__cell--selected': cell.isSelected,
            }"
            :disabled="!cell.date"
            @click="cell.date && selectDate(cell.date)"
          >
            <span v-if="cell.day" class="month-grid__day">{{ cell.day }}</span>
            <div v-if="cell.date" class="month-grid__events">
              <span
                v-for="event in eventsForDate(cell.date).slice(0, 3)"
                :key="event.id"
                class="month-grid__event"
                :style="{ background: `${event.color}30`, color: event.color, borderColor: `${event.color}50` }"
              >
                {{ event.title }}
              </span>
              <div class="month-grid__dots">
                <span
                  v-for="event in eventsForDate(cell.date).slice(0, 4)"
                  :key="`dot-${event.id}`"
                  class="month-grid__dot"
                  :style="{ background: event.color }"
                />
              </div>
              <span v-if="eventsForDate(cell.date).length > 3" class="month-grid__more">
                +{{ eventsForDate(cell.date).length - 3 }}
              </span>
            </div>
          </button>
        </div>

        <div v-else class="week-view">
          <div v-for="event in selectedDayEvents" :key="event.id" class="week-event">
            <span class="week-event__time">{{ event.startTime }}</span>
            <div class="week-event__bar" :style="{ background: event.color }" />
            <div class="week-event__body">
              <p class="week-event__title">{{ event.title }}</p>
              <p class="week-event__meta">{{ event.flow }} · {{ event.startTime }} – {{ event.endTime }}</p>
            </div>
          </div>
          <p v-if="!selectedDayEvents.length" class="week-view__empty">Nenhum evento neste dia.</p>
        </div>
      </section>

      <aside class="calendar-rail">
        <section class="rail-card glass-card">
          <h3 class="rail-card__title">{{ formatSelectedDate() }}</h3>
          <ul class="day-schedule">
            <li v-for="event in selectedDayEvents" :key="event.id" class="day-schedule__item">
              <span class="day-schedule__time">{{ event.startTime }}</span>
              <div class="day-schedule__bar" :style="{ background: event.color }" />
              <div class="day-schedule__body">
                <p class="day-schedule__title">{{ event.title }}</p>
                <p class="day-schedule__flow">{{ event.flow }}</p>
              </div>
            </li>
          </ul>
          <p v-if="!selectedDayEvents.length" class="rail-card__empty">Sem eventos neste dia.</p>
        </section>

        <section class="rail-card glass-card">
          <h3 class="rail-card__title">Próximos eventos</h3>
          <ul class="upcoming">
            <li v-for="event in upcomingEvents" :key="event.id" class="upcoming__item">
              <div class="upcoming__date">
                <span class="upcoming__day">{{ new Date(`${event.date}T12:00:00`).getDate() }}</span>
                <span class="upcoming__month">{{ monthShort(event.date) }}</span>
              </div>
              <div class="upcoming__body">
                <p class="upcoming__title">{{ event.title }}</p>
                <p class="upcoming__meta">{{ event.startTime }} · {{ event.flow }}</p>
              </div>
              <span class="upcoming__dot" :style="{ background: event.color }" />
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  view,
  activeCategory,
  monthLabel,
  calendarDays,
  weekDaysHeader,
  selectedDayEvents,
  upcomingEvents,
  categories,
  eventsForDate,
  prevMonth,
  nextMonth,
  goToToday,
  selectDate,
  formatSelectedDate,
} = useCalendarData()

function monthShort(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
}
</script>

<style scoped>
.calendar-page {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.calendar-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.calendar-page__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.calendar-page__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.calendar-page__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.view-switch {
  display: flex;
  padding: 3px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.view-switch__btn {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all var(--transition);
}

.view-switch__btn.active {
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.calendar-page__cta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--accent-neon), var(--accent-to));
  color: white;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
}

.calendar-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.calendar-page__filter {
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

.calendar-page__filter.active {
  color: var(--text-primary);
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
}

.calendar-page__filter-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.calendar-page__body {
  display: flex;
  gap: 24px;
  min-height: 0;
}

.calendar-main {
  flex: 1;
  min-width: 0;
  padding: 20px;
}

.calendar-main__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.calendar-main__nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-main__month {
  font-size: 18px;
  font-weight: 600;
  min-width: 160px;
  text-align: center;
  text-transform: capitalize;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-secondary);
  transition: all var(--transition);
}

.icon-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.today-btn {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  transition: all var(--transition);
}

.today-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
  width: 100%;
}

.month-grid__head {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: center;
  padding: 8px 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.month-grid__cell {
  min-height: 100px;
  padding: 8px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  text-align: left;
  transition: all var(--transition);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.month-grid__cell:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--border-subtle);
}

.month-grid__cell--muted {
  opacity: 0.3;
  pointer-events: none;
}

.month-grid__cell--today .month-grid__day {
  background: var(--accent-neon);
  color: white;
}

.month-grid__cell--selected {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.35);
}

.month-grid__day {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.month-grid__events {
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
}

.month-grid__event {
  font-size: 9px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.month-grid__more {
  font-size: 9px;
  color: var(--text-muted);
  padding-left: 4px;
}

.month-grid__dots {
  display: none;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
}

.month-grid__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.week-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.week-event {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
}

.week-event__time {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  width: 44px;
  flex-shrink: 0;
}

.week-event__bar {
  width: 3px;
  border-radius: 999px;
  flex-shrink: 0;
}

.week-event__title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.week-event__meta {
  font-size: 12px;
  color: var(--text-muted);
}

.week-view__empty {
  text-align: center;
  color: var(--text-muted);
  padding: 40px 20px;
}

.calendar-rail {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rail-card {
  padding: 20px;
}

.rail-card__title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: capitalize;
}

.rail-card__empty {
  font-size: 13px;
  color: var(--text-muted);
}

.day-schedule {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.day-schedule__item {
  display: flex;
  gap: 10px;
}

.day-schedule__time {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  width: 38px;
  flex-shrink: 0;
  padding-top: 2px;
}

.day-schedule__bar {
  width: 3px;
  border-radius: 999px;
  flex-shrink: 0;
}

.day-schedule__title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.day-schedule__flow {
  font-size: 11px;
  color: var(--text-muted);
}

.upcoming {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upcoming__item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upcoming__date {
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.upcoming__day {
  display: block;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}

.upcoming__month {
  display: block;
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.upcoming__body {
  flex: 1;
  min-width: 0;
}

.upcoming__title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming__meta {
  font-size: 11px;
  color: var(--text-muted);
}

.upcoming__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 1100px) {
  .calendar-page__body {
    flex-direction: column;
  }

  .calendar-rail {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .calendar-page {
    padding: 16px 16px 8px;
    overflow-x: hidden;
  }

  .calendar-page__header {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }

  .calendar-page__title {
    font-size: 22px;
  }

  .calendar-page__subtitle {
    font-size: 13px;
  }

  .calendar-page__actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .view-switch {
    flex: 1;
  }

  .view-switch__btn {
    flex: 1;
    text-align: center;
    padding: 8px 10px;
  }

  .calendar-page__cta {
    width: 100%;
    justify-content: center;
  }

  .calendar-page__filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 16px;
    padding-bottom: 2px;
    scrollbar-width: none;
  }

  .calendar-page__filters::-webkit-scrollbar {
    display: none;
  }

  .calendar-page__filter {
    flex-shrink: 0;
    padding: 6px 12px;
    font-size: 11px;
  }

  .calendar-page__body {
    gap: 16px;
  }

  .calendar-main {
    padding: 14px 10px;
    overflow: hidden;
  }

  .calendar-main__toolbar {
    margin-bottom: 12px;
    gap: 8px;
  }

  .calendar-main__nav {
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .calendar-main__month {
    font-size: 15px;
    min-width: 0;
    flex: 1;
  }

  .today-btn {
    flex-shrink: 0;
    padding: 6px 10px;
  }

  .month-grid {
    gap: 2px;
  }

  .month-grid__head {
    font-size: 9px;
    padding: 4px 0;
    letter-spacing: 0;
  }

  .month-grid__cell {
    min-height: 48px;
    padding: 4px 2px;
    gap: 3px;
    align-items: center;
  }

  .month-grid__day {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }

  .month-grid__events {
    align-items: center;
    width: 100%;
  }

  .month-grid__event,
  .month-grid__more {
    display: none;
  }

  .month-grid__dots {
    display: flex;
  }

  .calendar-rail {
    gap: 12px;
  }

  .rail-card {
    padding: 16px;
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
