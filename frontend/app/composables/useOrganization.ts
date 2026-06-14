import type { Organization, Project } from '~/types/organization'

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'acme',
    label: 'Acme Corp',
    color: '#7C3AED',
    members: 24,
    description: 'Consultoria B2B e produto interno.',
  },
  {
    id: 'startup-x',
    label: 'Startup X',
    color: '#3B82F6',
    members: 8,
    description: 'MVP mobile e growth early-stage.',
  },
  {
    id: 'pessoal',
    label: 'Pessoal',
    color: '#22C55E',
    members: 1,
    description: 'Projetos pessoais e side projects.',
  },
]

export const PROJECTS: Project[] = [
  {
    id: 'acme-platform',
    organizationId: 'acme',
    label: 'Plataforma Acme',
    color: '#7C3AED',
    openTasks: 12,
    members: 8,
    description: 'Roadmap, features e entregas do produto.',
  },
  {
    id: 'acme-support',
    organizationId: 'acme',
    label: 'Suporte Q2',
    color: '#22C55E',
    openTasks: 9,
    members: 4,
    description: 'Tickets, SLA e atendimento ao cliente.',
  },
  {
    id: 'startup-mvp',
    organizationId: 'startup-x',
    label: 'MVP Mobile',
    color: '#3B82F6',
    openTasks: 15,
    members: 6,
    description: 'App iOS/Android e backend.',
  },
  {
    id: 'startup-marketing',
    organizationId: 'startup-x',
    label: 'Marketing',
    color: '#F97316',
    openTasks: 7,
    members: 5,
    description: 'Campanhas, conteúdo e growth.',
  },
  {
    id: 'souvoce',
    organizationId: 'pessoal',
    label: 'Souvoce',
    color: '#EC4899',
    openTasks: 6,
    members: 1,
    description: 'Transformar conversas em tarefas com IA.',
  },
]

export function projectPath(id: string) {
  return `/project/${id}`
}

export function useOrganization() {
  const router = useRouter()
  const route = useRoute()

  const activeOrganizationId = useState<string>('active-organization', () => 'acme')
  const activeProjectId = useState<string>('active-project', () => 'acme-platform')

  const activeOrganization = computed(
    (): Organization => ORGANIZATIONS.find(o => o.id === activeOrganizationId.value) ?? ORGANIZATIONS[0]!,
  )

  const activeProject = computed(
    (): Project => PROJECTS.find(p => p.id === activeProjectId.value) ?? PROJECTS[0]!,
  )

  const projects = computed(() =>
    PROJECTS.filter(p => p.organizationId === activeOrganizationId.value),
  )

  watch(
    () => route.params.id,
    (id) => {
      if (route.path.startsWith('/project/') && typeof id === 'string') {
        const project = getProject(id)
        if (project) selectProject(id, { navigate: false })
      }
    },
    { immediate: true },
  )

  function getOrganization(id: string) {
    return ORGANIZATIONS.find(o => o.id === id)
  }

  function getProject(id: string) {
    return PROJECTS.find(p => p.id === id)
  }

  function isProjectActive(id: string) {
    return activeProjectId.value === id || route.path === projectPath(id)
  }

  function ensureProjectForOrganization(organizationId: string) {
    if (getProject(activeProjectId.value)?.organizationId === organizationId) return
    const fallback = PROJECTS.find(p => p.organizationId === organizationId)
    if (fallback) activeProjectId.value = fallback.id
  }

  function selectOrganization(id: string, options?: { navigate?: boolean }) {
    if (!getOrganization(id)) return
    activeOrganizationId.value = id
    ensureProjectForOrganization(id)
    if (options?.navigate !== false) {
      router.push(projectPath(activeProjectId.value))
    }
  }

  function selectProject(id: string, options?: { navigate?: boolean }) {
    const project = getProject(id)
    if (!project) return
    activeProjectId.value = id
    activeOrganizationId.value = project.organizationId
    if (options?.navigate !== false) {
      router.push(projectPath(id))
    }
  }

  return {
    organizations: ORGANIZATIONS,
    projects,
    allProjects: PROJECTS,
    activeOrganizationId,
    activeOrganization,
    activeProjectId,
    activeProject,
    selectOrganization,
    selectProject,
    isProjectActive,
    getOrganization,
    getProject,
    projectPath,
  }
}
