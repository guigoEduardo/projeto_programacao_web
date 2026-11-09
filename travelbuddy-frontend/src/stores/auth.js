import { defineStore } from 'pinia'
import { login as loginRequest, logout as logoutRequest, getMyProfile } from '../services/authService'
import { STORAGE_KEYS } from '../config/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
    user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
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
      localStorage.setItem(STORAGE_KEYS.TOKEN, this.token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user))
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
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user))
      } catch (err) {
        this.clearSession()
      }
    },

    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    },
  },
})
