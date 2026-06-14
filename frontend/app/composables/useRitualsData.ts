import type { Ritual, RitualFilter } from '~/types/rituals'
import { filterByProject } from '~/utils/projectScope'

const initialRituals: Ritual[] = [
  {
    id: 'r1',
    name: 'Stand-up matinal',
    description: 'Alinhar prioridades, bloqueios e entregas do dia com a equipe.',
    frequency: 'daily',
    schedule: 'Seg–Sex · 09:00',
    flow: 'Interno',
    color: '#8B5CF6',
    active: true,
    streak: 18,
    lastCompleted: 'Hoje · 09:12',
    nextRun: 'Amanhã · 09:00',
    dueToday: true,
    projectId: 'acme-platform',
    steps: [
      { id: 's1', label: 'Revisar inbox urgente', done: true },
      { id: 's2', label: 'Compartilhar top 3 prioridades', done: true },
      { id: 's3', label: 'Registrar bloqueios', done: false },
    ],
  },
  {
    id: 'r2',
    name: 'Fechamento do dia',
    description: 'Encerrar tarefas abertas, atualizar fluxos e preparar o próximo dia.',
    frequency: 'daily',
    schedule: 'Seg–Sex · 17:30',
    flow: 'Operações',
    color: '#3B82F6',
    active: true,
    streak: 11,
    lastCompleted: 'Ontem · 17:45',
    nextRun: 'Hoje · 17:30',
    dueToday: true,
    projectId: 'acme-platform',
    steps: [
      { id: 's4', label: 'Marcar tarefas concluídas', done: false },
      { id: 's5', label: 'Responder pendências críticas', done: false },
      { id: 's6', label: 'Revisar agenda de amanhã', done: false },
    ],
  },
  {
    id: 'r3',
    name: 'Review semanal de fluxos',
    description: 'Analisar métricas, gargalos e oportunidades em cada fluxo.',
    frequency: 'weekly',
    schedule: 'Sexta · 15:00',
    flow: 'Gestão',
    color: '#22C55E',
    active: true,
    streak: 6,
    lastCompleted: 'Sexta passada',
    nextRun: 'Sexta · 15:00',
    dueToday: false,
    projectId: 'acme-platform',
    steps: [
      { id: 's7', label: 'Revisar Vendas e Suporte', done: false },
      { id: 's8', label: 'Checar alertas de IA da semana', done: false },
      { id: 's9', label: 'Definir foco da próxima semana', done: false },
    ],
  },
  {
    id: 'r4',
    name: 'Inbox zero',
    description: 'Processar menções, tarefas e conversas pendentes da inbox.',
    frequency: 'daily',
    schedule: 'Seg–Sex · 11:00 e 16:00',
    flow: 'Inbox',
    color: '#F97316',
    active: true,
    streak: 9,
    lastCompleted: 'Hoje · 11:05',
    nextRun: 'Hoje · 16:00',
    dueToday: true,
    projectId: 'acme-platform',
    steps: [
      { id: 's10', label: 'Triagem de menções', done: true },
      { id: 's11', label: 'Converter alertas em tarefas', done: true },
      { id: 's12', label: 'Arquivar itens resolvidos', done: true },
    ],
  },
  {
    id: 'r5',
    name: 'Retrospectiva de sprint',
    description: 'Refletir sobre entregas, melhorias e aprendizados do ciclo.',
    frequency: 'weekly',
    schedule: 'Quinta · 09:30',
    flow: 'Engenharia',
    color: '#EC4899',
    active: true,
    streak: 4,
    lastCompleted: 'Quinta passada',
    nextRun: 'Quinta · 09:30',
    dueToday: false,
    projectId: 'startup-mvp',
    steps: [
      { id: 's13', label: 'Coletar feedback da equipe', done: false },
      { id: 's14', label: 'Listar o que funcionou', done: false },
      { id: 's15', label: 'Definir ações de melhoria', done: false },
    ],
  },
  {
    id: 'r6',
    name: 'Follow-up comercial',
    description: 'Revisar leads quentes e oportunidades detectadas pela IA.',
    frequency: 'daily',
    schedule: 'Seg–Sex · 14:00',
    flow: 'Vendas',
    color: '#6366F1',
    active: false,
    streak: 0,
    lastCompleted: 'Pausado',
    nextRun: '—',
    dueToday: false,
    projectId: 'acme-platform',
    steps: [
      { id: 's16', label: 'Revisar oportunidades da IA', done: false },
      { id: 's17', label: 'Atualizar pipeline', done: false },
    ],
  },
  {
    id: 'r7',
    name: 'Triagem de tickets',
    description: 'Revisar fila de suporte e priorizar casos críticos.',
    frequency: 'daily',
    schedule: 'Seg–Sex · 10:00',
    flow: 'Suporte',
    color: '#3B82F6',
    active: true,
    streak: 7,
    lastCompleted: 'Hoje · 10:15',
    nextRun: 'Amanhã · 10:00',
    dueToday: true,
    projectId: 'acme-support',
    steps: [
      { id: 's18', label: 'Revisar tickets abertos', done: true },
      { id: 's19', label: 'Escalar casos urgentes', done: false },
    ],
  },
  {
    id: 'r8',
    name: 'Review de campanha',
    description: 'Analisar métricas das campanhas ativas e ajustar copy.',
    frequency: 'weekly',
    schedule: 'Terça · 14:00',
    flow: 'Marketing',
    color: '#F97316',
    active: true,
    streak: 3,
    lastCompleted: 'Terça passada',
    nextRun: 'Terça · 14:00',
    dueToday: false,
    projectId: 'startup-marketing',
    steps: [
      { id: 's20', label: 'Checar métricas Instagram', done: false },
      { id: 's21', label: 'Atualizar calendário editorial', done: false },
    ],
  },
  {
    id: 'r9',
    name: 'Check-in produto',
    description: 'Revisar protótipo, backlog e próximos passos do Souvoce.',
    frequency: 'daily',
    schedule: 'Seg–Sex · 10:00',
    flow: 'Produto',
    color: '#EC4899',
    active: true,
    streak: 5,
    lastCompleted: 'Hoje · 10:05',
    nextRun: 'Amanhã · 10:00',
    dueToday: true,
    projectId: 'souvoce',
    steps: [
      { id: 's22', label: 'Revisar tarefas do dia', done: true },
      { id: 's23', label: 'Validar fluxo multi-empresa', done: false },
    ],
  },
]

