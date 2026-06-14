import type { SearchFilter, SearchKind, SearchResult } from '~/types/search'
import { APP_ROUTES } from '~/constants/routes'
import { CALENDAR_EVENTS } from '~/composables/useCalendarData'
import { filterByProject } from '~/utils/projectScope'

const recentStorageKey = 'souvoce-recent-searches'

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function matchesQuery(result: SearchResult, query: string) {
  if (!query) return true
  const haystack = normalize([result.title, result.subtitle, result.meta].filter(Boolean).join(' '))
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  return terms.every(term => haystack.includes(term))
}

export function useGlobalSearch() {
  const route = useRoute()
  const router = useRouter()
  const { activeProjectId } = useOrganization()
  const { priorityTasks, flows, alerts, activities, teamActivity } = useDashboardData()
  const { items: inboxItems } = useInboxData()
  const { tasks: projectTasks } = useProjectData()

  const activeFilter = ref<SearchFilter>('all')
  const recentSearches = useState<string[]>('recent-searches', () => [])

  const query = computed({
    get: () => (route.query.q as string) || '',
    set: (value: string) => {
      router.replace({
        path: APP_ROUTES.search,
        query: value ? { q: value } : {},
      })
    },
  })

  const calendarEvents = computed(() =>
    filterByProject(CALENDAR_EVENTS, activeProjectId.value),
  )

  const index = computed<SearchResult[]>(() => {
    const results: SearchResult[] = []

    priorityTasks.value.forEach(task => {
      results.push({
        id: `task-${task.id}`,
        kind: 'task',
        title: task.title,
        subtitle: task.flow,
        meta: `${task.assignee} · ${task.due}`,
        to: APP_ROUTES.tasks,
        color: task.priority === 'high' ? '#EF4444' : '#8B5CF6',
      })
    })

    projectTasks.value.forEach(task => {
      if (results.some(r => r.id === `task-${task.id}`)) return
      results.push({
        id: `task-${task.id}`,
        kind: 'task',
        title: task.title,
        subtitle: task.columnId,
        meta: task.dueDate ?? 'Sem prazo',
        to: APP_ROUTES.tasks,
        color: task.priority === 'high' ? '#EF4444' : '#8B5CF6',
      })
    })

    inboxItems.value.forEach(item => {
      results.push({
        id: `inbox-${item.id}`,
        kind: 'inbox',
        title: item.title,
        subtitle: item.preview,
        meta: `${item.source} · ${item.timestamp}`,
        to: APP_ROUTES.inbox,
        color: item.priority === 'high' ? '#EF4444' : '#3B82F6',
      })
    })

    calendarEvents.value.forEach(event => {
      const dateLabel = new Date(`${event.date}T12:00:00`).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
      })
      results.push({
        id: `event-${event.id}`,
        kind: 'event',
        title: event.title,
        subtitle: event.flow,
        meta: `${dateLabel} · ${event.startTime}`,
        to: APP_ROUTES.calendar,
        color: event.color,
      })
    })

    flows.value.forEach(flow => {
      results.push({
        id: `flow-${flow.id}`,
        kind: 'flow',
        title: flow.name,
        subtitle: `${flow.openTasks} tarefas abertas`,
        meta: flow.opportunities,
        to: APP_ROUTES.home,
        color: flow.color,
      })
    })

    teamActivity.value.forEach(item => {
      results.push({
        id: `person-${item.id}`,
        kind: 'person',
        title: item.user.name,
        subtitle: item.action,
        meta: item.timestamp,
        to: APP_ROUTES.home,
        color: item.user.color,
      })
    })

    activities.value.forEach(item => {
      results.push({
        id: `activity-${item.id}`,
        kind: 'activity',
        title: item.title,
        subtitle: item.source,
        meta: `${item.tag ?? 'Atividade'} · ${item.timestamp}`,
        to: APP_ROUTES.activities,
        color: '#60A5FA',
      })
    })

    alerts.value.forEach(item => {
      results.push({
        id: `alert-${item.id}`,
        kind: 'alert',
        title: item.trigger,
        subtitle: item.source,
        meta: item.timestamp,
        to: APP_ROUTES.inbox,
        color: '#F97316',
      })
    })

    return results
  })

  const filteredResults = computed(() => {
    const q = query.value
    return index.value.filter(result => {
      if (activeFilter.value !== 'all' && result.kind !== activeFilter.value) return false
      return matchesQuery(result, q)
    })
  })

  const groupedResults = computed(() => {
    const groups = new Map<SearchKind, SearchResult[]>()
    for (const result of filteredResults.value) {
      const list = groups.get(result.kind) || []
      list.push(result)
      groups.set(result.kind, list)
    }
    const order: SearchKind[] = ['task', 'inbox', 'event', 'flow', 'person', 'activity', 'alert']
    return order
      .filter(kind => groups.has(kind))
      .map(kind => ({ kind, items: groups.get(kind)! }))
  })

  const filters = computed(() => {
    const countFor = (kind: SearchFilter) =>
      index.value.filter(r => matchesQuery(r, query.value) && (kind === 'all' || r.kind === kind)).length

    return [
      { id: 'all' as const, label: 'Todos', count: countFor('all') },
      { id: 'task' as const, label: 'Tarefas', count: countFor('task') },
      { id: 'inbox' as const, label: 'Inbox', count: countFor('inbox') },
      { id: 'event' as const, label: 'Eventos', count: countFor('event') },
      { id: 'flow' as const, label: 'Fluxos', count: countFor('flow') },
      { id: 'person' as const, label: 'Pessoas', count: countFor('person') },
    ]
  })

  const suggestions = computed(() => {
    const byProject: Record<string, string[]> = {
      'acme-platform': ['orçamento', 'Vendas SP', 'parceria', 'stand-up'],
      'acme-support': ['ticket #2450', 'suporte', 'cliente #2841'],
      'startup-mvp': ['push notifications', 'sprint', 'integração'],
      'startup-marketing': ['Instagram', 'campanha', 'leads'],
      souvoce: ['multi-empresa', 'onboarding', 'WhatsApp'],
    }
    return byProject[activeProjectId.value] ?? ['tarefa', 'inbox', 'calendário']
  })

  function openSearch(initialQuery?: string) {
    router.push({
      path: APP_ROUTES.search,
      query: initialQuery ? { q: initialQuery } : route.query.q ? { q: route.query.q as string } : {},
    })
  }

  function setQuery(value: string) {
    query.value = value
  }

  function saveRecentSearch(term: string) {
    const normalized = term.trim()
    if (!normalized || normalized.length < 2) return
    const next = [normalized, ...recentSearches.value.filter(s => s !== normalized)].slice(0, 6)
    recentSearches.value = next
    if (import.meta.client) {
      localStorage.setItem(recentStorageKey, JSON.stringify(next))
    }
  }

  function loadRecentSearches() {
    if (!import.meta.client) return
    try {
      const stored = localStorage.getItem(recentStorageKey)
      if (stored) recentSearches.value = JSON.parse(stored)
    }
    catch {
      recentSearches.value = []
    }
  }

  function clearRecentSearches() {
    recentSearches.value = []
    if (import.meta.client) localStorage.removeItem(recentStorageKey)
  }

  function selectResult(result: SearchResult) {
    if (query.value.trim()) saveRecentSearch(query.value)
    router.push(result.to)
  }

  return {
    query,
    activeFilter,
    recentSearches,
    filteredResults,
    groupedResults,
    filters,
    suggestions,
    openSearch,
    setQuery,
    saveRecentSearch,
    loadRecentSearches,
    clearRecentSearches,
    selectResult,
  }
}
