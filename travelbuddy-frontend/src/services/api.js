/**
 * Configuração do Axios para lidar com erros em um só lugar.
 * 
 * O interceptor lida com 4 situações:
 * 1. Sucesso: retorna direto os dados, sem precisar usar .data.
 * 2. Erro da API: o servidor respondeu com falha (ex: 404, 500) e a mensagem já vem pronta.
 * 3. Sem resposta: a API está fora do ar ou sem internet.
 * 4. Outros erros: falhas incomuns ao montar a requisição.
 */

import axios from 'axios'
import { STORAGE_KEYS } from '../config/constants'
import { useToast } from '../composables/useToast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const apiError = error.response.data

      if (error.response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        window.location.href = '/login'
      }

      const normalizedError = {
        message: apiError.message || 'Ocorreu um erro na requisição.',
        errors: apiError.errors || [],
        status: error.response.status,
      }
      if (!error.config?.silent) useToast().error(normalizedError.message)
      return Promise.reject(normalizedError)
    } else if (error.request) {
      const normalizedError = {
        message: 'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente novamente.',
        errors: [],
        status: null,
      }
      if (!error.config?.silent) useToast().error(normalizedError.message)
      return Promise.reject(normalizedError)
    } else {
      const normalizedError = {
        message: 'Erro inesperado ao preparar a requisição.',
        errors: [],
        status: null,
      }
      if (!error.config?.silent) useToast().error(normalizedError.message)
      return Promise.reject(normalizedError)
    }
  }
)

export default api
