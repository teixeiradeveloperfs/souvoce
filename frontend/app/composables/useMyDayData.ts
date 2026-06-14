import type { MyDayEvent, MyDayFocusBlock, MyDayInboxItem, MyDayTask } from '~/types/myDay'
import { filterByProject } from '~/utils/projectScope'

const initialTasks: MyDayTask[] = [
  {
    id: 't1',
    title: 'Responder orçamento — Grupo Vendas SP',
    flow: 'Vendas',
    flowColor: '#8B5CF6',
    dueTime: '15:00',
    status: 'in_progress',
    source: 'WhatsApp',
    projectId: 'acme-platform',
  },
  {
    id: 't2',
    title: 'Acompanhar ticket #2450',
    flow: 'Suporte',
    flowColor: '#3B82F6',
    dueTime: '18:00',
    status: 'pending',
    source: 'Interno',
    projectId: 'acme-support',
  },
  {
    id: 't3',
    title: 'Follow-up parceria TechCorp',
    flow: 'Parcerias',
    flowColor: '#22C55E',
    dueTime: '17:00',
    status: 'pending',
    projectId: 'acme-platform',
  },
  {
    id: 't4',
    title: 'Preparar demo com cliente',
    flow: 'Vendas',
    flowColor: '#8B5CF6',
    dueTime: '10:30',
    status: 'done',
    projectId: 'acme-platform',
  },
  {
    id: 't5',
    title: 'Responder DM @cliente_premium',
    flow: 'Marketing',
    flowColor: '#F97316',
    dueTime: '16:30',
    status: 'pending',
    source: 'Instagram',
    projectId: 'acme-platform',
  },
  {
    id: 't6',
    title: 'Implementar push notifications',
    flow: 'Engenharia',
    flowColor: '#6366F1',
    dueTime: '14:00',
    status: 'in_progress',
    projectId: 'startup-mvp',
  },
  {
    id: 't7',
    title: 'Revisar copy campanha Instagram',
    flow: 'Marketing',
    flowColor: '#F97316',
    dueTime: '11:30',
    status: 'pending',
    projectId: 'startup-marketing',
  },
  {
    id: 't8',
    title: 'Validar modelo multi-empresa',
    flow: 'Produto',
    flowColor: '#EC4899',
    dueTime: '13:00',
    status: 'pending',
    projectId: 'souvoce',
  },
]

const allTodayEvents: MyDayEvent[] = [
  { id: 'e1', time: '09:00', endTime: '09:30', title: 'Stand-up equipe', flow: 'Interno', color: '#8B5CF6', projectId: 'acme-platform' },
  { id: 'e2', time: '11:00', endTime: '12:00', title: 'Demo com cliente', flow: 'Vendas', color: '#3B82F6', projectId: 'acme-platform' },
  { id: 'e3', time: '14:30', endTime: '15:30', title: 'Review tickets suporte', flow: 'Suporte', color: '#22C55E', projectId: 'acme-support' },
  { id: 'e4', time: '16:00', endTime: '17:00', title: 'Alinhamento marketing', flow: 'Marketing', color: '#F97316', projectId: 'acme-platform' },
  { id: 'e5', time: '09:30', endTime: '11:00', title: 'Retrospectiva sprint', flow: 'Engenharia', color: '#6366F1', projectId: 'startup-mvp' },
  { id: 'e6', time: '10:00', endTime: '10:45', title: 'Sync produto Souvoce', flow: 'Produto', color: '#EC4899', projectId: 'souvoce' },
]

const allUrgentInbox: MyDayInboxItem[] = [
  {
    id: 'i1',
    title: 'Maria te mencionou',
    preview: '@Lucas pode revisar o orçamento do cliente antes das 15h?',
    source: 'Grupo Vendas SP',
    timestamp: 'há 5 min',
    platform: 'whatsapp',
    projectId: 'acme-platform',
  },
  {
    id: 'i2',
    title: 'IA detectou oportunidade',
    preview: 'Cliente pediu orçamento para plano anual — confiança 94%',
    source: 'Grupo Vendas SP',
    timestamp: 'há 12 min',
    platform: 'whatsapp',
    projectId: 'acme-platform',
  },
  {
    id: 'i3',
    title: 'Tarefa atribuída a você',
    preview: 'Acompanhar ticket #2450 — prazo hoje às 18h',
    source: 'Suporte',
    timestamp: 'há 28 min',
    platform: 'internal',
    projectId: 'acme-support',
  },
  {
    id: 'i4',
    title: 'Carlos te mencionou',
    preview: '@Lucas precisamos alinhar a integração antes da sprint',
    source: 'Engenharia · Telegram',
    timestamp: 'há 40 min',
    platform: 'telegram',
    projectId: 'startup-mvp',
  },
  {
    id: 'i5',
    title: 'IA sugeriu nova tarefa',
    preview: 'Conversa no WhatsApp pode virar fluxo de onboarding automático',
    source: 'Souvoce · WhatsApp',
    timestamp: 'há 20 min',
    platform: 'whatsapp',
    projectId: 'souvoce',
  },
]

