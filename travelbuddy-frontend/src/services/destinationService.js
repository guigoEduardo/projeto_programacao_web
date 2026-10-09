import api from './api'

export function createDestination(formData, onUploadProgress) {
  return api.post('/destinations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  })
}

export function getDestinationById(id) {
  return api.get(`/destinations/${id}`)
}

export function getFeed(page = 1, limit = 12) {
  return api.get('/feed', { params: { page, limit } })
}