import { ref, watch, onUnmounted, unref } from 'vue'
export function useDebouncedValue(source, delay = 400) {
  const value = ref(unref(source)); let timer
  const stop = watch(() => unref(source), next => { clearTimeout(timer); timer = setTimeout(() => { value.value = next }, delay) })
  onUnmounted(() => { clearTimeout(timer); stop() })
  return value
}