const allFocusBlocks: MyDayFocusBlock[] = [
  {
    id: 'f1',
    label: 'Manhã',
    time: '09:00 – 12:00',
    description: 'Reuniões e follow-ups de vendas',
    color: '#8B5CF6',
    projectId: 'acme-platform',
  },
  {
    id: 'f2',
    label: 'Tarde',
    time: '14:00 – 18:00',
    description: 'Suporte, inbox e entregas do dia',
    color: '#3B82F6',
    projectId: 'acme-support',
  },
  {
    id: 'f3',
    label: 'Sprint',
    time: '09:00 – 12:00',
    description: 'Desenvolvimento e code review',
    color: '#6366F1',
    projectId: 'startup-mvp',
  },
  {
    id: 'f4',
    label: 'Produto',
    time: '10:00 – 13:00',
    description: 'Protótipo, UX e validação',
    color: '#EC4899',
    projectId: 'souvoce',
  },
]

export function useMyDayData() {
  const { activeProjectId } = useOrganization()
  const allTasks = useState<MyDayTask[]>('my-day-tasks', () => structuredClone(initialTasks))

  const tasks = computed(() => filterByProject(allTasks.value, activeProjectId.value))
  const todayEvents = computed(() => filterByProject(allTodayEvents, activeProjectId.value))
  const urgentInbox = computed(() => filterByProject(allUrgentInbox, activeProjectId.value))
  const focusBlocks = computed(() => filterByProject(allFocusBlocks, activeProjectId.value))

  const completedCount = computed(() => tasks.value.filter(t => t.status === 'done').length)
  const totalCount = computed(() => tasks.value.length)
  const progress = computed(() =>
    totalCount.value ? Math.round((completedCount.value / totalCount.value) * 100) : 0,
  )

  const pendingTasks = computed(() =>
    tasks.value
      .filter(t => t.status !== 'done')
      .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || '')),
  )

  const doneTasks = computed(() => tasks.value.filter(t => t.status === 'done'))

  const nextEvent = computed(() => {
    const now = '12:35'
    const events = todayEvents.value
    return events.find(e => e.time > now) || events[events.length - 1] || null
  })

  const timeline = computed(() => {
    const items = [
      ...todayEvents.value.map(e => ({
        id: e.id,
        type: 'event' as const,
        time: e.time,
        title: e.title,
        meta: `${e.flow} · ${e.endTime ? `${e.time} – ${e.endTime}` : e.time}`,
        color: e.color,
      })),
      ...pendingTasks.value
        .filter(t => t.dueTime)
        .map(t => ({
          id: t.id,
          type: 'task' as const,
          time: t.dueTime!,
          title: t.title,
          meta: `${t.flow}${t.source ? ` · ${t.source}` : ''}`,
          color: t.flowColor,
        })),
    ]
    return items.sort((a, b) => a.time.localeCompare(b.time))
  })

  const dateLabel = computed(() =>
    new Date('2026-06-14T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
  )

  function toggleTask(id: string) {
    const task = allTasks.value.find(t => t.id === id)
    if (!task) return
    if (task.status === 'done') {
      task.status = 'pending'
    }
    else {
      task.status = 'done'
    }
  }

  function setInProgress(id: string) {
    const task = allTasks.value.find(t => t.id === id)
    if (task && task.status !== 'done') task.status = 'in_progress'
  }

  return {
    tasks,
    todayEvents,
    urgentInbox,
    focusBlocks,
    completedCount,
    totalCount,
    progress,
    pendingTasks,
    doneTasks,
    nextEvent,
    timeline,
    dateLabel,
    toggleTask,
    setInProgress,
  }
}
