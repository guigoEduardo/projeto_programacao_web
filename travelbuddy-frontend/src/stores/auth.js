import { defineStore } from 'pinia'
import { login as loginRequest, logout as logoutRequest, getMyProfile } from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => !!state.user?.isAdmin,
  },

  actions: {
    async login(email, password) {
      const response = await loginRequest({ email, password })
      this.token = response.data.token
      this.user = response.data.user
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async logout() {
      try {
        await logoutRequest()
      } finally {
        this.clearSession()
      }
    },

    async checkAuth() {
      if (!this.token) return
      try {
        const response = await getMyProfile()
        this.user = { ...this.user, ...response.data }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        this.clearSession()
      }
    },

    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
