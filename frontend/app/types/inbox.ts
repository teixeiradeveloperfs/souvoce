export type InboxFilter = 'all' | 'mentions' | 'tasks' | 'ai' | 'conversations'

export type InboxType = 'mention' | 'assignment' | 'ai' | 'comment' | 'conversation'

export type InboxPlatform = 'whatsapp' | 'instagram' | 'telegram' | 'internal'

export interface InboxItem {
  id: string
  type: InboxType
  platform: InboxPlatform
  title: string
  preview: string
  source: string
  timestamp: string
  unread: boolean
  projectId: string
  priority?: 'high' | 'medium'
  actor?: {
    name: string
    avatar: string
    color: string
  }
}
