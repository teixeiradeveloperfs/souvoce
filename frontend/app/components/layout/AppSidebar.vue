<template>
  <aside class="sidebar glass" :class="{ 'sidebar--collapsed': collapsed }">
    <div class="sidebar__glow" />

    <div class="sidebar__header">
      <NuxtLink to="/" class="logo">
        <div class="logo__icon gradient-bg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 8L8 15L2 8L8 1Z" fill="white" opacity="0.9" />
          </svg>
        </div>
        <span v-show="!collapsed" class="logo__text">souvoce</span>
      </NuxtLink>

      <button
        type="button"
        class="sidebar__toggle"
        :aria-label="collapsed ? 'Expandir sidebar' : 'Recolher sidebar'"
        :title="collapsed ? 'Expandir' : 'Recolher'"
        @click="toggle"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          :class="{ 'sidebar__toggle-icon--flipped': collapsed }"
        >
          <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div class="sidebar__scroll">
      <nav class="sidebar__nav">
        <NuxtLink
          v-for="item in mainNav"
          :key="item.label"
          :to="item.to"
          class="nav-item"
          :class="{ active: item.active }"
          :title="collapsed ? item.label : undefined"
        >
          <span class="nav-item__icon-wrap">
            <span class="nav-item__icon" v-html="item.icon" />
            <span v-if="item.badge && collapsed" class="nav-item__badge-dot" />
          </span>
          <span v-show="!collapsed" class="nav-item__label">{{ item.label }}</span>
          <span v-if="item.badge && !collapsed" class="nav-item__badge">{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar__section">
        <span v-show="!collapsed" class="section-label">Fluxos</span>
        <span v-show="collapsed" class="section-label section-label--mini" title="Fluxos">F</span>
        <NuxtLink
          v-for="item in flows"
          :key="item.label"
          :to="item.to"
          class="nav-item nav-item--sub"
          :class="{ active: item.active }"
          :title="collapsed ? item.label : undefined"
        >
          <span class="nav-item__icon" v-html="item.icon" />
          <span v-show="!collapsed" class="nav-item__label">{{ item.label }}</span>
        </NuxtLink>
      </div>

      <div class="sidebar__section sidebar__section--projects">
        <div v-show="!collapsed" class="section-head">
          <span class="section-label">Projetos</span>
          <span class="section-count">{{ projects.length }}</span>
        </div>
        <span v-show="collapsed" class="section-label section-label--mini" title="Projetos">P</span>
        <NuxtLink
          v-for="project in projects"
          :key="project.id"
          :to="projectPath(project.id)"
          class="space-item"
          :class="{ 'space-item--active': isProjectActive(project.id) }"
          :style="{ '--space-color': project.color }"
          :title="collapsed ? project.label : undefined"
          @click="selectProject(project.id, { navigate: false })"
        >
          <span class="space-item__marker">
            <span class="space-item__dot" />
          </span>
          <span v-show="!collapsed" class="space-item__body">
            <span class="space-item__label">{{ project.label }}</span>
            <span class="space-item__meta">{{ project.openTasks }} tarefas</span>
          </span>
          <span v-if="!collapsed && isProjectActive(project.id)" class="space-item__check">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
          <span v-else-if="!collapsed && project.openTasks" class="space-item__count">{{ project.openTasks }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="sidebar__bottom">
      <button
        type="button"
        class="profile-card"
        :class="{ 'profile-card--collapsed': collapsed }"
        :title="collapsed ? 'Lucas Martins · Online' : undefined"
      >
        <div class="profile-card__avatar">LM</div>
        <div v-show="!collapsed" class="profile-card__info">
          <span class="profile-card__name">Lucas Martins</span>
          <span class="profile-card__role">Administrador</span>
          <span class="profile-card__status">
            <span class="status-dot" />
            Online
          </span>
        </div>
        <svg v-show="!collapsed" width="14" height="14" viewBox="0 0 14 14" fill="none" class="profile-card__chevron">
          <path d="M3.5 5.5L7 9L10.5 5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </button>

      <div v-show="!collapsed" class="upgrade-card">
        <div class="upgrade-card__header">
          <span class="upgrade-card__icon">🚀</span>
          <span class="upgrade-card__title">Upgrade para Pro</span>
        </div>
        <p class="upgrade-card__desc">
          Mais automações, integrações e IA avançada.
        </p>
        <button type="button" class="upgrade-card__btn">Upgrade</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { APP_ROUTES } from '~/constants/routes'

const route = useRoute()
const { collapsed, toggle } = useSidebar()
const { unreadCount } = useInboxData()
const { tasks } = useProjectData()
const { projects, isProjectActive, selectProject, projectPath } = useOrganization()

const openTasksCount = computed(() => tasks.value.filter(t => t.columnId !== 'done').length)

const mainNav = computed(() => [
  {
    label: 'Início',
    to: APP_ROUTES.home,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6.5L8 2L14 6.5V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V6.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    active: route.path === APP_ROUTES.home,
  },
  {
    label: 'Inbox',
    to: APP_ROUTES.inbox,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 5L8 9L14 5" stroke="currentColor" stroke-width="1.3"/></svg>',
    badge: unreadCount.value > 0 ? unreadCount.value : undefined,
    active: route.path === APP_ROUTES.inbox,
  },
  {
    label: 'Tarefas',
    to: APP_ROUTES.tasks,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    badge: openTasksCount.value > 0 ? openTasksCount.value : undefined,
    active: route.path === APP_ROUTES.tasks,
  },
  {
    label: 'Calendário',
    to: APP_ROUTES.calendar,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 6H14M5 1V3M11 1V3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    active: route.path === APP_ROUTES.calendar,
  },
  {
    label: 'Busca',
    to: APP_ROUTES.search,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    active: route.path === APP_ROUTES.search,
  },
])

const flows = computed(() => [
  {
    label: 'Meu dia',
    to: APP_ROUTES.myday,
    active: route.path === APP_ROUTES.myday,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.3"/><path d="M8 5V8L10 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
  {
    label: 'Atividades',
    to: APP_ROUTES.activities,
    active: route.path === APP_ROUTES.activities,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M3 4H10M3 12H8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
  {
    label: 'Rituais',
    to: APP_ROUTES.rituals,
    active: route.path === APP_ROUTES.rituals,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M4 6L8 2L12 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    label: 'Relatórios',
    to: APP_ROUTES.reports,
    active: route.path === APP_ROUTES.reports,
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 11V7M8 11V5M11 11V8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
])

</script>

<style scoped>
.sidebar {
  position: relative;
  width: var(--sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-subtle);
  padding: 16px 12px;
  flex-shrink: 0;
  overflow: hidden;
  transition: width var(--transition);
}

.sidebar--collapsed {
  width: var(--sidebar-width-collapsed);
  padding: 16px 8px;
}

.sidebar__glow {
  position: absolute;
  bottom: -80px;
  left: -60px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%);
  pointer-events: none;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 4px 20px;
}

.sidebar--collapsed .sidebar__header {
  flex-direction: column;
  padding: 4px 0 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  text-decoration: none;
  color: inherit;
}

.sidebar--collapsed .logo {
  justify-content: center;
}

.logo__icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo__text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.sidebar__toggle {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all var(--transition);
}

.sidebar__toggle:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar__toggle-icon--flipped {
  transform: rotate(180deg);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 24px;
}

.sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: -4px;
  padding-right: 4px;
}

.sidebar__scroll::-webkit-scrollbar {
  width: 4px;
}

.sidebar__section {
  margin-bottom: 20px;
}

.section-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0 12px 8px;
  white-space: nowrap;
}

.section-label--mini {
  text-align: center;
  padding: 0 0 8px;
  font-size: 9px;
  color: var(--text-muted);
  opacity: 0.7;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 8px;
}

.section-head .section-label {
  padding: 0;
}

.section-count {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--bg-elevated);
}

.sidebar__section--spaces {
  margin-bottom: 12px;
}

.space-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  margin-bottom: 4px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.sidebar--collapsed .space-item {
  justify-content: center;
  padding: 10px 8px;
}

.space-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 999px;
  background: var(--space-color);
  opacity: 0;
  transition: opacity var(--transition);
}

