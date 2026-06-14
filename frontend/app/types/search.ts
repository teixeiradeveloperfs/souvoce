export type SearchKind = 'task' | 'inbox' | 'event' | 'flow' | 'person' | 'activity' | 'alert'

export interface SearchResult {
  id: string
  kind: SearchKind
  title: string
  subtitle?: string
  meta?: string
  to: string
  color?: string
}

export const searchKindLabels: Record<SearchKind, string> = {
  task: 'Tarefa',
  inbox: 'Inbox',
  event: 'Evento',
  flow: 'Fluxo',
  person: 'Pessoa',
  activity: 'Atividade',
  alert: 'Alerta',
}

export type SearchFilter = 'all' | SearchKind
