import api from './api'
import { PAGINATION } from '../config/constants'

export const toggleFollow = (userId) => api.post(`/users/${userId}/toggle-follow`)
export const getFollowStatus = (userId) => api.get(`/users/${userId}/follow-status`, { silent: true })
export const getFollowers = (userId, signal) => api.get(`/users/${userId}/followers`, { silent: true, signal })
export const getFollowing = (userId, signal) => api.get(`/users/${userId}/following`, { silent: true, signal })
export const getFollowingDestinations = (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => api.get('/following-destinations', { params: { page, limit }, silent: true })
