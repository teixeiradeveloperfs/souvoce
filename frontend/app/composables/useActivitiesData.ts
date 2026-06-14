import type { ActivityEntry, ActivityFilter, ActivityGroup, ActivityKind } from '~/types/activities'
import { filterByProject } from '~/utils/projectScope'

const allActivitiesSeed: ActivityEntry[] = [
  {
    id: 'a1',
    kind: 'message',
    title: 'Nova mensagem no grupo',
    description: '14 mensagens no Grupo Vendas SP — gatilho de orçamento detectado',
    flow: 'Vendas',
    flowColor: '#8B5CF6',
    platform: 'whatsapp',
    timestamp: 'há 3 min',
    group: 'today',
    projectId: 'acme-platform',
  },
  {
    id: 'a2',
    kind: 'ai',
    title: 'Oportunidade detectada pela IA',
    description: 'Cliente pediu orçamento para plano anual — confiança 94%',
    flow: 'Vendas',
    flowColor: '#8B5CF6',
    platform: 'whatsapp',
    timestamp: 'há 12 min',
    group: 'today',
    projectId: 'acme-platform',
  },
  {
    id: 'a3',
    kind: 'task',
    title: 'Tarefa movida para Em andamento',
    description: 'Acompanhar ticket #2450 — Pedro Lima',
    flow: 'Suporte',
    flowColor: '#3B82F6',
    platform: 'internal',
    timestamp: 'há 22 min',
    group: 'today',
    projectId: 'acme-support',
    actor: { name: 'Pedro Lima', avatar: 'PL', color: '#3B82F6' },
  },
  {
    id: 'a4',
    kind: 'team',
    title: 'Ana Costa concluiu uma tarefa',
    description: 'Respondeu orçamento — Grupo Vendas SP',
    flow: 'Vendas',
    flowColor: '#8B5CF6',
    timestamp: 'há 35 min',
    group: 'today',
    projectId: 'acme-platform',
    actor: { name: 'Ana Costa', avatar: 'AC', color: '#8B5CF6' },
  },
  {
    id: 'a5',
    kind: 'message',
    title: 'Menção detectada',
    description: '@cliente_premium enviou DM sobre integração API',
    flow: 'Marketing',
    flowColor: '#F97316',
    platform: 'instagram',
    timestamp: 'há 45 min',
    group: 'today',
    projectId: 'acme-platform',
  },
  {
    id: 'a6',
    kind: 'task',
    title: 'Ticket de suporte aberto',
    description: 'Suporte · #2450 — prioridade alta',
    flow: 'Suporte',
    flowColor: '#3B82F6',
    platform: 'whatsapp',
    timestamp: 'há 1h',
    group: 'today',
    projectId: 'acme-support',
  },
  {
    id: 'a7',
    kind: 'ai',
    title: 'Gatilho: pedido de parceria',
    description: 'Mensagem no canal Parceiros indica interesse em revenda',
    flow: 'Parcerias',
    flowColor: '#22C55E',
    platform: 'telegram',
    timestamp: 'há 2h',
    group: 'today',
    projectId: 'acme-platform',
  },
  {
    id: 'a8',
    kind: 'team',
    title: 'João Mendes criou tarefa via IA',
    description: 'Campanha Instagram — revisão de copy',
    flow: 'Marketing',
    flowColor: '#F97316',
    timestamp: 'há 3h',
    group: 'today',
    projectId: 'startup-marketing',
    actor: { name: 'João Mendes', avatar: 'JM', color: '#F97316' },
  },
  {
    id: 'a9',
    kind: 'task',
    title: 'Campanha movida para Em revisão',
    description: 'Marketing · Campanha Instagram Q2',
    flow: 'Marketing',
    flowColor: '#F97316',
    platform: 'internal',
    timestamp: 'Ontem',
    group: 'yesterday',
    projectId: 'startup-marketing',
    actor: { name: 'João Mendes', avatar: 'JM', color: '#F97316' },
  },
  {
    id: 'a10',
    kind: 'message',
    title: 'Nova oportunidade identificada',
    description: 'Canal Leads · Telegram — IA classificou como lead quente',
    flow: 'Vendas',
    flowColor: '#8B5CF6',
    platform: 'telegram',
    timestamp: 'Ontem',
    group: 'yesterday',
    projectId: 'startup-mvp',
  },
  {
    id: 'a11',
    kind: 'team',
    title: 'Maria Silva moveu tarefa para Concluído',
    description: 'Follow-up parceria TechCorp',
    flow: 'Parcerias',
    flowColor: '#22C55E',
    timestamp: 'Ontem',
    group: 'yesterday',
    projectId: 'acme-platform',
    actor: { name: 'Maria Silva', avatar: 'MS', color: '#EC4899' },
  },
  {
    id: 'a12',
    kind: 'ai',
    title: 'Menção com intenção de compra',
    description: 'Comentário em post pedindo demo do produto',
    flow: 'Marketing',
    flowColor: '#F97316',
    platform: 'instagram',
    timestamp: 'Ontem',
    group: 'yesterday',
    projectId: 'startup-marketing',
  },
  {
    id: 'a13',
    kind: 'task',
    title: 'PR de push notifications aberto',
    description: 'Engenharia · MVP Mobile',
    flow: 'Engenharia',
    flowColor: '#6366F1',
    platform: 'internal',
    timestamp: 'há 40 min',
    group: 'today',
    projectId: 'startup-mvp',
    actor: { name: 'Carlos Mendes', avatar: 'CM', color: '#6366F1' },
  },
  {
    id: 'a14',
    kind: 'ai',
    title: 'IA sugeriu fluxo de onboarding',
    description: 'Conversa WhatsApp convertida em tarefa automaticamente',
    flow: 'Produto',
    flowColor: '#EC4899',
    platform: 'whatsapp',
    timestamp: 'há 25 min',
    group: 'today',
    projectId: 'souvoce',
  },
]

