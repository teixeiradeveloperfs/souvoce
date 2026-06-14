const STORAGE_KEY = 'veil-sidebar-collapsed'

export function useSidebar() {
  const collapsed = useState('sidebar-collapsed', () => {
    if (import.meta.client) {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    }
    return false
  })

  function toggle() {
    collapsed.value = !collapsed.value
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, String(collapsed.value))
    }
  }

  return { collapsed, toggle }
}
