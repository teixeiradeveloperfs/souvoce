export const APP_ROUTES = {
  home: '/',
  inbox: '/inbox',
  tasks: '/tasks',
  calendar: '/calendar',
  search: '/search',
  myday: '/myday',
  activities: '/activities',
  rituals: '/rituals',
  reports: '/reports',
} as const

export const AUTH_ROUTES = {
  login: '/auth/login',
  register: '/auth/register',
  recover: '/auth/recover',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES]
