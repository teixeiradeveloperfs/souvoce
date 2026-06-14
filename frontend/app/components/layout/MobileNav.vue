<template>
  <nav ref="navRef" class="mobile-nav" aria-label="Navegação principal">
    <div class="mobile-nav__bar">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="mobile-nav__item"
        :class="{
          'mobile-nav__item--active': active === item.id,
          'mobile-nav__item--open': item.id === 'projects' && projectMenuOpen,
        }"
        :aria-label="item.label"
        :aria-current="active === item.id ? 'page' : undefined"
        @click="onNavItemClick(item)"
      >
        <span class="mobile-nav__icon" v-html="item.icon" />
        <span v-if="active === item.id" class="mobile-nav__label">{{ item.label }}</span>
      </button>
    </div>

    <Transition name="mobile-menu">
      <div v-if="projectMenuOpen" class="mobile-nav__menu-layer">
        <button type="button" class="mobile-nav__backdrop" aria-label="Fechar menu" @click="closeProjectMenu" />

        <div class="mobile-nav__dropdown mobile-nav__dropdown--center" role="menu">
          <p class="mobile-nav__dropdown-label">Projetos · {{ activeOrganization.label }}</p>
          <button
            v-for="project in projects"
            :key="project.id"
            type="button"
            role="menuitem"
            class="mobile-nav__dropdown-item mobile-nav__dropdown-item--workspace"
            :class="{ 'mobile-nav__dropdown-item--active': activeProjectId === project.id }"
            @click="switchProject(project.id)"
          >
            <span class="mobile-nav__workspace-dot" :style="{ background: project.color }" />
            <span class="mobile-nav__dropdown-text">
              <span>{{ project.label }}</span>
              <span class="mobile-nav__dropdown-meta">{{ project.openTasks }} tarefas · {{ project.members }} membros</span>
            </span>
            <svg v-if="activeProjectId === project.id" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <div class="mobile-nav__more-wrap">
      <Transition name="mobile-menu">
        <div v-if="menuOpen" class="mobile-nav__menu-layer">
          <button type="button" class="mobile-nav__backdrop" aria-label="Fechar menu" @click="closeMenu" />

          <div class="mobile-nav__dropdown" role="menu">
            <p class="mobile-nav__dropdown-label">Empresa</p>
            <button
              v-for="organization in organizations"
              :key="organization.id"
              type="button"
              role="menuitem"
              class="mobile-nav__dropdown-item mobile-nav__dropdown-item--workspace"
              :class="{ 'mobile-nav__dropdown-item--active': activeOrganizationId === organization.id }"
              @click="switchOrganization(organization.id)"
            >
              <span class="mobile-nav__workspace-dot" :style="{ background: organization.color }" />
              <span class="mobile-nav__dropdown-text">
                <span>{{ organization.label }}</span>
                <span class="mobile-nav__dropdown-meta">{{ organization.members }} membros</span>
              </span>
              <svg v-if="activeOrganizationId === organization.id" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>

            <div class="mobile-nav__dropdown-divider" />

            <p class="mobile-nav__dropdown-label">Mais páginas</p>
            <button
              v-for="item in moreItems"
              :key="item.id"
              type="button"
              role="menuitem"
              class="mobile-nav__dropdown-item"
              :class="{ 'mobile-nav__dropdown-item--active': isActiveRoute(item.to) }"
              @click="navigateFromMenu(item.to)"
            >
              <span class="mobile-nav__dropdown-icon" v-html="item.icon" />
              <span class="mobile-nav__dropdown-text">{{ item.label }}</span>
              <span v-if="item.badge" class="mobile-nav__dropdown-badge">{{ item.badge }}</span>
            </button>
          </div>
        </div>
      </Transition>

      <button
        type="button"
        class="mobile-nav__more"
        :class="{
          'mobile-nav__more--open': menuOpen,
          'mobile-nav__more--active': active === 'more',
        }"
        aria-label="Mais páginas"
        :aria-expanded="menuOpen"
        @click.stop="toggleMenu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="5" cy="10" r="1.35" fill="currentColor" />
          <circle cx="10" cy="10" r="1.35" fill="currentColor" />
          <circle cx="15" cy="10" r="1.35" fill="currentColor" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { APP_ROUTES } from '~/constants/routes'

