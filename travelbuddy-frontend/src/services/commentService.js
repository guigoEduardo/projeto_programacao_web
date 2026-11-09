import api from './api'

export const getDestinationComments = (id, signal) => api.get(`/destinations/${id}/comments`, { silent: true, signal })
export const createDestinationComment = (id, content) => api.post(`/destinations/${id}/comments`, { content })
