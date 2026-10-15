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

export function getMyDestinations() { return api.get('/my-destinations') }
export function getDestinationForEdit(id) { return api.get(`/destinations/${id}/edit`) }
export function updateDestination(id, formData, onUploadProgress) {
  return api.put(`/destinations/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress })
}
export function deleteDestination(id) { return api.delete(`/destinations/${id}`) }
