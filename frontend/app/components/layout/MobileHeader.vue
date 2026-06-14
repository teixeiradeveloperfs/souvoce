<template>
  <header ref="headerRef" class="mobile-header">
    <div class="mobile-header__top">
      <NuxtLink to="/" class="mobile-header__brand" @click="closePanel">
        <div class="mobile-header__logo gradient-bg">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" opacity="0.9" />
          </svg>
        </div>
        <span class="mobile-header__name">souvoce</span>
      </NuxtLink>

      <button
        type="button"
        class="mobile-header__workspace"
        :class="{ 'mobile-header__workspace--open': openPanel === 'organization' }"
        @click.stop="togglePanel('organization')"
      >
        <span class="mobile-header__workspace-dot" :style="{ background: activeOrganization.color }" />
        <span>{{ activeOrganization.label }}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </button>

      <div class="mobile-header__actions">
        <button
          type="button"
          class="mobile-header__icon-btn"
          :class="{ 'mobile-header__icon-btn--open': openPanel === 'notifications' }"
          aria-label="Notificações"
          @click.stop="togglePanel('notifications')"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2.5C7.5 2.5 5.5 4.5 5.5 7V11L4 13.5H16L14.5 11V7C14.5 4.5 12.5 2.5 10 2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            <path d="M8.5 16C8.5 16.8 9.2 17.5 10 17.5C10.8 17.5 11.5 16.8 11.5 16" stroke="currentColor" stroke-width="1.3" />
          </svg>
          <span v-if="notificationCount" class="mobile-header__badge" />
        </button>

        <button
          type="button"
          class="mobile-header__avatar"
          :class="{ 'mobile-header__avatar--open': openPanel === 'profile' }"
          aria-label="Menu do perfil"
          @click.stop="togglePanel('profile')"
        >
          LM
        </button>
      </div>
    </div>

    <div class="mobile-header__search" @click="focusSearch">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="mobile-header__search-icon">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.3" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
      </svg>
      <input
        ref="searchInputRef"
        v-model="localQuery"
        type="search"
        placeholder="Buscar algo..."
        enterkeyhint="search"
        @focus="onSearchFocus"
        @keydown.enter="submitSearch"
      />
    </div>

    <Transition name="mobile-sheet">
      <div v-if="openPanel" class="mobile-header__overlay">
        <button type="button" class="mobile-header__backdrop" aria-label="Fechar menu" @click="closePanel" />

        <div
          class="mobile-header__sheet"
          :class="`mobile-header__sheet--${openPanel}`"
          @click.stop
        >
          <template v-if="openPanel === 'organization'">
            <p class="mobile-sheet__label">Empresas</p>
            <button
              v-for="organization in organizations"
              :key="organization.id"
              type="button"
              class="mobile-sheet__item"
              :class="{ active: activeOrganizationId === organization.id }"
              @click="selectOrganization(organization.id)"
            >
              <span class="mobile-sheet__dot" :style="{ background: organization.color }" />
              <span class="mobile-sheet__body">
                <span class="mobile-sheet__title">{{ organization.label }}</span>
                <span class="mobile-sheet__meta">{{ organization.members }} membros</span>
              </span>
              <svg v-if="activeOrganizationId === organization.id" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </template>

          <template v-else-if="openPanel === 'notifications'">
            <div class="mobile-sheet__head">
              <p class="mobile-sheet__label">Notificações</p>
              <button
                v-if="notificationCount"
                type="button"
                class="mobile-sheet__action"
                @click="markAllNotificationsRead"
              >
                Marcar todas
              </button>
            </div>

            <ul v-if="notifications.length" class="mobile-sheet__list">
              <li v-for="item in notifications" :key="item.id" class="mobile-sheet__row">
                <button type="button" class="mobile-sheet__notification" @click="navigateTo(item.to)">
                  <p class="mobile-sheet__notification-title">{{ item.title }}</p>
                  <p class="mobile-sheet__notification-preview">{{ item.preview }}</p>
                  <span class="mobile-sheet__notification-time">{{ item.timestamp }}</span>
                </button>
                <button
                  type="button"
                  class="mobile-sheet__dismiss"
                  aria-label="Dispensar"
                  @click="dismissNotification(item.id)"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
                  </svg>
                </button>
              </li>
            </ul>
            <p v-else class="mobile-sheet__empty">Nenhuma notificação pendente.</p>

            <button type="button" class="mobile-sheet__footer" @click="navigateTo(APP_ROUTES.inbox)">
              Ver inbox completa
            </button>
          </template>

          <template v-else-if="openPanel === 'profile'">
            <div class="mobile-sheet__profile">
              <div class="mobile-sheet__profile-avatar">LM</div>
              <div>
                <p class="mobile-sheet__profile-name">Lucas Martins</p>
                <p class="mobile-sheet__profile-role">Administrador</p>
              </div>
            </div>

            <button type="button" class="mobile-sheet__item" @click="navigateTo(APP_ROUTES.myday)">
              Meu dia
            </button>
            <button type="button" class="mobile-sheet__item" @click="navigateTo(APP_ROUTES.activities)">
              Atividades
            </button>
            <button type="button" class="mobile-sheet__item" @click="navigateTo(APP_ROUTES.tasks)">
              Tarefas
            </button>
            <button type="button" class="mobile-sheet__item" @click="navigateTo(APP_ROUTES.reports)">
              Relatórios
            </button>
            <button type="button" class="mobile-sheet__item" @click="openOrganizationFromProfile">
              <span class="mobile-sheet__dot" :style="{ background: activeOrganization.color }" />
              <span class="mobile-sheet__body">
                <span class="mobile-sheet__title">Trocar empresa</span>
                <span class="mobile-sheet__meta">{{ activeOrganization.label }}</span>
              </span>
            </button>
            <button type="button" class="mobile-sheet__item mobile-sheet__item--muted" @click="closePanel">
              Configurações
            </button>
            <button type="button" class="mobile-sheet__item mobile-sheet__item--danger" @click="closePanel">
              Sair
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { APP_ROUTES } from '~/constants/routes'

