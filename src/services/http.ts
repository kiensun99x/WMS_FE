import axios from 'axios'
import type { AxiosInstance } from 'axios'
// import { tokenStorage } from '@/utils/token'

const baseURL = import.meta.env.VITE_API_URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * REQUEST INTERCEPTOR
 */
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = tokenStorage.get()

//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )

// /**
//  * RESPONSE INTERCEPTOR
//  */
// axiosInstance.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response?.status === 401) {
//       tokenStorage.clear()
//       window.location.href = '/login'
//     }

//     return Promise.reject(error.response?.data || error)
//   }
// )

export default axiosInstance