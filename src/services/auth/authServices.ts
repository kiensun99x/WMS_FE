import axios from "@/services/http"
import type { LoginRequest, ApiResponse, LoginResult } from "../../type/auth"


export const login = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResult>> => {
  const response = await axios.post<ApiResponse<LoginResult>>("auth/login", data)
  return response.data
}