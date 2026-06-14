<template>
  <div class="inbox">
    <header class="inbox__header">
      <div class="inbox__header-text">
        <h1 class="inbox__title">Inbox</h1>
        <p class="inbox__subtitle">
          Tudo que precisa da sua atenção — menções, tarefas, conversas e alertas de IA.
        </p>
      </div>
      <div class="inbox__header-actions">
        <span v-if="unreadCount" class="inbox__unread-badge">{{ unreadCount }} não lidos</span>
        <button
          v-if="unreadCount"
          type="button"
          class="inbox__mark-all"
          @click="markAllRead"
        >
          Marcar tudo como lido
        </button>
      </div>
    </header>

    <div class="inbox__filters">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        class="inbox__filter"
        :class="{ 'inbox__filter--active': activeFilter === filter.id }"
        @click="activeFilter = filter.id"
      >
        {{ filter.label }}
        <span v-if="filter.count" class="inbox__filter-count">{{ filter.count }}</span>
      </button>
    </div>

    <div class="inbox__list">
      <section v-for="group in groupedItems" :key="group.label" class="inbox__group">
        <h2 class="inbox__group-label">{{ group.label }}</h2>
        <ul class="inbox__items">
          <li v-for="item in group.items" :key="item.id">
            <button
              type="button"
              class="inbox-item"
              :class="{ 'inbox-item--unread': item.unread }"
              @click="markRead(item.id)"
            >
              <span v-if="item.unread" class="inbox-item__dot" />

              <div class="inbox-item__icon" :class="`inbox-item__icon--${item.type}`">
                <svg v-if="item.type === 'mention'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V11M5 5.5C5 3.5 6.5 2 8 2C9.5 2 11 3.5 11 5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="item.type === 'assignment'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="item.type === 'ai'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L9.5 6.5L14 7L10.5 10L11.5 14.5L8 12L4.5 14.5L5.5 10L2 7L6.5 6.5L8 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="item.type === 'comment'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3.5H13V10.5H6L3 13V10.5V3.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4.5C2 3.7 2.7 3 3.5 3H12.5C13.3 3 14 3.7 14 4.5V10.5C14 11.3 13.3 12 12.5 12H6L3 14.5V12H3.5C2.7 12 2 11.3 2 10.5V4.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                </svg>
              </div>

              <div class="inbox-item__body">
                <div class="inbox-item__top">
                  <span class="inbox-item__title">{{ item.title }}</span>
                  <span v-if="item.priority === 'high'" class="inbox-item__priority">Alta</span>
                </div>
                <p class="inbox-item__preview">{{ item.preview }}</p>
                <div class="inbox-item__meta">
                  <InboxPlatformBadge :platform="item.platform" />
                  <span class="inbox-item__source">{{ item.source }}</span>
                  <span class="inbox-item__sep">·</span>
                  <span class="inbox-item__time">{{ item.timestamp }}</span>
                </div>
              </div>

              <div v-if="item.actor" class="inbox-item__actor" :style="{ background: item.actor.color }">
                {{ item.actor.avatar }}
              </div>
            </button>
          </li>
        </ul>
      </section>

      <div v-if="!filteredItems.length" class="inbox__empty">
        <p>Nenhum item neste filtro.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  activeFilter,
  unreadCount,
  filters,
  filteredItems,
  groupedItems,
  markRead,
  markAllRead,
} = useInboxData()
</script>

<style scoped>
.inbox {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.inbox__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.inbox__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.inbox__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.inbox__header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.inbox__unread-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-neon);
}

.inbox__mark-all {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  transition: all var(--transition);
}

.inbox__mark-all:hover {
  color: var(--text-primary);
  border-color: var(--border-medium);
  background: var(--bg-hover);
}

.inbox__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.inbox__filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px solid transparent;
  transition: all var(--transition);
}

.inbox__filter:hover {
  color: var(--text-secondary);
  background: var(--bg-hover);
}

.inbox__filter--active {
  color: var(--text-primary);
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.inbox__filter-count {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.2);
  color: var(--accent-neon);
}

.inbox__group {
  margin-bottom: 28px;
}

.inbox__group-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 10px;
  padding-left: 4px;
}

.inbox__items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.inbox-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  text-align: left;
  transition: background var(--transition);
}

.inbox-item:hover {
  background: var(--bg-hover);
}

.inbox-item--unread {
  background: rgba(139, 92, 246, 0.06);
}

.inbox-item--unread:hover {
  background: rgba(139, 92, 246, 0.1);
}

.inbox-item__dot {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-neon);
}

.inbox-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.inbox-item__icon--mention { background: rgba(236, 72, 153, 0.12); color: #f472b6; }
.inbox-item__icon--assignment { background: rgba(139, 92, 246, 0.12); color: var(--accent-neon); }
.inbox-item__icon--ai { background: rgba(251, 146, 60, 0.12); color: #fb923c; }
.inbox-item__icon--comment { background: rgba(96, 165, 250, 0.12); color: #60a5fa; }
.inbox-item__icon--conversation { background: rgba(34, 197, 94, 0.12); color: #4ade80; }

.inbox-item__body {
  flex: 1;
  min-width: 0;
}

.inbox-item__top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.inbox-item__title {
  font-size: 14px;
  font-weight: 500;
}

.inbox-item--unread .inbox-item__title {
  font-weight: 600;
}

.inbox-item__priority {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
  flex-shrink: 0;
}

.inbox-item__preview {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.inbox-item__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.inbox-item__sep {
  opacity: 0.5;
}

.inbox-item__actor {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.inbox__empty {
  padding: 48px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .inbox {
    padding: 20px 20px 16px;
  }

  .inbox__header {
    flex-direction: column;
  }

  .inbox__header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .inbox__title {
    font-size: 22px;
  }
}
</style>
