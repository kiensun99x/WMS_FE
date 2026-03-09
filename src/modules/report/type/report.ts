export type ReportType = "DAY" | "MONTH"

export interface WarehouseOrderStatisticRequest {
  type: ReportType
  startDate?: string
  endDate?: string
  startMonth?: string
  endMonth?: string
  warehouseIds: number[]
}

export interface DeliveryPerformanceRequest {
  type: ReportType
  startDate?: string
  endDate?: string
  startMonth?: string
  endMonth?: string
  warehouseIds: number[]
}
