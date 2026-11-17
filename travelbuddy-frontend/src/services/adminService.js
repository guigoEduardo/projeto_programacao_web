import api from './api'
export const getAdminDashboard=()=>api.get('/admin/dashboard')
export const getAdminReports=(params)=>api.get('/admin/reports',{params})
export const reviewAdminReport=(id)=>api.patch(`/admin/reports/${id}/review`)
export const getAdminUsers=(params)=>api.get('/admin/users',{params})
export const setAdminUserBlocked=(id,isBlocked)=>api.patch(`/admin/users/${id}/block`,{isBlocked})
export const getAdminDestinations=(params)=>api.get('/admin/destinations',{params})
export const deleteAdminDestination=(id)=>api.delete(`/admin/destinations/${id}`)
