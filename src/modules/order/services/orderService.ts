import http from '@/services/http'
import type { ApiResponse } from '@/services/api-response'
import type { Order } from '../type/order/Order'
import type { OrderPageResponse } from '../type/order/OrderPageResponse'
import type { OrderHistoryResponse } from '../type/history/OrderHistoryResponse'

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

export interface CreateOrderRequest {
  supplierName: string
  supplierAddress: string
  supplierPhone: string
  supplierEmail: string
  receiverName: string
  receiverAddress: string
  receiverPhone: string
  receiverEmail: string
  receiverLat: number
  receiverLon: number
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

/**
 * Create a new order
 * @param orderData - Order creation data
 * @returns ApiResponse with created order details
 */
export const createOrder = (orderData: CreateOrderRequest) => {
  return http.post<ApiResponse<Order>>('/orders/', orderData)
}
