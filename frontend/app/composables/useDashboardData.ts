import type {
  ActivityItem,
  AgendaItem,
  FlowCard,
  PriorityTask,
  SmartAlert,
  StatCard,
  TeamActivityItem,
} from '~/types/dashboard'
import { filterByProject } from '~/utils/projectScope'

const allFlows: FlowCard[] = [
  {
    id: 'sales',
    name: 'Vendas',
    icon: 'bag',
    color: '#8B5CF6',
    openTasks: 12,
    opportunities: '3 oportunidades',
    chart: [4, 7, 5, 9, 8, 11, 12],
    projectId: 'acme-platform',
  },
  {
    id: 'support',
    name: 'Suporte',
    icon: 'headset',
    color: '#3B82F6',
    openTasks: 8,
    opportunities: '2 em atendimento',
    chart: [6, 5, 8, 7, 9, 8, 8],
    projectId: 'acme-support',
  },
  {
    id: 'partnerships',
    name: 'Parcerias',
    icon: 'heart',
    color: '#22C55E',
    openTasks: 5,
    opportunities: '1 negociação',
    chart: [2, 3, 4, 3, 5, 4, 5],
    projectId: 'acme-platform',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'megaphone',
    color: '#F97316',
    openTasks: 7,
    opportunities: '1 campanha ativa',
    chart: [3, 5, 4, 6, 5, 7, 7],
    projectId: 'acme-platform',
  },
  {
    id: 'engineering',
    name: 'Engenharia',
    icon: 'code',
    color: '#6366F1',
    openTasks: 15,
    opportunities: 'Sprint 12 ativa',
    chart: [8, 10, 9, 12, 11, 14, 15],
    projectId: 'startup-mvp',
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: 'megaphone',
    color: '#F97316',
    openTasks: 7,
    opportunities: '2 campanhas',
    chart: [2, 4, 3, 5, 6, 7, 7],
    projectId: 'startup-marketing',
  },
  {
    id: 'product',
    name: 'Produto',
    icon: 'spark',
    color: '#EC4899',
    openTasks: 6,
    opportunities: 'Protótipo v2',
    chart: [1, 2, 3, 4, 5, 5, 6],
    projectId: 'souvoce',
  },
]

const allAlerts: SmartAlert[] = [
  {
    id: 'a1',
    platform: 'whatsapp',
    trigger: 'Gatilho detectado: orçamento',
    source: 'Grupo Vendas SP',
    timestamp: 'há 5 min',
    projectId: 'acme-platform',
  },
  {
    id: 'a2',
    platform: 'whatsapp',
    trigger: 'Problema de suporte detectado',
    source: 'Cliente #2841',
    timestamp: 'há 12 min',
    projectId: 'acme-support',
  },
  {
    id: 'a3',
    platform: 'instagram',
    trigger: 'Nova oportunidade de venda',
    source: '@lojaoficial',
    timestamp: 'há 28 min',
    projectId: 'startup-marketing',
  },
  {
    id: 'a4',
    platform: 'telegram',
    trigger: 'Pedido de parceria detectado',
    source: 'Canal Parceiros',
    timestamp: 'há 1h',
    projectId: 'acme-platform',
  },
  {
    id: 'a5',
    platform: 'whatsapp',
    trigger: 'IA sugeriu nova tarefa',
    source: 'Souvoce · WhatsApp',
    timestamp: 'há 20 min',
    projectId: 'souvoce',
  },
]

const allActivities: ActivityItem[] = [
  {
    id: 'r1',
    platform: 'whatsapp',
    title: 'Nova mensagem no grupo',
    source: 'Vendas SP · 14 mensagens',
    timestamp: 'há 3 min',
    tag: 'Gatilho: orçamento',
    projectId: 'acme-platform',
  },
  {
    id: 'r2',
    platform: 'instagram',
    title: 'Menção detectada',
    source: '@cliente_premium',
    timestamp: 'há 18 min',
    tag: 'Oportunidade',
    projectId: 'acme-platform',
  },
  {
    id: 'r3',
    platform: 'whatsapp',
    title: 'Ticket de suporte aberto',
    source: 'Suporte · #2450',
    timestamp: 'há 32 min',
    tag: 'Urgente',
    projectId: 'acme-support',
  },
  {
    id: 'r4',
    platform: 'telegram',
    title: 'Nova oportunidade identificada',
    source: 'Canal Leads',
    timestamp: 'há 1h',
    tag: 'IA detectou',
    projectId: 'startup-mvp',
  },
  {
    id: 'r5',
    platform: 'whatsapp',
    title: 'Conversa convertida em tarefa',
    source: 'Souvoce · onboarding',
    timestamp: 'há 15 min',
    tag: 'IA detectou',
    projectId: 'souvoce',
  },
]

const allPriorityTasks: PriorityTask[] = [
  {
    id: 'p1',
    title: 'Responder orçamento — Grupo Vendas SP',
    flow: 'Vendas',
    assignee: 'Ana Costa',
    priority: 'high',
    due: 'Hoje',
    projectId: 'acme-platform',
  },
  {
    id: 'p2',
    title: 'Acompanhar ticket #2450',
    flow: 'Suporte',
    assignee: 'Pedro Lima',
    priority: 'high',
    due: 'Hoje',
    projectId: 'acme-support',
  },
  {
    id: 'p3',
    title: 'Follow-up parceria TechCorp',
    flow: 'Parcerias',
    assignee: 'Maria Silva',
    priority: 'medium',
    due: 'Amanhã',
    projectId: 'acme-platform',
  },
  {
    id: 'p4',
    title: 'Revisar campanha Instagram',
    flow: 'Marketing',
    assignee: 'João Mendes',
    priority: 'medium',
    due: 'Amanhã',
    projectId: 'startup-marketing',
  },
  {
    id: 'p5',
    title: 'Implementar push notifications',
    flow: 'Engenharia',
    assignee: 'Carlos Mendes',
    priority: 'high',
    due: 'Hoje',
    projectId: 'startup-mvp',
  },
  {
    id: 'p6',
    title: 'Validar modelo multi-empresa',
    flow: 'Produto',
    assignee: 'Luiza Park',
    priority: 'high',
    due: 'Hoje',
    projectId: 'souvoce',
  },
]

