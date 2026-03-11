export interface LoginRequest {
  username: string
  password: string
  warehouseId: number
}

export interface LoginResult {
  userId: number
  username: string
  fullName: string
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  accessToken: string
  authenticated: boolean
}

export interface ApiResponse<T> {
  code: string
  message: string
  result: T
}