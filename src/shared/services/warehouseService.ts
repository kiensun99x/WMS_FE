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
  const res = await http.get<unknown>("/warehouses")

  const data = (res as any).data

  if (Array.isArray(data)) {
    return data as WarehouseBrief[]
  }

  if (data && Array.isArray(data.result)) {
    return data.result as WarehouseBrief[]
  }

  console.warn("getWarehouses: unexpected response", data)
  return []
}

export const getCurrentWarehouse = async (): Promise<ApiResponse<WarehouseDetail> | null> => {
  const res = await http.get<ApiResponse<WarehouseDetail>>("/warehouses/me")
  return (res as any).data
}