const route = useRoute()
const headerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const localQuery = ref('')

const { openSearch, setQuery, saveRecentSearch } = useGlobalSearch()
const {
  organizations,
  openPanel,
  activeOrganization,
  activeOrganizationId,
  notifications,
  notificationCount,
  togglePanel,
  closePanel,
  selectOrganization,
  navigateTo,
  dismissNotification,
  markAllNotificationsRead,
  openOrganizationPanel,
} = useTopbar()

useTopbarClickOutside(headerRef, closePanel)

watch(
  () => route.path,
  () => closePanel(),
)

watch(
  () => route.query.q,
  (value) => {
    localQuery.value = (value as string) || ''
  },
  { immediate: true },
)

function onSearchFocus() {
  if (route.path !== APP_ROUTES.search) {
    openSearch(localQuery.value || undefined)
  }
}

function focusSearch() {
  if (route.path !== APP_ROUTES.search) {
    openSearch(localQuery.value || undefined)
    return
  }
  searchInputRef.value?.focus()
}

function submitSearch() {
  const term = localQuery.value.trim()
  setQuery(term)
  if (term) saveRecentSearch(term)
  openSearch(term || undefined)
}

function openOrganizationFromProfile() {
  openOrganizationPanel()
}
</script>

<style scoped>
.mobile-header {
  display: none;
  flex-direction: column;
  gap: 12px;
  padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 12px;
  background: rgba(6, 11, 26, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
  position: relative;
  z-index: 120;
}

.mobile-header__top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-header__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: inherit;
}

