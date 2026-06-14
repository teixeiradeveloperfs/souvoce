<template>
  <header ref="topbarRef" class="topbar">
    <div class="topbar__left">
      <div class="topbar-dropdown">
        <button
          type="button"
          class="workspace-selector"
          :class="{ 'workspace-selector--open': openPanel === 'organization' }"
          @click.stop="togglePanel('organization')"
        >
          <span class="workspace-dot" :style="{ background: activeOrganization.color }" />
          <span>{{ activeOrganization.label }}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="openPanel === 'organization'" class="dropdown dropdown--workspace">
            <p class="dropdown__label">Empresas</p>
            <button
              v-for="organization in organizations"
              :key="organization.id"
              type="button"
              class="dropdown-item"
              :class="{ active: activeOrganizationId === organization.id }"
              @click="selectOrganization(organization.id)"
            >
              <span class="dropdown-item__dot" :style="{ background: organization.color }" />
              <span class="dropdown-item__content">
                <span class="dropdown-item__title">{{ organization.label }}</span>
                <span class="dropdown-item__meta">{{ organization.members }} membros</span>
              </span>
              <svg v-if="activeOrganizationId === organization.id" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div class="topbar__center">
      <div class="search-bar" @click="focusSearch">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="search-bar__icon">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.3" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>
        <input
          ref="searchInputRef"
          v-model="localQuery"
          type="text"
          placeholder="Buscar algo..."
          @focus="onSearchFocus"
          @keydown.enter="submitSearch"
        />
        <kbd class="search-bar__kbd">⌘ K</kbd>
      </div>
    </div>

    <div class="topbar__right">
      <div class="topbar-dropdown">
        <UiMagneticButton
          variant="primary"
          class="topbar__create"
          @click.stop="togglePanel('create')"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2V12M2 7H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Criar
        </UiMagneticButton>

        <Transition name="dropdown">
          <div v-if="openPanel === 'create'" class="dropdown dropdown--create">
            <p class="dropdown__label">Criar</p>
            <button
              v-for="action in createActions"
              :key="action.id"
              type="button"
              class="dropdown-action"
              @click="navigateTo(action.to)"
            >
              <span class="dropdown-action__icon">
                <svg v-if="action.icon === 'task'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="action.icon === 'event'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M2 6H14M5 1V3M11 1V3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="action.icon === 'inbox'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M2 5L8 9L14 5" stroke="currentColor" stroke-width="1.3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V14M4 6L8 2L12 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="dropdown-action__body">
                <span class="dropdown-action__title">{{ action.label }}</span>
                <span class="dropdown-action__desc">{{ action.description }}</span>
              </span>
            </button>
          </div>
        </Transition>
      </div>

      <UiMagneticButton
        variant="icon"
        class="topbar__analytics"
        aria-label="Relatórios"
        @click.stop="goToReports"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 14V8M7 14V4M11 14V6M15 14V2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>
      </UiMagneticButton>

      <div class="topbar-dropdown">
        <button
          type="button"
          class="notification-btn"
          aria-label="Notificações"
          @click.stop="togglePanel('notifications')"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C6.5 2 4.5 4 4.5 6.5V10L3 12.5H15L13.5 10V6.5C13.5 4 11.5 2 9 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            <path d="M7.5 14.5C7.5 15.3 8.2 16 9 16C9.8 16 10.5 15.3 10.5 14.5" stroke="currentColor" stroke-width="1.3" />
          </svg>
          <span v-if="notificationCount" class="notification-btn__dot" />
        </button>

        <Transition name="dropdown">
          <div v-if="openPanel === 'notifications'" class="dropdown dropdown--notifications">
            <div class="dropdown__head">
              <p class="dropdown__label">Notificações</p>
              <button
                v-if="notificationCount"
                type="button"
                class="dropdown__action"
                @click="markAllNotificationsRead"
              >
                Marcar todas
              </button>
            </div>
            <ul v-if="notifications.length" class="notification-list">
              <li v-for="item in notifications" :key="item.id" class="notification-row">
                <button type="button" class="notification-item" @click="navigateTo(item.to)">
                  <div class="notification-item__body">
                    <p class="notification-item__title">{{ item.title }}</p>
                    <p class="notification-item__preview">{{ item.preview }}</p>
                    <span class="notification-item__time">{{ item.timestamp }}</span>
                  </div>
                </button>
                <button
                  type="button"
                  class="notification-item__dismiss"
                  aria-label="Dispensar"
                  @click="dismissNotification(item.id)"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                </button>
              </li>
            </ul>
            <p v-else class="dropdown__empty">Nenhuma notificação pendente.</p>
            <button type="button" class="dropdown__footer" @click="navigateTo(APP_ROUTES.inbox)">
              Ver inbox completa
            </button>
          </div>
        </Transition>
      </div>

      <div class="topbar-dropdown">
        <button
          type="button"
          class="topbar__avatar"
          aria-label="Menu do perfil"
          @click.stop="togglePanel('profile')"
        >
          LM
        </button>

        <Transition name="dropdown">
          <div v-if="openPanel === 'profile'" class="dropdown dropdown--profile">
            <div class="profile-card">
              <div class="profile-card__avatar">LM</div>
              <div>
                <p class="profile-card__name">Lucas Martins</p>
                <p class="profile-card__role">Administrador</p>
              </div>
            </div>
            <button type="button" class="dropdown-item" @click="navigateTo(APP_ROUTES.myday)">
              Meu dia
            </button>
            <button type="button" class="dropdown-item" @click="navigateTo(APP_ROUTES.activities)">
              Atividades
            </button>
            <button type="button" class="dropdown-item" @click="openOrganizationFromProfile">
              <span class="dropdown-item__dot" :style="{ background: activeOrganization.color }" />
              Trocar empresa
            </button>
            <button type="button" class="dropdown-item dropdown-item--muted" @click="closePanel">
              Configurações
            </button>
            <button type="button" class="dropdown-item dropdown-item--danger" @click="closePanel">
              Sair
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { APP_ROUTES } from '~/constants/routes'

