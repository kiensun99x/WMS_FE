import http from "@/services/http"
import type { ApiResponse } from "../type/auth"

export interface Warehouse {
  id: number
  code: string
  name: string
}

export const getWarehouses = async (): Promise<Warehouse[]> => {
  const res = await http.get<unknown>("/warehouses")

  const data = (res as any).data

  if (Array.isArray(data)) {
    return data as Warehouse[]
  }

  if (data && Array.isArray(data.result)) {
    return data.result as Warehouse[]
  }

  console.warn("getWarehouses: unexpected response", data)
  return []
}