import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useToast } from './useToast'

export function useAuthenticatedAction() {
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  const isBusy = ref(false)

  async function run(action, { login, successMessage } = {}) {
    if (!isAuthenticated.value) {
      if (login) await login()
      return false
    }
    if (isBusy.value) return false
    isBusy.value = true
    try {
      const result = await action()
      if (successMessage) toast.success(successMessage)
      return result ?? true
    } catch (error) {
      // Axios já apresenta erros normalizados no interceptor; só avisamos aqui
      // exceções locais que não passaram pela camada HTTP.
      if (!Array.isArray(error?.errors)) toast.error(error.message || 'Não foi possível concluir a ação.')
      return false
    } finally {
      isBusy.value = false
    }
  }

  return { isBusy, run }
}