export function useRitualsData() {
  const { activeProjectId } = useOrganization()
  const allRituals = useState<Ritual[]>('rituals', () => structuredClone(initialRituals))
  const activeFilter = ref<RitualFilter>('all')
  const selectedId = ref<string | null>(null)

  const rituals = computed(() => filterByProject(allRituals.value, activeProjectId.value))

  watch(rituals, (list) => {
    if (!list.some(r => r.id === selectedId.value)) {
      selectedId.value = list[0]?.id ?? null
    }
  }, { immediate: true })

  const stats = computed(() => ({
    active: rituals.value.filter(r => r.active).length,
    dueToday: rituals.value.filter(r => r.active && r.dueToday).length,
    completedToday: rituals.value.filter(r =>
      r.active && r.dueToday && r.steps.every(s => s.done),
    ).length,
    avgStreak: Math.round(
      rituals.value.filter(r => r.active).reduce((sum, r) => sum + r.streak, 0)
      / Math.max(rituals.value.filter(r => r.active).length, 1),
    ),
  }))

  const filters = computed(() => {
    const countFor = (fn: (r: Ritual) => boolean) => rituals.value.filter(fn).length

    return [
      { id: 'all' as const, label: 'Todos', count: countFor(() => true) },
      { id: 'daily' as const, label: 'Diários', count: countFor(r => r.frequency === 'daily') },
      { id: 'weekly' as const, label: 'Semanais', count: countFor(r => r.frequency === 'weekly') },
      { id: 'paused' as const, label: 'Pausados', count: countFor(r => !r.active) },
    ]
  })

  const filteredRituals = computed(() => {
    return rituals.value.filter((ritual) => {
      if (activeFilter.value === 'paused') return !ritual.active
      if (activeFilter.value === 'all') return true
      return ritual.frequency === activeFilter.value
    })
  })

  const todayRituals = computed(() =>
    rituals.value.filter(r => r.active && r.dueToday),
  )

  const selectedRitual = computed(() =>
    rituals.value.find(r => r.id === selectedId.value) ?? null,
  )

  function selectRitual(id: string) {
    selectedId.value = id
  }

  function toggleStep(ritualId: string, stepId: string) {
    const ritual = allRituals.value.find(r => r.id === ritualId)
    const step = ritual?.steps.find(s => s.id === stepId)
    if (step) step.done = !step.done
  }

  function toggleActive(id: string) {
    const ritual = allRituals.value.find(r => r.id === id)
    if (ritual) ritual.active = !ritual.active
  }

  function progressFor(ritual: Ritual) {
    if (!ritual.steps.length) return 0
    return Math.round((ritual.steps.filter(s => s.done).length / ritual.steps.length) * 100)
  }

  return {
    rituals,
    activeFilter,
    selectedId,
    stats,
    filters,
    filteredRituals,
    todayRituals,
    selectedRitual,
    selectRitual,
    toggleStep,
    toggleActive,
    progressFor,
  }
}
