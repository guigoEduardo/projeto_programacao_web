import api from './api'

export const toggleFollow = (userId) => api.post(`/users/${userId}/toggle-follow`)
export const getFollowStatus = (userId) => api.get(`/users/${userId}/follow-status`)
export const getFollowers = (userId) => api.get(`/users/${userId}/followers`)
export const getFollowing = (userId) => api.get(`/users/${userId}/following`)
export const getFollowingDestinations = (page = 1, limit = 12) => api.get('/following-destinations', { params: { page, limit } })