const route = useRoute()
const router = useRouter()
const topbarRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const localQuery = ref('')

const { openSearch, setQuery, saveRecentSearch } = useGlobalSearch()
const {
  organizations,
  createActions,
  openPanel,
  activeOrganization,
  activeOrganizationId,
  notifications,
  notificationCount,
  togglePanel,
  closePanel,
  selectOrganization,
  projectPath,
  navigateTo,
  dismissNotification,
  markAllNotificationsRead,
  openOrganizationPanel,
} = useTopbar()

useTopbarClickOutside(topbarRef, closePanel)

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

function goToReports() {
  closePanel()
  router.push(APP_ROUTES.reports)
}

function openOrganizationFromProfile() {
  closePanel()
  openOrganizationPanel()
}
</script>

<style scoped>
.topbar {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
  position: relative;
  z-index: 50;
}

.topbar__left {
  flex-shrink: 0;
}

.topbar-dropdown {
  position: relative;
}

.workspace-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  transition: background var(--transition);
}

.workspace-selector:hover,
.workspace-selector--open {
  background: var(--bg-hover);
}

.workspace-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.topbar__center {
  flex: 1;
  max-width: 480px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: border-color var(--transition), box-shadow var(--transition);
  cursor: text;
}

.search-bar:focus-within {
  border-color: rgba(124, 58, 237, 0.4);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.search-bar__icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-bar input {
  flex: 1;
  font-size: 13px;
  background: transparent;
}

.search-bar input::placeholder {
  color: var(--text-muted);
}

.search-bar__kbd {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
  font-family: inherit;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.notification-btn {
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

.notification-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.notification-btn__dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #EF4444;
  border: 2px solid var(--bg-base);
}

.topbar__avatar {
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
  margin-left: 4px;
  transition: transform var(--transition), box-shadow var(--transition);
}

.topbar__avatar:hover {
  transform: scale(1.04);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  min-width: 240px;
  padding: 8px;
  background: rgba(12, 18, 36, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
  z-index: 100;
}

.dropdown--workspace {
  left: 0;
}

.dropdown--create {
  right: 0;
  min-width: 280px;
}

.dropdown--notifications {
  right: 0;
  width: 360px;
  padding: 0;
  overflow: hidden;
}

.dropdown--profile {
  right: 0;
  min-width: 220px;
}

.dropdown__label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 8px 10px 6px;
}

.dropdown__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 0;
}

.dropdown__action {
  font-size: 11px;
  color: var(--accent-to);
}

.dropdown__empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}

.dropdown__footer {
  width: 100%;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-to);
  border-top: 1px solid var(--border-subtle);
  text-align: center;
}

.dropdown__footer:hover {
  background: var(--bg-hover);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--text-secondary);
  text-align: left;
  transition: all var(--transition);
}

.dropdown-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.dropdown-item.active {
  color: var(--text-primary);
  background: rgba(139, 92, 246, 0.1);
}

.dropdown-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dropdown-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.dropdown-item__title {
  font-size: 13px;
}

.dropdown-item__meta {
  font-size: 10px;
  color: var(--text-muted);
}

.dropdown-item svg {
  margin-left: auto;
  color: var(--accent-to);
}

.dropdown-item--muted {
  color: var(--text-muted);
}

.dropdown-item--danger {
  color: #f87171;
}

.dropdown-item--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.dropdown-action {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  text-align: left;
  transition: background var(--transition);
}

.dropdown-action:hover {
  background: var(--bg-hover);
}

.dropdown-action__icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(139, 92, 246, 0.12);
  color: var(--accent-to);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-action__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-action__title {
  font-size: 13px;
  font-weight: 500;
}

.dropdown-action__desc {
  font-size: 11px;
  color: var(--text-muted);
}

.notification-list {
  list-style: none;
  max-height: 320px;
  overflow-y: auto;
}

.notification-row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--border-subtle);
}

.notification-row:last-child {
  border-bottom: none;
}

.notification-item {
  flex: 1;
  min-width: 0;
  padding: 12px 8px 12px 14px;
  text-align: left;
  transition: background var(--transition);
}

.notification-item:hover {
  background: var(--bg-hover);
}

.notification-item__body {
  flex: 1;
  min-width: 0;
}

.notification-item__title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 3px;
}

.notification-item__preview {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.notification-item__time {
  font-size: 10px;
  color: var(--text-muted);
}

.notification-item__dismiss {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: background var(--transition);
}

.notification-item__dismiss:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 4px;
}

.profile-card__avatar {
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

.profile-card__name {
  font-size: 13px;
  font-weight: 600;
}

.profile-card__role {
  font-size: 11px;
  color: var(--text-muted);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
