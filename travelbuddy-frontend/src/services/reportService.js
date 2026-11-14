import api from './api'
export const reportDestination = (destinationId, reason) => api.post(`/destinations/${destinationId}/report`, { reason }, { silent: true })