const allAgenda: AgendaItem[] = [
  { id: 'ag1', time: '09:00', title: 'Stand-up equipe', category: 'Interno', color: '#8B5CF6', projectId: 'acme-platform' },
  { id: 'ag2', time: '11:00', title: 'Demo com cliente', category: 'Vendas', color: '#3B82F6', projectId: 'acme-platform' },
  { id: 'ag3', time: '14:30', title: 'Review tickets suporte', category: 'Suporte', color: '#22C55E', projectId: 'acme-support' },
  { id: 'ag4', time: '16:00', title: 'Alinhamento marketing', category: 'Marketing', color: '#F97316', projectId: 'acme-platform' },
  { id: 'ag5', time: '09:30', title: 'Retrospectiva sprint', category: 'Engenharia', color: '#6366F1', projectId: 'startup-mvp' },
  { id: 'ag6', time: '10:00', title: 'Sync produto Souvoce', category: 'Produto', color: '#EC4899', projectId: 'souvoce' },
]

const allTeamActivity: TeamActivityItem[] = [
  {
    id: 't1',
    user: { name: 'Ana Costa', avatar: 'AC', color: '#8B5CF6' },
    action: 'Concluiu "Acompanhar ticket #2450"',
    timestamp: 'há 8 min',
    online: true,
    projectId: 'acme-support',
  },
  {
    id: 't2',
    user: { name: 'Pedro Lima', avatar: 'PL', color: '#3B82F6' },
    action: 'Comentou em "Orçamento Vendas SP"',
    timestamp: 'há 22 min',
    online: true,
    projectId: 'acme-platform',
  },
  {
    id: 't3',
    user: { name: 'Maria Silva', avatar: 'MS', color: '#EC4899' },
    action: 'Moveu tarefa para Concluído',
    timestamp: 'há 45 min',
    online: false,
    projectId: 'acme-platform',
  },
  {
    id: 't4',
    user: { name: 'João Mendes', avatar: 'JM', color: '#F97316' },
    action: 'Criou tarefa via IA',
    timestamp: 'há 1h',
    online: false,
    projectId: 'startup-marketing',
  },
  {
    id: 't5',
    user: { name: 'Carlos Mendes', avatar: 'CM', color: '#6366F1' },
    action: 'Abriu PR de push notifications',
    timestamp: 'há 35 min',
    online: true,
    projectId: 'startup-mvp',
  },
  {
    id: 't6',
    user: { name: 'Luiza Park', avatar: 'LP', color: '#EC4899' },
    action: 'Atualizou protótipo multi-empresa',
    timestamp: 'há 50 min',
    online: true,
    projectId: 'souvoce',
  },
]

export function useDashboardData() {
  const { activeProjectId, activeProject } = useOrganization()

  const flows = computed(() => filterByProject(allFlows, activeProjectId.value))
  const alerts = computed(() => filterByProject(allAlerts, activeProjectId.value))
  const activities = computed(() => filterByProject(allActivities, activeProjectId.value))
  const priorityTasks = computed(() => filterByProject(allPriorityTasks, activeProjectId.value))
  const agenda = computed(() => filterByProject(allAgenda, activeProjectId.value))
  const teamActivity = computed(() => filterByProject(allTeamActivity, activeProjectId.value))

  const stats = computed<StatCard[]>(() => {
    const openTasks = activeProject.value.openTasks
    const flowCount = flows.value.length
    const highPriority = priorityTasks.value.filter(t => t.priority === 'high').length

    return [
      {
        id: 'open',
        label: 'Tarefas abertas',
        value: openTasks,
        trend: flowCount > 2 ? '+12% vs ontem' : '+5% vs ontem',
        trendUp: true,
        icon: 'check',
        iconBg: 'rgba(139, 92, 246, 0.15)',
      },
      {
        id: 'done',
        label: 'Concluídas hoje',
        value: Math.max(1, Math.round(openTasks * 0.55)),
        trend: '+8% vs ontem',
        trendUp: true,
        icon: 'done',
        iconBg: 'rgba(34, 197, 94, 0.15)',
      },
      {
        id: 'conversations',
        label: 'Conversas monitoradas',
        value: Math.max(3, alerts.value.length * 4 + activities.value.length * 2),
        status: `${Math.min(3, alerts.value.length)} ativas agora`,
        statusColor: '#60A5FA',
        icon: 'wave',
        iconBg: 'rgba(96, 165, 250, 0.15)',
      },
      {
        id: 'opportunities',
        label: 'Oportunidades',
        value: Math.max(highPriority, alerts.value.length + 2),
        status: `${alerts.value.length} novas`,
        statusColor: '#FB923C',
        icon: 'star',
        iconBg: 'rgba(251, 146, 60, 0.15)',
      },
    ]
  })

  return { stats, flows, alerts, activities, priorityTasks, agenda, teamActivity }
}
