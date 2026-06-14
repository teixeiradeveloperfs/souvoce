import type { InboxFilter, InboxItem } from '~/types/inbox'
import { filterByProject } from '~/utils/projectScope'

const allItemsSeed: InboxItem[] = [
  {
    id: '1',
    type: 'mention',
    platform: 'whatsapp',
    title: 'Maria te mencionou',
    preview: '@Lucas pode revisar o orçamento do cliente antes das 15h?',
    source: 'Grupo Vendas SP',
    timestamp: 'há 5 min',
    unread: true,
    priority: 'high',
    projectId: 'acme-platform',
    actor: { name: 'Maria Silva', avatar: 'MS', color: '#EC4899' },
  },
  {
    id: '2',
    type: 'ai',
    platform: 'whatsapp',
    title: 'IA detectou oportunidade',
    preview: 'Cliente pediu orçamento para plano anual — confiança 94%',
    source: 'Grupo Vendas SP · WhatsApp',
    timestamp: 'há 12 min',
    unread: true,
    priority: 'high',
    projectId: 'acme-platform',
  },
  {
    id: '3',
    type: 'assignment',
    platform: 'internal',
    title: 'Tarefa atribuída a você',
    preview: 'Acompanhar ticket #2450 — prazo hoje às 18h',
    source: 'Suporte · Automático',
    timestamp: 'há 28 min',
    unread: true,
    projectId: 'acme-support',
    actor: { name: 'Souvo IA', avatar: 'AI', color: '#8B5CF6' },
  },
  {
    id: '4',
    type: 'conversation',
    platform: 'instagram',
    title: 'Nova conversa aguardando resposta',
    preview: '@cliente_premium enviou DM sobre integração API',
    source: 'Instagram · @cliente_premium',
    timestamp: 'há 45 min',
    unread: true,
    projectId: 'acme-platform',
  },
  {
    id: '5',
    type: 'comment',
    platform: 'internal',
    title: 'Pedro comentou na sua tarefa',
    preview: 'Acho que podemos fechar o ticket após o deploy de hoje.',
    source: 'Ticket #2450 · Suporte',
    timestamp: 'há 1h',
    unread: false,
    projectId: 'acme-support',
    actor: { name: 'Pedro Lima', avatar: 'PL', color: '#3B82F6' },
  },
  {
    id: '6',
    type: 'ai',
    platform: 'telegram',
    title: 'Gatilho: pedido de parceria',
    preview: 'Mensagem no canal Parceiros indica interesse em revenda',
    source: 'Canal Parceiros · Telegram',
    timestamp: 'há 2h',
    unread: false,
    projectId: 'acme-platform',
  },
  {
    id: '7',
    type: 'mention',
    platform: 'internal',
    title: 'Ana te mencionou',
    preview: '@Lucas o design do fluxo de onboarding está pronto para review',
    source: 'Design · Figma comment',
    timestamp: 'há 3h',
    unread: false,
    projectId: 'acme-platform',
    actor: { name: 'Ana Costa', avatar: 'AC', color: '#8B5CF6' },
  },
  {
    id: '8',
    type: 'assignment',
    platform: 'whatsapp',
    title: 'Tarefa criada pela IA',
    preview: 'Responder solicitação de suporte — cliente aguarda há 2h',
    source: 'Suporte · WhatsApp',
    timestamp: 'há 4h',
    unread: false,
    priority: 'medium',
    projectId: 'acme-support',
  },
  {
    id: '9',
    type: 'conversation',
    platform: 'whatsapp',
    title: '14 mensagens não lidas',
    preview: 'Discussão ativa sobre pricing no grupo comercial',
    source: 'Grupo Comercial · WhatsApp',
    timestamp: 'há 5h',
    unread: false,
    projectId: 'acme-platform',
  },
  {
    id: '10',
    type: 'comment',
    platform: 'internal',
    title: 'João atualizou status',
    preview: 'Moveu "Campanha Instagram" para Em revisão',
    source: 'Marketing',
    timestamp: 'Ontem',
    unread: false,
    projectId: 'acme-platform',
    actor: { name: 'João Mendes', avatar: 'JM', color: '#F97316' },
  },
  {
    id: '11',
    type: 'ai',
    platform: 'instagram',
    title: 'Menção com intenção de compra',
    preview: 'Comentário em post pedindo demo do produto',
    source: '@lojaoficial · Instagram',
    timestamp: 'Ontem',
    unread: false,
    projectId: 'startup-marketing',
  },
  {
    id: '12',
    type: 'mention',
    platform: 'telegram',
    title: 'Carlos te mencionou',
    preview: '@Lucas precisamos alinhar a integração antes da sprint',
    source: 'Engenharia · Telegram',
    timestamp: 'Ontem',
    unread: false,
    projectId: 'startup-mvp',
    actor: { name: 'Carlos Mendes', avatar: 'CM', color: '#6366F1' },
  },
  {
    id: '13',
    type: 'ai',
    platform: 'whatsapp',
    title: 'IA sugeriu nova tarefa',
    preview: 'Conversa no WhatsApp pode virar fluxo de onboarding automático',
    source: 'Souvoce · WhatsApp',
    timestamp: 'há 20 min',
    unread: true,
    priority: 'high',
    projectId: 'souvoce',
  },
  {
    id: '14',
    type: 'assignment',
    platform: 'internal',
    title: 'Revisar modelo multi-empresa',
    preview: 'Validar hierarquia empresa → projeto no protótipo',
    source: 'Souvoce · Produto',
    timestamp: 'há 1h',
    unread: true,
    projectId: 'souvoce',
  },
]

