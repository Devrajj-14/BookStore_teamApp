import axiosClient from './axiosClient'

export const getCart = () => axiosClient.get('/api/cart')
export const addToCart = (productId, quantity) => axiosClient.post('/api/cart/add', { productId, quantity })
export const updateCartItem = (itemId, quantity) => axiosClient.put(`/api/cart/items/${itemId}`, { quantity })
export const removeCartItem = (itemId) => axiosClient.delete(`/api/cart/items/${itemId}`)
export const clearCart = () => axiosClient.delete('/api/cart/clear')
