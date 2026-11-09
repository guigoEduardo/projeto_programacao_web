import { ref } from 'vue'
import { PAGINATION } from '../config/constants'

export function usePaginatedList(fetchPage, { limit = PAGINATION.DEFAULT_LIMIT, unique = false } = {}) {
  const items = ref([])
  const page = ref(PAGINATION.DEFAULT_PAGE)
  const hasMore = ref(true)
  const loading = ref(false)
  const errorMessage = ref('')

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await fetchPage(page.value, limit)
      const batch = response?.data ?? response ?? []
      if (unique) {
        const known = new Set(items.value.map(item => item.id))
        items.value.push(...batch.filter(item => !known.has(item.id)))
      } else items.value.push(...batch)
      hasMore.value = batch.length === limit
      page.value += 1
    } catch (error) {
      errorMessage.value = error.message || 'Não foi possível carregar os itens.'
    } finally {
      loading.value = false
    }
  }

  async function reload() {
    items.value = []
    page.value = PAGINATION.DEFAULT_PAGE
    hasMore.value = true
    await loadMore()
  }

  return { items, page, hasMore, loading, errorMessage, loadMore, reload }
}
