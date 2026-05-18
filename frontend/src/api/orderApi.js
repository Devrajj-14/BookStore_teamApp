import axiosClient from './axiosClient'

// User endpoints
export const placeOrder = (data) => axiosClient.post('/api/orders', data)
export const getMyOrders = () => axiosClient.get('/api/orders/my')
export const getOrderById = (id) => axiosClient.get(`/api/orders/my/${id}`)

// Admin endpoints
export const getAllOrders = () => axiosClient.get('/api/orders/admin')
export const updateOrderStatus = (id, status) =>
  axiosClient.put(`/api/orders/admin/${id}/status`, { status })
