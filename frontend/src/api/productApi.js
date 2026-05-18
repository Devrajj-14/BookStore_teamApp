import axiosClient from './axiosClient'

export const getProducts = (params) => axiosClient.get('/api/products', { params })
export const getProductById = (id) => axiosClient.get(`/api/products/${id}`)
export const getCategories = () => axiosClient.get('/api/products/categories')
