export interface ErrorResponse {
  code: string
  error: string
  message: string
  path: string
  timestamp: string
}

/**
 * @param error - Error object from axios
 * @returns ErrorResponse or default error message
 */
export const getErrorMessage = (error: any): string => {
  try {
    const errorData = error?.response?.data as ErrorResponse

    if (errorData?.message) {
      return errorData.message
    }

    if (errorData?.error) {
      return errorData.error
    }

    // Fallback messages
    if (error?.response?.status === 400) {
      return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu.'
    }

    if (error?.response?.status === 401) {
      return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
    }

    if (error?.response?.status === 403) {
      return 'Bạn không có quyền thực hiện hành động này.'
    }

    if (error?.response?.status === 404) {
      return 'Không tìm thấy tài nguyên yêu cầu.'
    }

    if (error?.response?.status === 500) {
      return 'Lỗi máy chủ. Vui lòng thử lại sau.'
    }

    if (error?.message) {
      return error.message
    }

    return 'Đã xảy ra lỗi. Vui lòng thử lại.'
  } catch (e) {
    return 'Đã xảy ra lỗi. Vui lòng thử lại.'
  }
}

/**
 * @param error - Error object from axios
 * @returns Full ErrorResponse object or constructed error
 */
export const getErrorResponse = (error: any): ErrorResponse => {
  const errorData = error?.response?.data as ErrorResponse

  if (errorData) {
    return errorData
  }

  // Construct error response if API didn't return proper format
  return {
    code: error?.response?.status?.toString() || '500',
    error: error?.response?.statusText || 'Internal Server Error',
    message: error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
    path: error?.response?.config?.url || '',
    timestamp: new Date().toISOString()
  }
}
