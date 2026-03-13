import http from "@/services/http"
import type { ApiResponse } from "../../modules/auth/type/auth"

export interface WarehouseBrief {
  id: number
  code: string
  name: string
}

export interface WarehouseDetail extends WarehouseBrief {
  capacity: number
  availableSlots: number
}

export const getWarehouses = async (): Promise<WarehouseBrief[]> => {
  const res = await http.get<WarehouseBrief[]>("/warehouses")

  const data = res.data

  if (data && Array.isArray(data)) {
    return data
  }

  console.warn("getWarehouses: unexpected response", data)
  return []
}

export const getCurrentWarehouse = async (): Promise<ApiResponse<WarehouseDetail> | null> => {
  const res = await http.get<ApiResponse<WarehouseDetail>>("/warehouses/me")
  return res.data ?? null
}