const groupLabels: Record<ActivityGroup, string> = {
  today: 'Hoje',
  yesterday: 'Ontem',
  earlier: 'Anteriores',
}

const filterKinds: Record<Exclude<ActivityFilter, 'all'>, ActivityKind[]> = {
  message: ['message'],
  task: ['task'],
  team: ['team'],
  ai: ['ai'],
}

export function useActivitiesData() {
  const { activeProjectId } = useOrganization()
  const activeFilter = ref<ActivityFilter>('all')

  const projectActivities = computed(() =>
    filterByProject(allActivitiesSeed, activeProjectId.value),
  )

  const stats = computed(() => ({
    today: projectActivities.value.filter(a => a.group === 'today').length,
    tasks: projectActivities.value.filter(a => a.kind === 'task').length,
    ai: projectActivities.value.filter(a => a.kind === 'ai').length,
    team: projectActivities.value.filter(a => a.kind === 'team').length,
  }))

  const filters = computed(() => {
    const countFor = (kinds: ActivityKind[] | null) =>
      projectActivities.value.filter(a => kinds === null || kinds.includes(a.kind)).length

    return [
      { id: 'all' as const, label: 'Todos', count: countFor(null) },
      { id: 'message' as const, label: 'Mensagens', count: countFor(filterKinds.message) },
      { id: 'task' as const, label: 'Tarefas', count: countFor(filterKinds.task) },
      { id: 'team' as const, label: 'Equipe', count: countFor(filterKinds.team) },
      { id: 'ai' as const, label: 'IA', count: countFor(filterKinds.ai) },
    ]
  })

  const filteredActivities = computed(() => {
    if (activeFilter.value === 'all') return projectActivities.value
    const kinds = filterKinds[activeFilter.value]
    return projectActivities.value.filter(a => kinds.includes(a.kind))
  })

  const groupedActivities = computed(() => {
    const order: ActivityGroup[] = ['today', 'yesterday', 'earlier']
    return order
      .map(group => ({
        group,
        label: groupLabels[group],
        items: filteredActivities.value.filter(a => a.group === group),
      }))
      .filter(g => g.items.length > 0)
  })

  return {
    activeFilter,
    stats,
    filters,
    groupedActivities,
  }
}
