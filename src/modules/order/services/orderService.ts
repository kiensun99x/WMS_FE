import http from '@/services/http'
import type { ApiResponse } from '@/services/api-response'

export interface Order {
  id: number
  code: string
  createdAt: string
  status: 'NEW' | 'PENDING' | 'SUCCESS' | 'FAILED'
  statusCode: number
  failedDeliveryCount: number
  supplierName: string
  supplierPhone: string
  supplierEmail: string
  supplierAddress: string
  receiverName: string
  receiverPhone: string
  receiverEmail: string
  receiverAddress: string
  warehouseId: number | null
  warehouseCode: string | null
  warehouseName: string | null
}

export interface OrderPageResponse {
  content: Order[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

/**
 * Fetch orders from API with pagination
 * @param page - Page number (0-indexed)
 * @param size - Items per page
 * @returns ApiResponse with orders list and pagination info
 */
export const fetchOrders = (page: number = 0, size: number = 10) => {
  return http.get<ApiResponse<OrderPageResponse>>('/orders/', {
    params: {
      page,
      size
    }
  })
}

/**
 * Get single order by ID
 * @param id - Order ID
 */
export const getOrderById = (id: number) => {
  return http.get<ApiResponse<Order>>(`/orders/${id}`)
}

/**
 * Search orders with filters
 * @param filters - Search filters
 */
export const searchOrders = (filters: {
  code?: string
  status?: string
  supplierPhone?: string
  receiverPhone?: string
}, page: number = 0, size: number = 10) => {
  return http.get<ApiResponse<OrderPageResponse>>('/orders/search', {
    params: {
      ...filters,
      page,
      size
    }
  })
}
