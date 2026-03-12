import http from '@/services/http'
import type { ApiResponse } from '@/services/api-response'

export interface Order {
  id: number
  code: string
  createdAt: string
  status: 'NEW' | 'STORED' | 'DELIVERED' | 'FAILED' | 'RETURNED'
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

export interface OrderHistoryItem {
  userId: number
  failureReasonId: number | null
  actorType: string
  occurredAt: string
  fromStatus: Order['status']
  toStatus: Order['status']
}

export interface OrderHistoryResponse {
  orderId: number
  histories: OrderHistoryItem[]
}

export const getOrderHistories = (orderId: number) => {
  return http.get<ApiResponse<OrderHistoryResponse>>(
    `/orders/${orderId}/histories`
  )
}



export const getOrderHistoriesSafe = (orderId: number) => {
  return getOrderHistories(orderId)
}

export interface SearchOrderRequest {
  orderCode?: string
  supplierPhone?: string
  receiverPhone?: string
  statusCode?: number
  warehouseCode?: string
}

/**
 * Get single order by ID
 * @param id - Order ID
 */
export const getOrderById = (id: number) => {
  return http.get<ApiResponse<Order>>(`/orders/${id}`)
}

/**
 * Fetch orders from API with pagination
 * @param page - Page number (0-indexed)
 * @param size - Items per page
 * @param filters - Search filters
 * @returns ApiResponse with orders list and pagination info
 */
export const fetchOrders = (filters: SearchOrderRequest, page: number = 0, size: number = 10) => {
  return http.get<ApiResponse<OrderPageResponse>>('/orders/', {
    params: {
      ...filters,
      page,
      size
    }
  })
}

/**
 * Fetch orders from API with pagination
 * @param page - Page number (0-indexed)
 * @param size - Items per page
 * @param filters - Search filters
 * @returns ApiResponse with orders list and pagination info
 */
export const fetchMyWarehouseOrders = (filters: SearchOrderRequest, page: number = 0, size: number = 10) => {
  return http.get<ApiResponse<OrderPageResponse>>('/orders/my-warehouse', {
    params: {
      ...filters,
      page,
      size
    }
  })
}

/**
 * Export labels (nhãn giao hàng) for selected orders
 * @param orderCodes - Array of order codes
 * @returns Promise with blob data (file content)
 */
export const exportLabels = (orderIds: number[]) => {
  return http.post<Blob>(
    '/orders/labels/',
    { orderIds },
    {
      responseType: 'blob',  //blob để parse dữ liệu nhị phân, nếu không axios sẽ cố parse thành JSON và lỗi
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * Dispatch orders to a warehouse
 * @param orderIds - Array of order IDs to dispatch
 * @param warehouseId - Target warehouse ID
 * @returns Api response with dispatch result
 */
export const dispatchOrders = (orderIds: number[], warehouseId: number) => {
  return http.post<ApiResponse<any>>('/batch/dispatch/manual', {
    orderIds,
    warehouseId
  })
}
