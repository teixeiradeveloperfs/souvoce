export const TASK_TIMELINE_MIN_DAY = 10
export const TASK_TIMELINE_MAX_DAY = 28

export function parseDueDay(dueDate: string): number {
  const match = dueDate.match(/(\d+)/)
  return match ? Number(match[1]) : TASK_TIMELINE_MAX_DAY
}

export function formatTimelineLabel(day: number): string {
  return `${day} mai`
}

export function getTimelineTicks(): number[] {
  const ticks: number[] = []
  for (let day = TASK_TIMELINE_MIN_DAY; day <= TASK_TIMELINE_MAX_DAY; day += 2) {
    ticks.push(day)
  }
  return ticks
}

export function getBarPosition(dueDate: string, progress: number) {
  const endDay = parseDueDay(dueDate)
  const span = Math.max(2, Math.round((100 - progress) / 18))
  const startDay = Math.max(TASK_TIMELINE_MIN_DAY, endDay - span)
  const range = TASK_TIMELINE_MAX_DAY - TASK_TIMELINE_MIN_DAY

  return {
    startDay,
    endDay,
    left: ((startDay - TASK_TIMELINE_MIN_DAY) / range) * 100,
    width: ((endDay - startDay + 1) / range) * 100,
  }
}
