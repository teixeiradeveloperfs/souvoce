export default defineNuxtPlugin((nuxtApp) => {
  const { openSearch } = useGlobalSearch()

  function onKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      openSearch()
    }
  }

  window.addEventListener('keydown', onKeyDown)

  nuxtApp.hook('app:beforeUnmount', () => {
    window.removeEventListener('keydown', onKeyDown)
  })
})