.space-item:hover {
  background: color-mix(in srgb, var(--space-color) 8%, transparent);
  border-color: color-mix(in srgb, var(--space-color) 18%, transparent);
  color: var(--text-primary);
}

.space-item--active {
  background: color-mix(in srgb, var(--space-color) 12%, transparent);
  border-color: color-mix(in srgb, var(--space-color) 28%, transparent);
  color: var(--text-primary);
}

.space-item--active::before {
  opacity: 1;
}

.space-item__marker {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.space-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--space-color);
  transition: transform var(--transition), box-shadow var(--transition);
}

.space-item--active .space-item__dot {
  transform: scale(1.15);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--space-color) 25%, transparent);
}

.sidebar--collapsed .space-item__dot {
  width: 10px;
  height: 10px;
}

.space-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.space-item__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.space-item__meta {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 400;
}

.space-item--active .space-item__meta {
  color: color-mix(in srgb, var(--space-color) 70%, white);
}

.space-item__count {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  flex-shrink: 0;
}

.space-item__check {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--space-color);
  flex-shrink: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition);
  position: relative;
}

.sidebar--collapsed .nav-item {
  justify-content: center;
  padding: 10px 8px;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--bg-active);
  color: var(--text-primary);
}

.nav-item__icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-item__icon {
  display: flex;
  align-items: center;
}

.nav-item.active .nav-item__icon {
  opacity: 1;
  color: var(--accent-to);
}

.nav-item__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item__badge {
  margin-left: auto;
  background: rgba(124, 58, 237, 0.2);
  color: var(--accent-to);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  flex-shrink: 0;
}

.nav-item__badge-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-to);
  border: 2px solid var(--bg-base);
}

.sidebar__bottom {
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--glass-card);
  border: 1px solid var(--border-subtle);
  text-align: left;
  transition: background var(--transition), border-color var(--transition);
}

.profile-card:hover {
  background: var(--bg-hover);
  border-color: var(--border-medium);
}

.profile-card--collapsed {
  justify-content: center;
  padding: 10px;
}

.profile-card__avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-neon), var(--accent-to));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.profile-card--collapsed .profile-card__avatar::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--bg-base);
}

.profile-card__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.profile-card__name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-card__role {
  font-size: 11px;
  color: var(--text-muted);
}

.profile-card__status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #4ade80;
  margin-top: 2px;
}

.profile-card__chevron {
  color: var(--text-muted);
  flex-shrink: 0;
}

.upgrade-card {
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--glass-card);
  border: 1px solid var(--border-subtle);
}

.upgrade-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.upgrade-card__icon {
  font-size: 16px;
  line-height: 1;
}

.upgrade-card__title {
  font-size: 13px;
  font-weight: 600;
}

.upgrade-card__desc {
  font-size: 11px;
  line-height: 1.45;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.upgrade-card__btn {
  width: 100%;
  padding: 9px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent-neon), var(--accent-to));
  color: white;
  font-size: 12px;
  font-weight: 600;
  transition: opacity var(--transition), transform var(--transition);
}

.upgrade-card__btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}
</style>
