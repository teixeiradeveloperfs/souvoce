import type { Column, Task } from '~/types/project'
import type { TaskViewId } from '~/types/tasks'

const users = {
  luiza: { id: '1', name: 'Luiza Park', avatar: 'LP', color: '#7C3AED' },
  joao: { id: '2', name: 'João Silva', avatar: 'JS', color: '#3B82F6' },
  maria: { id: '3', name: 'Maria Oliveira', avatar: 'MO', color: '#EC4899' },
  pedro: { id: '4', name: 'Pedro Costa', avatar: 'PC', color: '#F59E0B' },
  ana: { id: '5', name: 'Ana Lima', avatar: 'AL', color: '#10B981' },
  carlos: { id: '6', name: 'Carlos Mendes', avatar: 'CM', color: '#6366F1' },
}

export const columns: Column[] = [
  { id: 'backlog', title: 'Backlog', color: '#A855F7' },
  { id: 'planned', title: 'Planejado', color: '#3B82F6' },
  { id: 'in-progress', title: 'Em andamento', color: '#F59E0B' },
  { id: 'review', title: 'Revisão', color: '#F97316' },
  { id: 'done', title: 'Concluído', color: '#22C55E' },
]

const initialTasks: Omit<Task, 'projectId'>[] = [
  {
    id: 't1',
    title: 'Pesquisa com usuários',
    description: 'Conduzir entrevistas com 12 usuários para validar o novo fluxo de onboarding e identificar pontos de fricção.',
    columnId: 'backlog',
    assignees: [users.luiza, users.joao],
    priority: 'medium',
    labels: [{ id: 'l1', name: 'Pesquisa', color: '#A855F7' }],
    dueDate: '23 mai',
    commentsCount: 4,
    progress: 0,
    subtasks: [
      { id: 's1', title: 'Preparar roteiro de entrevista', completed: false },
      { id: 's2', title: 'Agendar sessões', completed: false },
    ],
    activity: [],
    attachments: [],
  },
  {
    id: 't2',
    title: 'Wireframes do dashboard',
    description: 'Criar wireframes de baixa fidelidade para o novo dashboard principal, incluindo estados vazios e loading.',
    columnId: 'backlog',
    assignees: [users.maria],
    priority: 'low',
    labels: [{ id: 'l2', name: 'Design', color: '#EC4899' }],
    dueDate: '28 mai',
    commentsCount: 2,
    progress: 0,
    subtasks: [],
    activity: [],
    attachments: [{ id: 'a1', name: 'wireframes-v1.fig', type: 'figma', size: '2.4 MB' }],
  },
  {
    id: 't3',
    title: 'Definir arquitetura de API',
    description: 'Documentar endpoints REST e estratégia de versionamento para a nova plataforma.',
    columnId: 'planned',
    assignees: [users.pedro, users.carlos],
    priority: 'high',
    labels: [{ id: 'l3', name: 'Engenharia', color: '#3B82F6' }],
    dueDate: '20 mai',
    commentsCount: 7,
    progress: 25,
    subtasks: [
      { id: 's3', title: 'Mapear endpoints existentes', completed: true },
      { id: 's4', title: 'Definir contratos OpenAPI', completed: false },
    ],
    activity: [],
    attachments: [],
  },
  {
    id: 't4',
    title: 'Design system v2',
    description: 'Atualizar tokens de design, componentes base e documentação no Storybook.',
    columnId: 'planned',
    assignees: [users.maria, users.ana],
    priority: 'medium',
    labels: [{ id: 'l4', name: 'Design', color: '#EC4899' }],
    dueDate: '25 mai',
    commentsCount: 5,
    progress: 40,
    subtasks: [],
    activity: [],
    attachments: [],
  },
  {
    id: 't5',
    title: 'Implementar autenticação SSO',
    description: 'Integrar OAuth 2.0 com Google e Microsoft para login empresarial.',
    columnId: 'in-progress',
    assignees: [users.carlos],
    priority: 'high',
    labels: [{ id: 'l5', name: 'Engenharia', color: '#3B82F6' }],
    dueDate: '18 mai',
    commentsCount: 12,
    progress: 65,
    subtasks: [
      { id: 's5', title: 'Configurar OAuth providers', completed: true },
      { id: 's6', title: 'Implementar refresh tokens', completed: true },
      { id: 's7', title: 'Testes de integração', completed: false },
    ],
    activity: [],
    attachments: [],
  },
  {
    id: 't6',
    title: 'Migrar base de dados',
    description: 'Executar migração de PostgreSQL 14 para 16 com zero downtime.',
    columnId: 'in-progress',
    assignees: [users.pedro],
    priority: 'high',
    labels: [{ id: 'l6', name: 'Infra', color: '#6366F1' }],
    dueDate: '22 mai',
    commentsCount: 8,
    progress: 45,
    subtasks: [],
    activity: [],
    attachments: [],
  },
  {
    id: 't7',
    title: 'Implementar sistema de notificações',
    description: 'Sistema de notificações em tempo real com suporte a push, email e in-app. Inclui preferências granulares por usuário.',
    columnId: 'review',
    assignees: [users.joao, users.ana],
    priority: 'high',
    labels: [{ id: 'l7', name: 'Engenharia', color: '#3B82F6' }],
    dueDate: '24 mai',
    commentsCount: 15,
    progress: 70,
    subtasks: [
      { id: 's8', title: 'WebSocket server', completed: true },
      { id: 's9', title: 'Push notifications', completed: true },
      { id: 's10', title: 'Email templates', completed: true },
      { id: 's11', title: 'Preferências de usuário', completed: false },
      { id: 's12', title: 'Testes E2E', completed: false },
    ],
    activity: [
      {
        id: 'act1',
        user: users.joao,
        action: 'comentou',
        detail: '@maria pode revisar o fluxo de opt-out? Precisamos garantir compliance com LGPD.',
        timestamp: 'há 2h',
        type: 'comment',
      },
      {
        id: 'act2',
        user: users.joao,
        action: 'anexou',
        detail: 'notification-flow.fig',
        timestamp: 'há 2h',
        type: 'attachment',
        attachment: { name: 'notification-flow.fig', type: 'figma' },
      },
      {
        id: 'act3',
        user: users.maria,
        action: 'moveu para Revisão',
        timestamp: 'há 4h',
        type: 'status',
      },
    ],
    attachments: [
      { id: 'a2', name: 'notification-flow.fig', type: 'figma', size: '1.8 MB' },
      { id: 'a3', name: 'api-spec.yaml', type: 'file', size: '48 KB' },
    ],
  },
  {
    id: 't8',
    title: 'Setup CI/CD pipeline',
    description: 'Configurar GitHub Actions com deploy automático para staging e produção.',
    columnId: 'done',
    assignees: [users.carlos],
    priority: 'medium',
    labels: [{ id: 'l8', name: 'Infra', color: '#6366F1' }],
    dueDate: '15 mai',
    commentsCount: 3,
    progress: 100,
    subtasks: [],
    activity: [],
    attachments: [],
  },
  {
    id: 't9',
    title: 'Landing page redesign',
    description: 'Nova landing page com foco em conversão e SEO.',
    columnId: 'done',
    assignees: [users.maria, users.luiza],
    priority: 'low',
    labels: [{ id: 'l9', name: 'Marketing', color: '#F97316' }],
    dueDate: '10 mai',
    commentsCount: 6,
    progress: 100,
    subtasks: [],
    activity: [],
    attachments: [],
  },
]

