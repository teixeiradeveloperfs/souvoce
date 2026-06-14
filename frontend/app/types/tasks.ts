export type TaskViewId = 'list' | 'kanban' | 'timeline' | 'gantt'

export interface TaskViewOption {
  id: TaskViewId
  label: string
  icon: string
}
