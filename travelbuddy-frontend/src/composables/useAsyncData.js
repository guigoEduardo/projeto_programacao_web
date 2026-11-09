import { ref } from 'vue'

export function useAsyncData(loader, { immediate = true, initialValue = null, errorFallback = 'Não foi possível carregar os dados.' } = {}) {
  const data = ref(initialValue)
  const loading = ref(false)
  const errorMessage = ref('')
  let requestId = 0
  let controller = null

  async function execute(...args) {
    const currentRequest = ++requestId
    controller?.abort()
    const requestController = new AbortController()
    controller = requestController
    loading.value = true
    errorMessage.value = ''
    try {
      const result = await loader(...args, requestController.signal)
      if (currentRequest === requestId && !requestController.signal.aborted) data.value = result?.data ?? result
      return result
    } catch (error) {
      if (currentRequest === requestId && !requestController.signal.aborted) errorMessage.value = error.message || errorFallback
      throw error
    } finally {
      if (currentRequest === requestId) {
        loading.value = false
        controller = null
      }
    }
  }

  if (immediate) execute().catch(() => {})
  return { data, loading, errorMessage, execute }
}