.mobile-header__logo {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-header__name {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.mobile-header__workspace {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  margin-right: auto;
  border-radius: 999px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  transition: background var(--transition), border-color var(--transition);
}

.mobile-header__workspace:active,
.mobile-header__workspace--open {
  background: var(--bg-hover);
  border-color: var(--border-medium);
}

.mobile-header__workspace-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mobile-header__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.mobile-header__icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: all var(--transition);
}

.mobile-header__icon-btn:active,
.mobile-header__icon-btn--open {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.mobile-header__badge {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid var(--bg-base);
}

.mobile-header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: white;
  transition: transform var(--transition), box-shadow var(--transition);
}

.mobile-header__avatar:active,
.mobile-header__avatar--open {
  transform: scale(1.04);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
}

.mobile-header__search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: border-color var(--transition), box-shadow var(--transition);
  cursor: text;
}

.mobile-header__search:focus-within {
  border-color: rgba(124, 58, 237, 0.45);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.mobile-header__search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.mobile-header__search input {
  flex: 1;
  font-size: 14px;
  min-width: 0;
  background: transparent;
}

.mobile-header__search input::placeholder {
  color: var(--text-muted);
}

.mobile-header__overlay {
  position: fixed;
  inset: 0;
  z-index: 130;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: calc(118px + env(safe-area-inset-top, 0px)) 16px 16px;
  pointer-events: none;
}

.mobile-header__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  pointer-events: auto;
}

.mobile-header__sheet {
  position: relative;
  width: 100%;
  max-width: 420px;
  max-height: min(70vh, 520px);
  overflow-y: auto;
  padding: 8px;
  background: rgba(12, 18, 36, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.mobile-header__sheet--notifications {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mobile-sheet__label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 8px 10px 6px;
}

.mobile-sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 0;
}

.mobile-sheet__action {
  font-size: 11px;
  color: var(--accent-to);
}

.mobile-sheet__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--text-secondary);
  text-align: left;
  transition: all var(--transition);
}

.mobile-sheet__item:hover,
.mobile-sheet__item:active {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.mobile-sheet__item.active {
  color: var(--text-primary);
  background: rgba(139, 92, 246, 0.1);
}

.mobile-sheet__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mobile-sheet__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-sheet__title {
  font-size: 13px;
}

.mobile-sheet__meta {
  font-size: 10px;
  color: var(--text-muted);
}

.mobile-sheet__item svg {
  margin-left: auto;
  color: var(--accent-to);
}

.mobile-sheet__item--muted {
  color: var(--text-muted);
}

.mobile-sheet__item--danger {
  color: #f87171;
}

.mobile-sheet__item--danger:active {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.mobile-sheet__list {
  list-style: none;
  overflow-y: auto;
  flex: 1;
}

.mobile-sheet__row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--border-subtle);
}

.mobile-sheet__row:last-child {
  border-bottom: none;
}

.mobile-sheet__notification {
  flex: 1;
  min-width: 0;
  padding: 12px 8px 12px 14px;
  text-align: left;
}

.mobile-sheet__notification:active {
  background: var(--bg-hover);
}

.mobile-sheet__notification-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 3px;
}

.mobile-sheet__notification-preview {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.mobile-sheet__notification-time {
  font-size: 10px;
  color: var(--text-muted);
}

.mobile-sheet__dismiss {
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.mobile-sheet__dismiss:active {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.mobile-sheet__empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}

.mobile-sheet__footer {
  width: 100%;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-to);
  border-top: 1px solid var(--border-subtle);
  text-align: center;
}

.mobile-sheet__footer:active {
  background: var(--bg-hover);
}

.mobile-sheet__profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 4px;
}

.mobile-sheet__profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.mobile-sheet__profile-name {
  font-size: 13px;
  font-weight: 600;
}

.mobile-sheet__profile-role {
  font-size: 11px;
  color: var(--text-muted);
}

.mobile-sheet-enter-active,
.mobile-sheet-leave-active {
  transition: opacity 0.18s ease;
}

.mobile-sheet-enter-active .mobile-header__sheet,
.mobile-sheet-leave-active .mobile-header__sheet {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.mobile-sheet-enter-from,
.mobile-sheet-leave-to {
  opacity: 0;
}

.mobile-sheet-enter-from .mobile-header__sheet,
.mobile-sheet-leave-to .mobile-header__sheet {
  transform: translateY(-8px);
  opacity: 0;
}

@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }
}
</style>