const taskProjectMap: Record<string, string> = {
  t1: 'acme-platform',
  t2: 'acme-platform',
  t3: 'acme-platform',
  t4: 'acme-platform',
  t5: 'acme-platform',
  t6: 'acme-platform',
  t7: 'acme-platform',
  t8: 'acme-support',
  t9: 'startup-marketing',
}

const souvoceTasks: Task[] = [
  {
    id: 'sv1',
    title: 'Modelar organização multi-empresa',
    description: 'Separar empresas, projetos e fluxos no produto.',
    projectId: 'souvoce',
    columnId: 'in-progress',
    assignees: [users.luiza],
    priority: 'high',
    labels: [{ id: 'l10', name: 'Produto', color: '#EC4899' }],
    dueDate: '20 mai',
    commentsCount: 3,
    progress: 55,
    subtasks: [],
    activity: [],
    attachments: [],
  },
  {
    id: 'sv2',
    title: 'Integração WhatsApp Business',
    description: 'Converter mensagens recebidas em tarefas com IA.',
    projectId: 'souvoce',
    columnId: 'planned',
    assignees: [users.joao, users.carlos],
    priority: 'high',
    labels: [{ id: 'l11', name: 'Engenharia', color: '#3B82F6' }],
    dueDate: '28 mai',
    commentsCount: 8,
    progress: 20,
    subtasks: [],
    activity: [],
    attachments: [],
  },
]

export function useProjectData() {
  const { activeProjectId } = useOrganization()

  const allTasks = useState<Task[]>('project-tasks', () => [
    ...structuredClone(initialTasks).map(task => ({
      ...task,
      projectId: taskProjectMap[task.id] ?? 'acme-platform',
    })),
    ...structuredClone(souvoceTasks),
  ])

  const selectedTaskId = useState<string>('project-selected-task', () => 't7')
  const activeView = useState<TaskViewId>('tasks-active-view', () => 'kanban')

  const tasks = computed(() =>
    allTasks.value.filter(task => task.projectId === activeProjectId.value),
  )

  const selectedTask = computed(() =>
    tasks.value.find(t => t.id === selectedTaskId.value) ?? null,
  )

  watch(activeProjectId, () => {
    if (!tasks.value.some(task => task.id === selectedTaskId.value)) {
      selectedTaskId.value = tasks.value[0]?.id ?? ''
    }
  })

  function selectTask(id: string) {
    selectedTaskId.value = id
  }

  function getTasksByColumn(columnId: Column['id']) {
    return tasks.value.filter(t => t.columnId === columnId)
  }

  function getColumnTitle(columnId: Column['id']) {
    return columns.find(c => c.id === columnId)?.title ?? columnId
  }

  function getColumnColor(columnId: Column['id']) {
    return columns.find(c => c.id === columnId)?.color ?? '#8B5CF6'
  }

  return {
    allTasks,
    tasks,
    columns,
    selectedTaskId,
    selectedTask,
    activeView,
    selectTask,
    getTasksByColumn,
    getColumnTitle,
    getColumnColor,
  }
}
