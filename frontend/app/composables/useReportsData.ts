import type {
  AiReportMetric,
  FlowReport,
  PlatformReport,
  ReportFlowFilter,
  ReportKpi,
  ReportPeriod,
  TeamReportRow,
} from '~/types/reports'
import { filterByProject } from '~/utils/projectScope'

const flowReportsBase: FlowReport[] = [
  {
    id: 'sales',
    name: 'Vendas',
    color: '#8B5CF6',
    tasksCompleted: 48,
    tasksOpen: 12,
    completionRate: 80,
    avgResponseTime: '12 min',
    aiDetections: 23,
    chart: [4, 7, 5, 9, 8, 11, 12],
    projectId: 'acme-platform',
  },
  {
    id: 'support',
    name: 'Suporte',
    color: '#3B82F6',
    tasksCompleted: 36,
    tasksOpen: 8,
    completionRate: 82,
    avgResponseTime: '18 min',
    aiDetections: 15,
    chart: [6, 5, 8, 7, 9, 8, 8],
    projectId: 'acme-support',
  },
  {
    id: 'partnerships',
    name: 'Parcerias',
    color: '#22C55E',
    tasksCompleted: 19,
    tasksOpen: 5,
    completionRate: 79,
    avgResponseTime: '25 min',
    aiDetections: 7,
    chart: [2, 3, 4, 3, 5, 4, 5],
    projectId: 'acme-platform',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    color: '#F97316',
    tasksCompleted: 27,
    tasksOpen: 7,
    completionRate: 79,
    avgResponseTime: '21 min',
    aiDetections: 11,
    chart: [3, 5, 4, 6, 5, 7, 7],
    projectId: 'acme-platform',
  },
  {
    id: 'engineering',
    name: 'Engenharia',
    color: '#6366F1',
    tasksCompleted: 42,
    tasksOpen: 15,
    completionRate: 74,
    avgResponseTime: '14 min',
    aiDetections: 9,
    chart: [8, 10, 9, 12, 11, 14, 15],
    projectId: 'startup-mvp',
  },
  {
    id: 'growth',
    name: 'Growth',
    color: '#F97316',
    tasksCompleted: 21,
    tasksOpen: 7,
    completionRate: 75,
    avgResponseTime: '19 min',
    aiDetections: 14,
    chart: [2, 4, 3, 5, 6, 7, 7],
    projectId: 'startup-marketing',
  },
  {
    id: 'product',
    name: 'Produto',
    color: '#EC4899',
    tasksCompleted: 12,
    tasksOpen: 6,
    completionRate: 67,
    avgResponseTime: '22 min',
    aiDetections: 5,
    chart: [1, 2, 3, 4, 5, 5, 6],
    projectId: 'souvoce',
  },
]

const platformReportsByProject: Record<string, PlatformReport[]> = {
  'acme-platform': [
    { id: 'whatsapp', name: 'WhatsApp', color: '#22C55E', share: 52, conversations: 142, tasksCreated: 89 },
    { id: 'instagram', name: 'Instagram', color: '#EC4899', share: 24, conversations: 58, tasksCreated: 31 },
    { id: 'telegram', name: 'Telegram', color: '#3B82F6', share: 14, conversations: 34, tasksCreated: 18 },
    { id: 'internal', name: 'Interno', color: '#8B5CF6', share: 10, conversations: 26, tasksCreated: 22 },
  ],
  'acme-support': [
    { id: 'whatsapp', name: 'WhatsApp', color: '#22C55E', share: 68, conversations: 96, tasksCreated: 54 },
    { id: 'internal', name: 'Interno', color: '#8B5CF6', share: 22, conversations: 31, tasksCreated: 28 },
    { id: 'telegram', name: 'Telegram', color: '#3B82F6', share: 10, conversations: 14, tasksCreated: 8 },
  ],
  'startup-mvp': [
    { id: 'internal', name: 'Interno', color: '#8B5CF6', share: 55, conversations: 42, tasksCreated: 38 },
    { id: 'telegram', name: 'Telegram', color: '#3B82F6', share: 30, conversations: 23, tasksCreated: 12 },
    { id: 'whatsapp', name: 'WhatsApp', color: '#22C55E', share: 15, conversations: 11, tasksCreated: 6 },
  ],
  'startup-marketing': [
    { id: 'instagram', name: 'Instagram', color: '#EC4899', share: 58, conversations: 74, tasksCreated: 41 },
    { id: 'whatsapp', name: 'WhatsApp', color: '#22C55E', share: 28, conversations: 36, tasksCreated: 19 },
    { id: 'internal', name: 'Interno', color: '#8B5CF6', share: 14, conversations: 18, tasksCreated: 11 },
  ],
  souvoce: [
    { id: 'whatsapp', name: 'WhatsApp', color: '#22C55E', share: 72, conversations: 28, tasksCreated: 18 },
    { id: 'internal', name: 'Interno', color: '#8B5CF6', share: 28, conversations: 11, tasksCreated: 9 },
  ],
}

