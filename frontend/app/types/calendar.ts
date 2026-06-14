export type CalendarView = 'month' | 'week'

export type EventCategory = 'vendas' | 'suporte' | 'interno' | 'marketing' | 'parcerias'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  category: EventCategory
  color: string
  projectId: string
  flow?: string
  attendees?: string[]
  description?: string
}

export const categoryLabels: Record<EventCategory, string> = {
  vendas: 'Vendas',
  suporte: 'Suporte',
  interno: 'Interno',
  marketing: 'Marketing',
  parcerias: 'Parcerias',
}