const filterTypes: Record<Exclude<InboxFilter, 'all'>, InboxItem['type'][]> = {
  mentions: ['mention'],
  tasks: ['assignment'],
  ai: ['ai'],
  conversations: ['conversation', 'comment'],
}

export function useInboxData() {
  const { activeProjectId } = useOrganization()
  const activeFilter = ref<InboxFilter>('all')
  const allItems = useState<InboxItem[]>('inbox-items', () => structuredClone(allItemsSeed))

  const items = computed(() => filterByProject(allItems.value, activeProjectId.value))

  const unreadCount = computed(() => items.value.filter(i => i.unread).length)

  const filters = computed(() => {
    const countFor = (types: InboxItem['type'][] | null) =>
      items.value.filter(i => i.unread && (types === null || types.includes(i.type))).length

    return [
      { id: 'all' as const, label: 'Todos', count: countFor(null) },
      { id: 'mentions' as const, label: 'Menções', count: countFor(filterTypes.mentions) },
      { id: 'tasks' as const, label: 'Tarefas', count: countFor(filterTypes.tasks) },
      { id: 'ai' as const, label: 'IA', count: countFor(filterTypes.ai) },
      { id: 'conversations' as const, label: 'Conversas', count: countFor(filterTypes.conversations) },
    ]
  })

  const filteredItems = computed(() => {
    if (activeFilter.value === 'all') return items.value
    const types = filterTypes[activeFilter.value]
    return items.value.filter(i => types.includes(i.type))
  })

  const groupedItems = computed(() => {
    const unread = filteredItems.value.filter(i => i.unread)
    const read = filteredItems.value.filter(i => !i.unread)
    const groups = []
    if (unread.length) groups.push({ label: 'Não lidos', items: unread })
    if (read.length) groups.push({ label: 'Anteriores', items: read })
    return groups
  })

  function markRead(id: string) {
    const item = allItems.value.find(i => i.id === id)
    if (item) item.unread = false
  }

  function markAllRead() {
    items.value.forEach((item) => {
      const source = allItems.value.find(i => i.id === item.id)
      if (source) source.unread = false
    })
  }

  return {
    activeFilter,
    items,
    unreadCount,
    filters,
    filteredItems,
    groupedItems,
    markRead,
    markAllRead,
  }
}
