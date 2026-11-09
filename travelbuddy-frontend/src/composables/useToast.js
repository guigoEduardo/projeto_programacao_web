import { readonly, ref } from 'vue'
import { TOAST } from '../config/constants'

const items = ref([])
let nextId = 0

function dismiss(id) {
  const toast = items.value.find(item => item.id === id)
  if (toast) window.clearTimeout(toast.timer)
  items.value = items.value.filter(item => item.id !== id)
}

function show(message, type = 'success', duration) {
  const id = ++nextId
  const timeout = duration ?? (type === 'error' ? TOAST.ERROR_MS : TOAST.SUCCESS_MS)
  const timer = window.setTimeout(() => dismiss(id), timeout)
  items.value = [...items.value, { id, message, type, timer }].slice(-TOAST.MAX_VISIBLE)
  return id
}

export function useToast() {
  return { toasts: readonly(items), success: message => show(message, 'success'), error: message => show(message, 'error'), dismiss }
}
