import axiosClient from './axiosClient'

export const getCustomerDetails = () => axiosClient.get('/api/customers/details')
export const updateCustomerDetails = (data) => axiosClient.put('/api/customers/details', data)
export const addAddress = (data) => axiosClient.post('/api/customers/addresses', data)
export const updateAddress = (id, data) => axiosClient.put(`/api/customers/addresses/${id}`, data)
export const deleteAddress = (id) => axiosClient.delete(`/api/customers/addresses/${id}`)
export const setDefaultAddress = (id) => axiosClient.put(`/api/customers/addresses/${id}/default`)