const teamRowsByProject: Record<string, TeamReportRow[]> = {
  'acme-platform': [
    { id: 't1', name: 'Ana Costa', avatar: 'AC', color: '#8B5CF6', tasksDone: 24, responseRate: 96 },
    { id: 't2', name: 'Pedro Lima', avatar: 'PL', color: '#3B82F6', tasksDone: 19, responseRate: 91 },
    { id: 't3', name: 'Maria Silva', avatar: 'MS', color: '#EC4899', tasksDone: 17, responseRate: 88 },
  ],
  'acme-support': [
    { id: 't2', name: 'Pedro Lima', avatar: 'PL', color: '#3B82F6', tasksDone: 22, responseRate: 94 },
    { id: 't1', name: 'Ana Costa', avatar: 'AC', color: '#8B5CF6', tasksDone: 14, responseRate: 92 },
  ],
  'startup-mvp': [
    { id: 't4', name: 'Carlos Mendes', avatar: 'CM', color: '#6366F1', tasksDone: 18, responseRate: 89 },
    { id: 't5', name: 'Luiza Park', avatar: 'LP', color: '#EC4899', tasksDone: 12, responseRate: 95 },
  ],
  'startup-marketing': [
    { id: 't6', name: 'João Mendes', avatar: 'JM', color: '#F97316', tasksDone: 14, responseRate: 85 },
    { id: 't3', name: 'Maria Silva', avatar: 'MS', color: '#EC4899', tasksDone: 9, responseRate: 87 },
  ],
  souvoce: [
    { id: 't5', name: 'Luiza Park', avatar: 'LP', color: '#EC4899', tasksDone: 8, responseRate: 100 },
  ],
}

const periodMultipliers: Record<ReportPeriod, number> = {
  '7d': 1,
  '30d': 3.8,
  '90d': 11.2,
}

export function useReportsData() {
  const { activeProjectId } = useOrganization()
  const period = ref<ReportPeriod>('30d')
  const flowFilter = ref<ReportFlowFilter>('all')

  const projectFlows = computed(() =>
    filterByProject(flowReportsBase, activeProjectId.value),
  )

  const flowReports = computed(() => {
    const m = periodMultipliers[period.value]
    const scaled = projectFlows.value.map(flow => ({
      ...flow,
      tasksCompleted: Math.round(flow.tasksCompleted * m),
      tasksOpen: Math.round(flow.tasksOpen * (period.value === '7d' ? 1 : period.value === '30d' ? 1.1 : 1.2)),
      aiDetections: Math.round(flow.aiDetections * m),
    }))
    if (flowFilter.value === 'all') return scaled
    return scaled.filter(f => f.id === flowFilter.value)
  })

  const kpis = computed<ReportKpi[]>(() => {
    const m = periodMultipliers[period.value]
    const flows = projectFlows.value
    const completed = Math.round(flows.reduce((sum, f) => sum + f.tasksCompleted, 0) * m)
    const aiTotal = Math.round(flows.reduce((sum, f) => sum + f.aiDetections, 0) * m)
    const avgRate = flows.length
      ? Math.round(flows.reduce((sum, f) => sum + f.completionRate, 0) / flows.length)
      : 0

    return [
      {
        id: 'completed',
        label: 'Tarefas concluídas',
        value: String(completed),
        change: '+12%',
        up: true,
        color: '#22C55E',
      },
      {
        id: 'response',
        label: 'Tempo médio de resposta',
        value: flows.length === 1 ? flows[0]!.avgResponseTime : '16 min',
        change: '-8%',
        up: true,
        color: '#3B82F6',
      },
      {
        id: 'ai',
        label: 'Detecções de IA',
        value: String(aiTotal),
        change: '+24%',
        up: true,
        color: '#F97316',
      },
      {
        id: 'conversion',
        label: 'Taxa de conversão',
        value: `${avgRate}%`,
        change: '+3%',
        up: true,
        color: '#8B5CF6',
      },
    ]
  })

  const platformData = computed(() => {
    const platforms = platformReportsByProject[activeProjectId.value] ?? platformReportsByProject['acme-platform']!
    return platforms.map(p => ({
      ...p,
      conversations: Math.round(p.conversations * periodMultipliers[period.value] * 0.35),
      tasksCreated: Math.round(p.tasksCreated * periodMultipliers[period.value] * 0.35),
    }))
  })

  const aiMetrics = computed<AiReportMetric[]>(() => {
    const m = periodMultipliers[period.value]
    const aiTotal = Math.round(projectFlows.value.reduce((sum, f) => sum + f.aiDetections, 0) * m)
    return [
      { id: 'opportunities', label: 'Oportunidades', value: Math.round(aiTotal * 0.32), total: aiTotal },
      { id: 'triggers', label: 'Gatilhos', value: Math.round(aiTotal * 0.39), total: aiTotal },
      { id: 'support', label: 'Suporte', value: Math.round(aiTotal * 0.18), total: aiTotal },
      { id: 'mentions', label: 'Menções', value: Math.round(aiTotal * 0.11), total: aiTotal },
    ]
  })

  const teamPerformance = computed(() => {
    const rows = teamRowsByProject[activeProjectId.value] ?? teamRowsByProject.souvoce!
    return rows.map(row => ({
      ...row,
      tasksDone: Math.round(row.tasksDone * periodMultipliers[period.value] * 0.4),
    }))
  })

  const weeklyVolume = computed(() => {
    const base = projectFlows.value[0]?.chart ?? [18, 24, 21, 29, 26, 32, 28]
    return base.map(v => Math.round(v * (period.value === '7d' ? 1 : period.value === '30d' ? 1.15 : 1.3)))
  })

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  const flowFilters = computed(() => {
    const options = projectFlows.value.map(flow => ({
      id: flow.id as ReportFlowFilter,
      label: flow.name,
    }))
    return [{ id: 'all' as const, label: 'Todos os fluxos' }, ...options]
  })

  watch(activeProjectId, () => {
    flowFilter.value = 'all'
  })

  return {
    period,
    flowFilter,
    kpis,
    flowReports,
    platformData,
    aiMetrics,
    teamPerformance,
    weeklyVolume,
    weekDays,
    flowFilters,
  }
}
