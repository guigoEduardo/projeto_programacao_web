const API_BASE = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')

export function getProfilePictureUrl(filename) {
  if (!filename) return `${API_BASE}/uploads/profiles/default-profile.png`
  return `${API_BASE}/uploads/profiles/${filename}`
}

export function getLocalPreviewUrl(file) {
  return URL.createObjectURL(file)
}