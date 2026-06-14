export type MyDayTaskStatus = 'pending' | 'done' | 'in_progress'

export interface MyDayTask {
  id: string
  title: string
  flow: string
  flowColor: string
  dueTime?: string
  status: MyDayTaskStatus
  source?: string
  projectId: string
}

export interface MyDayEvent {
  id: string
  time: string
  endTime?: string
  title: string
  flow: string
  color: string
  projectId: string
}

export interface MyDayInboxItem {
  id: string
  title: string
  preview: string
  source: string
  timestamp: string
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'internal'
  projectId: string
}

export interface MyDayFocusBlock {
  id: string
  label: string
  time: string
  description: string
  color: string
  projectId: string
}
