import api from './api'
import { PAGINATION } from '../config/constants'

export function createDestination(formData, onUploadProgress) {
  return api.post('/destinations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    silent: true,
    onUploadProgress
  })
}

export function getDestinationById(id, signal) {
  return api.get(`/destinations/${id}`, { silent: true, signal })
}

export function getFeed(page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) {
  return api.get('/feed', { params: { page, limit }, silent: true })
}

export function getMyDestinations(signal) { return api.get('/my-destinations', { silent: true, signal }) }
export function getDestinationForEdit(id) { return api.get(`/destinations/${id}/edit`, { silent: true }) }
export function updateDestination(id, formData, onUploadProgress) {
  return api.put(`/destinations/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress, silent: true })
}
export function deleteDestination(id) { return api.delete(`/destinations/${id}`) }
