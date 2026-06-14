export interface StatCard {
  id: string
  label: string
  value: number
  trend?: string
  trendUp?: boolean
  status?: string
  statusColor?: string
  icon: string
  iconBg: string
}

export interface FlowCard {
  id: string
  name: string
  icon: string
  color: string
  openTasks: number
  opportunities: string
  chart: number[]
  projectId: string
}

export interface SmartAlert {
  id: string
  platform: 'whatsapp' | 'instagram' | 'telegram'
  trigger: string
  source: string
  timestamp: string
  projectId: string
}

export interface ActivityItem {
  id: string
  platform: 'whatsapp' | 'instagram' | 'telegram'
  title: string
  source: string
  timestamp: string
  tag?: string
  projectId: string
}

export interface PriorityTask {
  id: string
  title: string
  flow: string
  assignee: string
  priority: 'high' | 'medium' | 'low'
  due: string
  projectId: string
}

export interface AgendaItem {
  id: string
  time: string
  title: string
  category: string
  color: string
  projectId: string
}

export interface TeamActivityItem {
  id: string
  user: { name: string; avatar: string; color: string }
  action: string
  timestamp: string
  online?: boolean
  projectId: string
}
