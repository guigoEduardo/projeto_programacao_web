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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
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
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }

      return Promise.reject({
        message: apiError.message || 'Ocorreu um erro na requisição.',
        errors: apiError.errors || [],
        status: error.response.status,
      })
    } else if (error.request) {
      return Promise.reject({
        message: 'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente novamente.',
        errors: [],
        status: null,
      })
    } else {
      return Promise.reject({
        message: 'Erro inesperado ao preparar a requisição.',
        errors: [],
        status: null,
      })
    }
  }
)

export default api