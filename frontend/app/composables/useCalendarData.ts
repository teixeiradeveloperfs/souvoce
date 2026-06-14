import type { CalendarEvent, CalendarView, EventCategory } from '~/types/calendar'
import { filterByProject } from '~/utils/projectScope'

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Stand-up equipe',
    date: '2026-06-14',
    startTime: '09:00',
    endTime: '09:30',
    category: 'interno',
    color: '#8B5CF6',
    projectId: 'acme-platform',
    flow: 'Interno',
    attendees: ['LM', 'AC', 'PL'],
    description: 'Alinhamento diário da equipe',
  },
  {
    id: 'e2',
    title: 'Demo com cliente',
    date: '2026-06-14',
    startTime: '11:00',
    endTime: '12:00',
    category: 'vendas',
    color: '#3B82F6',
    projectId: 'acme-platform',
    flow: 'Vendas',
    attendees: ['LM', 'MS'],
    description: 'Apresentação da plataforma Acme',
  },
  {
    id: 'e3',
    title: 'Review tickets suporte',
    date: '2026-06-14',
    startTime: '14:30',
    endTime: '15:30',
    category: 'suporte',
    color: '#22C55E',
    projectId: 'acme-support',
    flow: 'Suporte',
    attendees: ['PL', 'JM'],
  },
  {
    id: 'e4',
    title: 'Alinhamento marketing',
    date: '2026-06-14',
    startTime: '16:00',
    endTime: '17:00',
    category: 'marketing',
    color: '#F97316',
    projectId: 'acme-platform',
    flow: 'Marketing',
    attendees: ['JM', 'AC'],
  },
  {
    id: 'e5',
    title: 'Follow-up parceria TechCorp',
    date: '2026-06-15',
    startTime: '10:00',
    endTime: '10:45',
    category: 'parcerias',
    color: '#22C55E',
    projectId: 'acme-platform',
    flow: 'Parcerias',
    attendees: ['MS'],
  },
  {
    id: 'e6',
    title: 'Call grupo Vendas SP',
    date: '2026-06-16',
    startTime: '15:00',
    endTime: '16:00',
    category: 'vendas',
    color: '#3B82F6',
    projectId: 'startup-mvp',
    flow: 'Vendas',
    attendees: ['LM', 'AC'],
  },
  {
    id: 'e7',
    title: 'Retrospectiva sprint',
    date: '2026-06-18',
    startTime: '09:30',
    endTime: '11:00',
    category: 'interno',
    color: '#8B5CF6',
    projectId: 'startup-mvp',
    flow: 'Engenharia',
    attendees: ['LM', 'PL', 'CM'],
  },
  {
    id: 'e8',
    title: 'Webinar leads Instagram',
    date: '2026-06-20',
    startTime: '14:00',
    endTime: '15:30',
    category: 'marketing',
    color: '#F97316',
    projectId: 'startup-marketing',
    flow: 'Marketing',
    attendees: ['JM'],
  },
  {
    id: 'e9',
    title: 'Revisão fluxo onboarding',
    date: '2026-06-22',
    startTime: '11:00',
    endTime: '12:00',
    category: 'interno',
    color: '#8B5CF6',
    projectId: 'acme-platform',
    flow: 'Design',
    attendees: ['AC', 'LM'],
  },
  {
    id: 'e10',
    title: 'Suporte prioritário #2450',
    date: '2026-06-25',
    startTime: '10:00',
    endTime: '11:00',
    category: 'suporte',
    color: '#22C55E',
    projectId: 'acme-support',
    flow: 'Suporte',
    attendees: ['PL'],
  },
  {
    id: 'e11',
    title: 'Sync produto Souvoce',
    date: '2026-06-14',
    startTime: '10:00',
    endTime: '10:45',
    category: 'interno',
    color: '#EC4899',
    projectId: 'souvoce',
    flow: 'Produto',
    attendees: ['LM'],
  },
  {
    id: 'e12',
    title: 'Review integração WhatsApp',
    date: '2026-06-17',
    startTime: '15:00',
    endTime: '16:00',
    category: 'interno',
    color: '#EC4899',
    projectId: 'souvoce',
    flow: 'Engenharia',
    attendees: ['LM', 'CM'],
  },
]

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function useCalendarData() {
  const { activeProjectId } = useOrganization()
  const view = ref<CalendarView>('month')
  const currentMonth = ref(new Date(2026, 5, 1))
  const selectedDate = ref('2026-06-14')
  const activeCategory = ref<EventCategory | 'all'>('all')

  const projectEvents = computed(() =>
    filterByProject(CALENDAR_EVENTS, activeProjectId.value),
  )

  const monthLabel = computed(() => {
    const d = currentMonth.value
    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`
  })

  const calendarDays = computed(() => {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []

    for (let i = 0; i < startOffset; i++) {
      cells.push({ date: null as string | null, day: null as number | null, isCurrentMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      cells.push({
        date: toDateKey(date),
        day,
        isCurrentMonth: true,
        isToday: toDateKey(date) === '2026-06-14',
        isSelected: toDateKey(date) === selectedDate.value,
      })
    }

    return cells
  })

  const weekDaysHeader = weekDays

  const filteredEvents = computed(() => {
    if (activeCategory.value === 'all') return projectEvents.value
    return projectEvents.value.filter(e => e.category === activeCategory.value)
  })

  function eventsForDate(date: string) {
    return filteredEvents.value.filter(e => e.date === date)
  }

  const selectedDayEvents = computed(() =>
    eventsForDate(selectedDate.value).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  )

  const upcomingEvents = computed(() =>
    filteredEvents.value
      .filter(e => e.date >= selectedDate.value)
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
      .slice(0, 6),
  )

  const categories = computed(() => [
    { id: 'all' as const, label: 'Todos', color: '#8B5CF6' },
    { id: 'vendas' as const, label: 'Vendas', color: '#3B82F6' },
    { id: 'suporte' as const, label: 'Suporte', color: '#22C55E' },
    { id: 'interno' as const, label: 'Interno', color: '#8B5CF6' },
    { id: 'marketing' as const, label: 'Marketing', color: '#F97316' },
    { id: 'parcerias' as const, label: 'Parcerias', color: '#22C55E' },
  ])

  function prevMonth() {
    const d = currentMonth.value
    currentMonth.value = new Date(d.getFullYear(), d.getMonth() - 1, 1)
  }

  function nextMonth() {
    const d = currentMonth.value
    currentMonth.value = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  }

  function goToToday() {
    currentMonth.value = new Date(2026, 5, 1)
    selectedDate.value = '2026-06-14'
  }

  function selectDate(date: string) {
    selectedDate.value = date
  }

  function formatSelectedDate() {
    const d = new Date(`${selectedDate.value}T12:00:00`)
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return {
    view,
    currentMonth,
    selectedDate,
    activeCategory,
    monthLabel,
    calendarDays,
    weekDaysHeader,
    selectedDayEvents,
    upcomingEvents,
    categories,
    eventsForDate,
    prevMonth,
    nextMonth,
    goToToday,
    selectDate,
    formatSelectedDate,
  }
}
