import { defineStore } from 'pinia'
import { getUnreadCount as fetchUnreadCount } from '../services/notificationService'
import { NOTIFICATIONS } from '../config/constants'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({ unreadCount: 0, lastRefreshId: 0, timerId: null, visibilityHandler: null }),
  actions: {
    async refresh() {
      const requestId = ++this.lastRefreshId
      try {
        const response = await fetchUnreadCount()
        if (requestId === this.lastRefreshId) this.unreadCount = response.data.unreadCount
      } catch {}
    },
    setUnreadCount(count) { this.lastRefreshId += 1; this.unreadCount = count },
    refreshIfVisible() { if (document.visibilityState === 'visible') this.refresh() },
    startPolling() {
      if (this.timerId !== null) return
      this.refresh()
      this.timerId = window.setInterval(() => this.refreshIfVisible(), NOTIFICATIONS.POLL_MS)
      this.visibilityHandler = () => this.refreshIfVisible()
      document.addEventListener('visibilitychange', this.visibilityHandler)
    },
    stopPolling() {
      if (this.timerId !== null) window.clearInterval(this.timerId)
      this.timerId = null
      if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler)
      this.visibilityHandler = null
      this.setUnreadCount(0)
    },
  },
})
