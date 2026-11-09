import api from './api'

export const toggleDestinationLike = (id) => api.post(`/destinations/${id}/toggle-like`)
export const getDestinationLikeStatus = (id) => api.get(`/destinations/${id}/like-status`, { silent: true })
export const getLikedDestinations = (signal) => api.get('/liked-destinations', { silent: true, signal })
