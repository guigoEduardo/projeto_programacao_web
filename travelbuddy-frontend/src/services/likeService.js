import api from './api'

export const toggleDestinationLike = (id) => api.post(`/destinations/${id}/toggle-like`)
export const getDestinationLikeStatus = (id) => api.get(`/destinations/${id}/like-status`)
export const getLikedDestinations = () => api.get('/liked-destinations')
