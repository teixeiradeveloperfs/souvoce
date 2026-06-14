export type ActivityKind = 'message' | 'task' | 'team' | 'ai'

export type ActivityFilter = 'all' | ActivityKind

export type ActivityGroup = 'today' | 'yesterday' | 'earlier'

export interface ActivityEntry {
  id: string
  kind: ActivityKind
  title: string
  description: string
  projectId: string
  flow?: string
  flowColor?: string
  platform?: 'whatsapp' | 'instagram' | 'telegram' | 'internal'
  timestamp: string
  group: ActivityGroup
  actor?: { name: string; avatar: string; color: string }
}

export const activityKindLabels: Record<ActivityKind, string> = {
  message: 'Mensagem',
  task: 'Tarefa',
  team: 'Equipe',
  ai: 'IA',
}
