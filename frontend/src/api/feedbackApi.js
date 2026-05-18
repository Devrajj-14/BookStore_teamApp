import axiosClient from './axiosClient'

// Public
export const getProductFeedback = (productId) =>
  axiosClient.get(`/api/feedback/product/${productId}`)

export const getRatingSummary = (productId) =>
  axiosClient.get(`/api/feedback/product/${productId}/summary`)

// User
export const submitFeedback = (data) => axiosClient.post('/api/feedback', data)
export const updateFeedback = (id, data) => axiosClient.put(`/api/feedback/${id}`, data)
export const deleteFeedback = (id) => axiosClient.delete(`/api/feedback/${id}`)
export const getMyFeedback = () => axiosClient.get('/api/feedback/my')
