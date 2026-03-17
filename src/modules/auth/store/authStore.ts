import { reactive } from "vue"
import { login } from "../services/authServices"
import type { LoginRequest, LoginResult, ApiResponse } from "../type/auth"

export const authStore = reactive({
  accessToken: localStorage.getItem("accessToken") || "",
  username: localStorage.getItem("username") || "",
  fullName: localStorage.getItem("fullName") || "",
  // warehouseId: localStorage.getItem("warehouseId") ? parseInt(localStorage.getItem("warehouseId") as string) : null,
  warehouseCode: localStorage.getItem("warehouseCode") || null,
  warehouseName: localStorage.getItem("warehouseName") || null,

  
  async login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResult>> {
    const res = await login(data)
    const token = res.result.accessToken
    this.accessToken = token
    this.username = res.result.username
    this.fullName = res.result.fullName
    // this.warehouseId = res.result.warehouseId
    this.warehouseCode = res.result.warehouseCode
    this.warehouseName = res.result.warehouseName
    localStorage.setItem("accessToken", token)
    localStorage.setItem("username", res.result.username)
    localStorage.setItem("fullName", res.result.fullName)
    // localStorage.setItem("warehouseId", res.result.warehouseId.toString())
    localStorage.setItem("warehouseCode", res.result.warehouseCode)
    localStorage.setItem("warehouseName", res.result.warehouseName)
    return res
  },

  logout() {
    this.accessToken = ""
    this.username = ""
    this.fullName = ""
    // this.warehouseId = null
    this.warehouseCode = null
    this.warehouseName = null
    localStorage.removeItem("accessToken")
    localStorage.removeItem("username")
    localStorage.removeItem("fullName")
    // localStorage.removeItem("warehouseId")
    localStorage.removeItem("warehouseCode")
    localStorage.removeItem("warehouseName")
  }
})