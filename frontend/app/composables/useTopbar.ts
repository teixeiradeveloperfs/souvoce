import { APP_ROUTES } from '~/constants/routes'

export type TopbarPanel = 'organization' | 'create' | 'notifications' | 'profile' | null

export interface TopbarNotification {
  id: string
  title: string
  preview: string
  timestamp: string
  unread: boolean
  to: string
}

export interface CreateAction {
  id: string
  label: string
  description: string
  to: string
  icon: string
}

const createActions: CreateAction[] = [
  {
    id: 'task',
    label: 'Nova tarefa',
    description: 'Criar tarefa no projeto ativo',
    to: APP_ROUTES.tasks,
    icon: 'task',
  },
  {
    id: 'event',
    label: 'Novo evento',
    description: 'Adicionar à agenda',
    to: APP_ROUTES.calendar,
    icon: 'event',
  },
  {
    id: 'inbox',
    label: 'Ver inbox',
    description: 'Ir para pendências',
    to: APP_ROUTES.inbox,
    icon: 'inbox',
  },
  {
    id: 'ritual',
    label: 'Novo ritual',
    description: 'Configurar rotina recorrente',
    to: APP_ROUTES.rituals,
    icon: 'ritual',
  },
]

export function useTopbar() {
  const router = useRouter()
  const { items: inboxItems } = useInboxData()
  const { alerts } = useDashboardData()
  const {
    organizations,
    activeOrganizationId,
    activeOrganization,
    selectOrganization: setOrganization,
    projectPath,
  } = useOrganization()

  const openPanel = useState<TopbarPanel>('topbar-panel', () => null)
  const dismissedNotifications = useState<string[]>('dismissed-notifications', () => [])

  const notifications = computed<TopbarNotification[]>(() => {
    const fromInbox = inboxItems.value
      .filter(i => i.unread)
      .slice(0, 4)
      .map(i => ({
        id: `inbox-${i.id}`,
        title: i.title,
        preview: i.preview,
        timestamp: i.timestamp,
        unread: true,
        to: APP_ROUTES.inbox,
      }))

    const fromAlerts = alerts.value
      .slice(0, 2)
      .map(a => ({
        id: `alert-${a.id}`,
        title: a.trigger,
        preview: a.source,
        timestamp: a.timestamp,
        unread: !dismissedNotifications.value.includes(`alert-${a.id}`),
        to: APP_ROUTES.inbox,
      }))

    return [...fromInbox, ...fromAlerts].filter(n => n.unread)
  })

  const notificationCount = computed(() => notifications.value.length)

  function togglePanel(panel: Exclude<TopbarPanel, null>) {
    openPanel.value = openPanel.value === panel ? null : panel
  }

  function closePanel() {
    openPanel.value = null
  }

  function openOrganizationPanel() {
    openPanel.value = 'organization'
  }

  function selectOrganization(id: string) {
    setOrganization(id)
    closePanel()
  }

  function navigateTo(to: string) {
    closePanel()
    router.push(to)
  }

  function dismissNotification(id: string) {
    if (id.startsWith('alert-')) {
      dismissedNotifications.value = [...dismissedNotifications.value, id]
      return
    }
    const inboxId = id.replace('inbox-', '')
    const item = inboxItems.value.find(i => i.id === inboxId)
    if (item) item.unread = false
  }

  function markAllNotificationsRead() {
    inboxItems.value.forEach(i => { i.unread = false })
    dismissedNotifications.value = alerts.value.map(a => `alert-${a.id}`)
  }

  return {
    organizations,
    createActions,
    openPanel,
    activeOrganization,
    activeOrganizationId,
    notifications,
    notificationCount,
    togglePanel,
    closePanel,
    openOrganizationPanel,
    selectOrganization,
    projectPath,
    navigateTo,
    dismissNotification,
    markAllNotificationsRead,
  }
}

export function useTopbarClickOutside(containerRef: Ref<HTMLElement | null>, onOutside: () => void) {
  function handler(event: MouseEvent) {
    const target = event.target as Node
    if (containerRef.value && !containerRef.value.contains(target)) {
      onOutside()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}
