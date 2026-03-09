import { reactive } from "vue"
import { login } from "../services/authServices"
import type { LoginRequest, LoginResult, ApiResponse } from "../type/auth"

export const authStore = reactive({
  accessToken: localStorage.getItem("accessToken") || "",

  
  async login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResult>> {
    const res = await login(data)
    const token = res.result.accessToken
    this.accessToken = token
    localStorage.setItem("accessToken", token)
    return res
  },

  logout() {
    this.accessToken = ""
    localStorage.removeItem("accessToken")
  }
})