import api from './api'

export const getDestinationComments = (id) => api.get(`/destinations/${id}/comments`)
export const createDestinationComment = (id, content) => api.post(`/destinations/${id}/comments`, { content })