const route = useRoute()
const router = useRouter()
const navRef = ref<HTMLElement | null>(null)
const menuOpen = ref(false)
const projectMenuOpen = ref(false)
const {
  organizations,
  projects,
  activeOrganization,
  activeOrganizationId,
  activeProjectId,
  selectOrganization,
  selectProject,
} = useOrganization()
const { tasks } = useProjectData()

const openTasksCount = computed(() => tasks.value.filter(t => t.columnId !== 'done').length)

type NavId = 'home' | 'calendar' | 'projects' | 'inbox' | 'more'

type NavItem = {
  id: NavId
  label: string
  to: string
  icon: string
}

const items = computed(() => [
  {
    id: 'home' as const,
    label: 'Início',
    to: APP_ROUTES.home,
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 8.5L10 3L17 8.5V16.5C17 17.05 16.55 17.5 16 17.5H4C3.45 17.5 3 17.05 3 16.5V8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'calendar' as const,
    label: 'Calendário',
    to: APP_ROUTES.calendar,
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 8H17M7 2.5V5M13 2.5V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  },
  {
    id: 'projects' as const,
    label: 'Projetos',
    to: '#',
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 6C4 4.9 4.9 4 6 4H8C9.1 4 10 4.9 10 6V14C10 15.1 9.1 16 8 16H6C4.9 16 4 15.1 4 14V6Z" stroke="currentColor" stroke-width="1.5"/><path d="M10 8C10 6.9 10.9 6 12 6H14C15.1 6 16 6.9 16 8V14C16 15.1 15.1 16 14 16H12C10.9 16 10 15.1 10 14V8Z" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
  {
    id: 'inbox' as const,
    label: 'Inbox',
    to: APP_ROUTES.inbox,
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H14.5C15.33 4 16 4.67 16 5.5V14.5C16 15.33 15.33 16 14.5 16H5.5C4.67 16 4 15.33 4 14.5V5.5Z" stroke="currentColor" stroke-width="1.5"/><circle cx="7" cy="10" r="0.75" fill="currentColor"/><circle cx="10" cy="10" r="0.75" fill="currentColor"/><circle cx="13" cy="10" r="0.75" fill="currentColor"/></svg>',
  },
])

const moreItems = computed(() => [
  {
    id: 'tasks',
    label: 'Tarefas',
    to: APP_ROUTES.tasks,
    badge: openTasksCount.value > 0 ? openTasksCount.value : undefined,
    icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M6 9L8 11L12 7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'search',
    label: 'Busca',
    to: APP_ROUTES.search,
    icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.3"/><path d="M12 12L16 16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
  {
    id: 'myday',
    label: 'Meu dia',
    to: APP_ROUTES.myday,
    icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M9 6V9L11 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
  {
    id: 'activities',
    label: 'Atividades',
    to: APP_ROUTES.activities,
    icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9H14.5M3.5 5H11M3.5 13H8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
  {
    id: 'rituals',
    label: 'Rituais',
    to: APP_ROUTES.rituals,
    icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2.5V15.5M4.5 6.5L9 2.5L13.5 6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'reports',
    label: 'Relatórios',
    to: APP_ROUTES.reports,
    icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M6 13V9M9 13V6.5M12 13V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
])

const moreRoutes = [
  APP_ROUTES.tasks,
  APP_ROUTES.search,
  APP_ROUTES.myday,
  APP_ROUTES.activities,
  APP_ROUTES.rituals,
  APP_ROUTES.reports,
]

const active = computed<NavId>(() => {
  if (projectMenuOpen.value) return 'projects'
  if (moreRoutes.includes(route.path as typeof moreRoutes[number])) return 'more'
  if (route.path.startsWith('/project/')) return 'projects'
  if (route.path === APP_ROUTES.inbox) return 'inbox'
  if (route.path === APP_ROUTES.calendar) return 'calendar'
  if (route.path === APP_ROUTES.home) return 'home'
  return 'home'
})

function onNavItemClick(item: NavItem) {
  if (item.id === 'projects') {
    toggleProjectMenu()
    return
  }
  navigate(item.to)
}

function toggleProjectMenu() {
  closeMenu()
  projectMenuOpen.value = !projectMenuOpen.value
}

function closeProjectMenu() {
  projectMenuOpen.value = false
}

function switchOrganization(id: string) {
  selectOrganization(id)
  closeMenu()
  closeProjectMenu()
}

function switchProject(id: string) {
  selectProject(id)
  closeMenu()
  closeProjectMenu()
}

function isActiveRoute(to: string) {
  return route.path === to
}

function toggleMenu() {
  closeProjectMenu()
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function navigate(to: string) {
  closeMenu()
  closeProjectMenu()
  if (to !== '#') router.push(to)
}

function navigateFromMenu(to: string) {
  navigate(to)
}

function onDocumentClick(event: MouseEvent) {
  if (!menuOpen.value && !projectMenuOpen.value) return
  const target = event.target as Node
  if (navRef.value && !navRef.value.contains(target)) {
    closeMenu()
    closeProjectMenu()
  }
}

watch(
  () => route.path,
  () => {
    closeMenu()
    closeProjectMenu()
  },
)

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  padding: 0 16px calc(16px + env(safe-area-inset-bottom, 0px));
  pointer-events: none;
}

.mobile-nav__bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: rgba(12, 18, 36, 0.82);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--border-medium);
  border-radius: 999px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  pointer-events: auto;
}

.mobile-nav__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 999px;
  color: var(--text-muted);
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.mobile-nav__item--active {
  background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
  color: white;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);
}

.mobile-nav__item--open {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.mobile-nav__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mobile-nav__item--active .mobile-nav__icon :deep(svg) {
  stroke: white;
}

.mobile-nav__item:not(.mobile-nav__item--active) .mobile-nav__icon :deep(svg) {
  stroke: var(--text-secondary);
}

.mobile-nav__label {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.mobile-nav__more-wrap {
  position: relative;
  pointer-events: auto;
}

.mobile-nav__more {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
  box-shadow:
    0 8px 24px rgba(124, 58, 237, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow var(--transition);
}

.mobile-nav__more--active,
.mobile-nav__more--open {
  box-shadow:
    0 10px 28px rgba(124, 58, 237, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.mobile-nav__more:active {
  transform: scale(0.94);
}

.mobile-nav__menu-layer {
  position: fixed;
  inset: 0;
  z-index: 110;
  pointer-events: none;
}

.mobile-nav__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  pointer-events: auto;
}

.mobile-nav__dropdown {
  position: absolute;
  right: 16px;
  bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  min-width: 220px;
  max-width: calc(100vw - 32px);
  max-height: min(70vh, 520px);
  overflow-y: auto;
  padding: 8px;
  background: rgba(12, 18, 36, 0.96);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  box-shadow:
    0 -8px 32px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  pointer-events: auto;
}

.mobile-nav__dropdown--center {
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  min-width: 280px;
}

.mobile-nav__dropdown-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 8px 10px 6px;
}

.mobile-nav__dropdown-divider {
  height: 1px;
  margin: 6px 8px;
  background: var(--border-subtle);
}

.mobile-nav__dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: left;
  transition: all var(--transition);
}

.mobile-nav__dropdown-item:hover,
.mobile-nav__dropdown-item:active {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.mobile-nav__dropdown-item--active {
  background: rgba(139, 92, 246, 0.12);
  color: var(--text-primary);
}

.mobile-nav__dropdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(139, 92, 246, 0.1);
  color: var(--accent-to);
  flex-shrink: 0;
}

.mobile-nav__dropdown-item--active .mobile-nav__dropdown-icon {
  background: rgba(139, 92, 246, 0.2);
}

.mobile-nav__dropdown-text {
  flex: 1;
  min-width: 0;
}

.mobile-nav__dropdown-badge {
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--accent-from);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav__dropdown-item--workspace .mobile-nav__dropdown-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-nav__workspace-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mobile-nav__dropdown-meta {
  font-size: 10px;
  color: var(--text-muted);
}

.mobile-nav__dropdown-item--workspace svg {
  margin-left: auto;
  color: var(--accent-to);
  flex-shrink: 0;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.18s ease;
}

.mobile-menu-enter-active .mobile-nav__dropdown,
.mobile-menu-leave-active .mobile-nav__dropdown {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-nav__dropdown,
.mobile-menu-leave-to .mobile-nav__dropdown {
  transform: translateY(12px) scale(0.96);
  opacity: 0;
}

.mobile-menu-enter-from .mobile-nav__dropdown--center,
.mobile-menu-leave-to .mobile-nav__dropdown--center {
  transform: translateX(-50%) translateY(12px) scale(0.96);
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
  }
}
</style>
