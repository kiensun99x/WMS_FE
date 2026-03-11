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

    if (token) {
      // if the stored JWT is already past its exp claim, bail out early
      const parts = token.split('.')
      if (parts.length === 3 && parts[1]) {
        try {
          const payload = JSON.parse(window.atob(parts[1])) as { exp?: number }
          if (payload.exp && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem("accessToken")
            window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
            window.location.href = "/login"
            // abort the request by throwing; axios will treat it as an error
            throw new Error("token expired")
          }
        } catch (e) {
          // silently ignore malformed token
        }
      }

      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
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
    const status = error.response?.status
    const msg: string = error.response?.data?.message || ""

    const authFault =
      status === 401 ||
      status === 403 ||
      /expir/i.test(msg) ||
      /token/i.test(msg)

    if (authFault) {
      localStorage.removeItem("accessToken")
      try {
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