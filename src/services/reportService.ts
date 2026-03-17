import http from "@/services/http"
import type { AxiosResponse } from "axios"
import type {
  WarehouseOrderStatisticRequest,
  DeliveryPerformanceRequest
} from "../type/report"

/**
 * Export warehouse order statistic report. Returns the raw AxiosResponse so
 * caller can read headers and data blob.
 */
export const exportWarehouseOrderStatistic = async (
  payload: WarehouseOrderStatisticRequest
): Promise<AxiosResponse<Blob>> => {
  return await http.post<Blob>(
    "/reports/warehouse-order-statistic",
    payload,
    { responseType: "blob" }
  )
}

export const exportDeliveryPerformance = async (
  payload: DeliveryPerformanceRequest
): Promise<AxiosResponse<Blob>> => {
  return await http.post<Blob>(
    "/reports/delivery-performance",
    payload,
    { responseType: "blob" }
  )
}
