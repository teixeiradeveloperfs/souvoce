export type RitualFrequency = 'daily' | 'weekly' | 'monthly'

export type RitualFilter = 'all' | RitualFrequency | 'paused'

export interface RitualStep {
  id: string
  label: string
  done: boolean
}

export interface Ritual {
  id: string
  name: string
  description: string
  frequency: RitualFrequency
  schedule: string
  flow: string
  color: string
  active: boolean
  streak: number
  lastCompleted?: string
  nextRun: string
  dueToday: boolean
  steps: RitualStep[]
  projectId: string
}

export const ritualFrequencyLabels: Record<RitualFrequency, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
}
