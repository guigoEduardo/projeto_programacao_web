import api from './api'
export const getMyCollections = signal => api.get('/my-collections', { silent: true, signal })
export const createCollection = data => api.post('/collections', data, { silent: true })
export const deleteCollection = id => api.delete(`/collections/${id}`)
export const getCollection = (id, signal) => api.get(`/collections/${id}`, { silent: true, signal })
export const getDestinationCollectionsStatus = (destinationId, signal) => api.get(`/destinations/${destinationId}/collections-status`, { silent: true, signal })
export const addDestinationToCollection = (collectionId, destinationId) => api.post(`/collections/${collectionId}/destinations`, { destinationId })
export const removeDestinationFromCollection = (collectionId, destinationId) => api.delete(`/collections/${collectionId}/destinations/${destinationId}`)
