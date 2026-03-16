import http from '@/services/http'
import type { ApiResponse } from '@/services/api-response'
import type { Order } from '../type/order/Order'
import type { OrderPageResponse } from '../type/order/OrderPageResponse'

export const fetchFileTemplate = async () => {
  const response = await http.get('/orders/import/template', {
    responseType: 'blob'
  })

  return response.data
}