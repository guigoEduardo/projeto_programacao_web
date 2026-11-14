import api from './api'
import { PAGINATION } from '../config/constants'
export const getNotifications = (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => api.get('/notifications', { params: { page, limit }, silent: true })
export const getUnreadCount = () => api.get('/notifications/unread-count', { silent: true })
export const markNotificationAsRead = id => api.patch(`/notifications/${id}/read`)
