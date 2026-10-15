import { onBeforeUnmount, onMounted } from 'vue'

export function useClickOutside(elementRef, callback) {
  const onPointerDown = (event) => {
    if (elementRef.value && !elementRef.value.contains(event.target)) callback(event)
  }
  const onKeyDown = (event) => {
    if (event.key === 'Escape') callback(event)
  }
  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeyDown)
  })
}
