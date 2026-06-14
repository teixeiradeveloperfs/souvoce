export type Priority = 'low' | 'medium' | 'high'
export type ColumnId = 'backlog' | 'planned' | 'in-progress' | 'review' | 'done'

export interface User {
  id: string
  name: string
  avatar: string
  color: string
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface ActivityItem {
  id: string
  user: User
  action: string
  detail?: string
  timestamp: string
  type: 'comment' | 'status' | 'attachment'
  attachment?: {
    name: string
    type: string
  }
}

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  columnId: ColumnId
  assignees: User[]
  priority: Priority
  labels: Label[]
  dueDate: string
  commentsCount: number
  progress: number
  subtasks: Subtask[]
  activity: ActivityItem[]
  attachments: { id: string; name: string; type: string; size: string }[]
}

export interface Column {
  id: ColumnId
  title: string
  color: string
}
