export interface Organization {
  id: string
  label: string
  color: string
  members: number
  description: string
}

export interface Project {
  id: string
  organizationId: string
  label: string
  color: string
  openTasks: number
  members: number
  description: string
}
