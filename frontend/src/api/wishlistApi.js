import axiosClient from './axiosClient'

export const getWishlist = () => axiosClient.get('/api/wishlist')
export const addToWishlist = (productId) => axiosClient.post(`/api/wishlist/add/${productId}`)
export const removeFromWishlist = (productId) => axiosClient.delete(`/api/wishlist/remove/${productId}`)
export const checkInWishlist = (productId) => axiosClient.get(`/api/wishlist/check/${productId}`)
