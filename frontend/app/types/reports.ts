export type ReportPeriod = '7d' | '30d' | '90d'

export type ReportFlowFilter = 'all' | FlowReport['id']

export interface ReportKpi {
  id: string
  label: string
  value: string
  change: string
  up: boolean
  color: string
}

export interface FlowReport {
  id: string
  name: string
  color: string
  tasksCompleted: number
  tasksOpen: number
  completionRate: number
  avgResponseTime: string
  aiDetections: number
  chart: number[]
  projectId: string
}

export interface PlatformReport {
  id: string
  name: string
  color: string
  share: number
  conversations: number
  tasksCreated: number
}

export interface AiReportMetric {
  id: string
  label: string
  value: number
  total: number
}

export interface TeamReportRow {
  id: string
  name: string
  avatar: string
  color: string
  tasksDone: number
  responseRate: number
}

export const reportPeriodLabels: Record<ReportPeriod, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  '90d': '90 dias',
}
