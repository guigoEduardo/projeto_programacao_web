import api from './api'

export function createDestination(formData, onUploadProgress) {
  return api.post('/destinations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  })
}