export function useMagnetic(strength = 0.25) {
  const el = ref<HTMLElement | null>(null)
  const transform = ref('translate(0px, 0px)')

  function onMove(e: MouseEvent) {
    if (!el.value) return
    const rect = el.value.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    transform.value = `translate(${x * strength}px, ${y * strength}px)`
  }

  function onLeave() {
    transform.value = 'translate(0px, 0px)'
  }

  return { el, transform, onMove, onLeave }
}
