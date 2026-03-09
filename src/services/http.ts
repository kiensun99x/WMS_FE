import axios from "axios"
import type { AxiosInstance, AxiosResponse } from "axios"

const baseURL = import.meta.env.VITE_API_URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
})

/**
 * REQUEST INTERCEPTOR
 */
axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("accessToken")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * RESPONSE INTERCEPTOR
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // leave the full AxiosResponse in place so callers can access
    // `response.data` normally.  This avoids type mismatches and makes
    // the behaviour predictable.
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // token expired or unauthorized; clear and notify user
      localStorage.removeItem("accessToken")
      try {
        // standard alert is simple and guaranteed to block until user
        // acknowledges, then we navigate back to login.
        window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
      } catch (e) {
        /* ignore if alert not available */
      }
      window.location.href = "/login"
    }

    return Promise.reject(error.response?.data || error)
  }
)

export default axiosInstance