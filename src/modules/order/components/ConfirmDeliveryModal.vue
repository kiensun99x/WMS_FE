<template>
  <div
  v-if="isOpen"
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
      
      <!-- Header -->
      <div class="flex items-center gap-3 p-6 border-b border-gray-200">
        <div class="bg-blue-100 text-blue-600 p-2 rounded-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Xác nhận giao hàng</h2>
        <button @click="handleClose" class="ml-auto text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-6 space-y-6">
        
        <!-- Confirmation Time -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thời gian xác nhận</label>
          <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-gray-700">{{ currentDateTime }}</span>
          </div>
        </div>

        <!-- Delivery Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Trạng thái giao hàng</label>
          <div class="space-y-3">
            <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer" 
              :class="selectedSuccess === true ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'">
              <input
                type="radio"
                :checked="selectedSuccess === true"
                @change="selectedSuccess = true"
                class="w-4 h-4 text-green-600 cursor-pointer"
              />
              <span class="font-medium text-gray-900">Giao hàng thành công</span>
            </label>
            <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer"
              :class="selectedSuccess === false ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'">
              <input
                type="radio"
                :checked="selectedSuccess === false"
                @change="selectedSuccess = false"
                class="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span class="font-medium text-gray-900">Giao hàng thất bại</span>
            </label>
          </div>
        </div>

        <!-- Failure Reason (only show when failed is selected) -->
        <div v-if="selectedSuccess === false">
          <label class="block text-sm font-medium text-gray-700 mb-2">Lý do thất bại <span class="text-red-500">*</span></label>
          <select
            v-model="selectedFailureReasonId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="loadingFailureReasons"
          >
            <option :value="null">Chọn lý do thất bại</option>
            <option v-for="reason in failureReasons" :key="reason.reasonId" :value="reason.reasonId">
              {{ reason.description }}
            </option>
          </select>
          <p v-if="failureReasonError" class="mt-2 text-sm text-red-600">{{ failureReasonError }}</p>
        </div>

      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-gray-200 justify-end">
        <button
          @click="handleClose"
          :disabled="loading"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy bỏ
        </button>
        <button
          @click="handleConfirm"
          :disabled="loading || !canConfirm"
          class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Đang xử lý...' : 'Xác nhận' }}</span>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="px-6 pb-6">
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { confirmDelivery, getFailureReasons } from '../services/orderService'
import type { FailureReason } from '../type/failure-reason'

interface Props {
  isOpen: boolean
  orderId?: number
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
  (e: 'error', message: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedSuccess = ref<boolean>(true)
const selectedFailureReasonId = ref<number | null>(null)
const failureReasons = ref<FailureReason[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const loadingFailureReasons = ref(false)
const failureReasonError = ref<string | null>(null)

const currentDateTime = computed(() => {
  return new Date().toLocaleString('vi-VN')
})

const canConfirm = computed(() => {
  if (selectedSuccess.value === true) {
    return true
  }
  return selectedFailureReasonId.value !== null
})

// Fetch failure reasons when modal opens and status is set to failed
watch(() => props.isOpen, (newVal) => {
  if (newVal && selectedSuccess.value === false) {
    fetchFailureReasons()
  }
})

watch(() => selectedSuccess.value, (newSuccess) => {
  if (newSuccess === false && failureReasons.value.length === 0) {
    fetchFailureReasons()
  }
})

const getErrorMessage = (err: any): string => {
  console.error('Error object:', err)
  
  // Case 1: Error object từ axios với response.data (traditional axios error)
  if (err?.response?.data) {
    const message = err.response.data.message
    const errorField = err.response.data.error
    const code = err.response.data.code
    
    console.log('Case 1 - Error response data found')
    if (message) {
      console.log('Got message from err.response.data:', message)
      return message
    }
    if (errorField) {
      console.log('Got error field:', errorField)
      return errorField
    }
    if (code) {
      return `Lỗi: ${code}`
    }
  }
  
  // Case 2: Error data trực tiếp (backend trả về data object trong Promise.reject)
  // Theo http.ts, interceptor trả về error.response?.data hoặc error
  if (err?.message) {
    console.log('Case 2 - Direct message field found')
    return err.message
  }
  
  if (err?.error) {
    console.log('Case 2 - Direct error field found')
    return err.error
  }
  
  if (err?.code) {
    console.log('Case 2 - Direct code field found')
    return `Lỗi: ${err.code}`
  }
  
  // Case 3: Axios error message
  if (err?.message && typeof err.message === 'string') {
    console.log('Case 3 - Axios error message')
    return err.message
  }
  
  // Fallback cuối cùng
  console.log('No error message found, returning fallback')
  return 'Đã xảy ra lỗi khi xác nhận giao hàng'
}

const fetchFailureReasons = async () => {
  loadingFailureReasons.value = true
  failureReasonError.value = null
  try {
    const response = await getFailureReasons()
    if (response.data.result) {
      failureReasons.value = response.data.result
    }
  } catch (err) {
    failureReasonError.value = getErrorMessage(err) || 'Không thể tải danh sách lý do thất bại'
    console.error('Error fetching failure reasons:', err)
  } finally {
    loadingFailureReasons.value = false
  }
}

const handleConfirm = async () => {
  if (!props.orderId) {
    error.value = 'Không tìm thấy ID đơn hàng'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const payload = {
      success: selectedSuccess.value,
      ...(selectedSuccess.value === false && selectedFailureReasonId.value && {
        failureReasonId: selectedFailureReasonId.value
      })
    }
    
    console.log('Sending payload:', payload)
    const response = await confirmDelivery(props.orderId, payload)
    
    // Check if response is successful (no error on status code)
    if (response.status === 200 || response.status === 201) {
      console.log('Delivery confirmed successfully')
      emit('success')
      handleClose()
    } else {
      console.warn('Unexpected response status:', response.status)
      error.value = 'Xác nhận giao hàng thất bại'
    }
  } catch (err: any) {
    console.error('Error confirming delivery caught:', err)
    const errorMsg = getErrorMessage(err)
    error.value = errorMsg
    console.log('Set error to:', error.value)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  error.value = null
  failureReasonError.value = null
  selectedSuccess.value = true
  selectedFailureReasonId.value = null
  emit('close')
}

</script>

<style scoped>
</style>
