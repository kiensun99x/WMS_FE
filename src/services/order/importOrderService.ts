import http from '@/services/http'

export interface ImportOrdersResponse {
  errorFileId: number
  totalErrorRows: number
  totalValidRows: number
}

export const fetchFileTemplate = async () => {
  const response = await http.get('/orders/import/template', {
    responseType: 'blob'
  })

  return response.data
}

export const fetchImportOrders = (file: File) => {
  const formData = new FormData()

  formData.append('file', file)

  return http.post('/orders/import/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const fetchErrorFile = async (id: number) => {
  const response = await http.get(`/orders/import/error-file/${id}`, {
    responseType: 'blob'
  })

  return response.data
}