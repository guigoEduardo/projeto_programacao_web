import api from './api'

export function register(payload) {
  return api.post('/register', payload, { silent: true })
}

export function login(payload) {
  return api.post('/login', payload, { silent: true })
}

export function logout() {
  return api.post('/logout')
}

export function getMyProfile() {
  return api.get('/profile/me', { silent: true })
}

export function getPublicProfile(username, signal) {
  return api.get(`/profile/${encodeURIComponent(username)}`, { silent: true, signal })
}

export function updateProfile(formData) {
  return api.put('/profile/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    silent: true,
  })
}
