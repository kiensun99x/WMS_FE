<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">

    <!-- ERROR / LOADING -->
    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="loading" class="text-gray-500">
      Đang tải dữ liệu...
    </div>

    <div v-else>
      <!-- 3 CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <!-- ORDER INFO -->
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-blue-100 text-blue-600 p-2 rounded-full">
              <!-- icon placeholder -->
            </div>
            <h3 class="font-semibold text-lg text-gray-800">Thông tin đơn hàng</h3>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-gray-500">Mã đơn</div>
            <div class="font-medium text-gray-900">{{ order?.code || '-' }}</div>
            <div class="text-gray-500">Trạng thái</div>
            <div class="font-medium text-gray-900">
              <span :class="getStatusClass(order?.status || '')">
                {{ statusLabel || '-' }}
              </span>
            </div>
            <div class="text-gray-500">Tên kho</div>
            <div class="font-medium text-gray-900">{{ order?.warehouseName || '-' }}</div>
            <div class="text-gray-500">Ngày lưu</div>
            <div class="font-medium text-gray-900">{{ formatDate(order?.createdAt || '') }}</div>
          </div>
        </div>

        <!-- SUPPLIER -->
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-green-100 text-green-600 p-2 rounded-full">
              <!-- icon placeholder -->
            </div>
            <h3 class="font-semibold text-lg text-gray-800">Thông tin NCC</h3>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-gray-500">Tên NCC</div>
            <div class="font-medium text-gray-900">{{ order?.supplierName }}</div>
            <div class="text-gray-500">Địa chỉ</div>
            <div class="text-gray-900">{{ order?.supplierAddress }}</div>
            <div class="text-gray-500">SĐT</div>
            <div class="text-gray-900">{{ order?.supplierPhone }}</div>
            <div class="text-gray-500">Email</div>
            <div class="text-blue-500 truncate">{{ order?.supplierEmail }}</div>
          </div>
        </div>

        <!-- RECEIVER -->
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-yellow-100 text-yellow-600 p-2 rounded-full">
              <!-- icon placeholder -->
            </div>
            <h3 class="font-semibold text-lg text-gray-800">Thông tin nhận hàng</h3>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div class="text-gray-500">Người nhận</div>
            <div class="font-medium text-gray-900">{{ order?.receiverName }}</div>
            <div class="text-gray-500">Địa chỉ</div>
            <div class="text-gray-900">{{ order?.receiverAddress }}</div>
            <div class="text-gray-500">SĐT</div>
            <div class="text-gray-900">{{ order?.receiverPhone }}</div>
            <div class="text-gray-500">Email</div>
            <div class="text-blue-500 truncate">{{ order?.receiverEmail }}</div>
          </div>
        </div>

      </div>


      <!-- HISTORY -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 mt-6">

        <div class="p-5 border-b border-gray-200">
          <h3 class="text-lg font-semibold">
            Lịch sử đơn hàng
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm table-auto border-collapse">

          <thead class="bg-gray-50 text-gray-600">
            <tr>
              <th class="text-left p-4">Thời gian</th>
              <th class="text-left p-4">Trạng thái</th>
              <th class="text-left p-4">Người thực hiện</th>
              <th class="text-left p-4">Ghi chú / Lý do</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">

            <tr
              v-for="hist in histories"
              :key="hist.occurredAt + hist.actorType"
              class="border-t hover:bg-gray-50 transition"
            >

              <td class="p-4">
                {{ formatDate(hist.occurredAt) }}
              </td>

              <td class="p-4">
                <span :class="getStatusClass(hist.toStatus) || 'px-3 py-1 rounded-full text-xs bg-gray-100'">
                  {{ statusCodeToLabel(hist.toStatus) }}
                </span>
              </td>

              <td class="p-4">
                {{ hist.actorType }}
              </td>

              <td class="p-4 text-gray-600">
                {{ hist.failureReasonId || '-' }}
              </td>

            </tr>

            <tr v-if="histories.length === 0">
              <td colspan="4" class="text-center p-6 text-gray-400">
                Không có lịch sử
              </td>
            </tr>

          </tbody>

        </table>
      </div>

    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  getOrderById,
  getOrderHistories,
} from '../services/orderService'
import { type OrderHistoryItem } from '../type/history/OrderHistoryItem'
import { type Order } from '../type/order/Order'

// lấy id từ route params (router đã khai báo props:true)
const route = useRoute()
const idParam = route.params.id as string
const orderId = parseInt(idParam, 10)

// state
const order = ref<Order | null>(null)
const histories = ref<OrderHistoryItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// helper: định dạng ngày giờ
const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

// helper: convert status code string tới nhãn người dùng
const statusCodeToLabel = (status: Order['status'] | null | undefined) => {
  switch (status) {
    case 'NEW':
      return 'Mới'
    case 'STORED':
      return 'Lưu kho'
    case 'DELIVERED':
      return 'Đã giao'
    case 'FAILED':
      return 'Giao thất bại'
    case 'RETURNED':
      return 'Hoàn hàng'
    default:
      return status || '-'
  }
}

// Derived label for the current order
const statusLabel = computed(() => statusCodeToLabel(order.value?.status))

// badge classes copied from OrderTable
const getStatusClass = (status: string | null | undefined) => {
  switch (status) {
    case 'NEW':
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'
    case 'STORED':
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800'
    case 'DELIVERED':
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'
    case 'FAILED':
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'
    case 'RETURNED':
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800'
    default:
      return ''
  }
}

// load data
const loadDetail = async () => {
  loading.value = true
  error.value = null

  // get main order data first
  try {
    const orderResp = await getOrderById(orderId)
    const ordData = orderResp.data.result
    if (ordData) {
      order.value = ordData
    }
  } catch (err: any) {
    console.error('order fetch error', err)
    error.value = err.message || 'Không thể tải thông tin đơn hàng'
    loading.value = false
    return
  }

  // fetch histories normally; any failure will set the main error
  try {
    const histResp = await getOrderHistories(orderId)
    const histData = histResp.data.result
    if (histData) {
      histories.value = histData.histories || []
    }
  } catch (err: any) {
    console.error('history fetch error', err)
    error.value = err.message || 'Không thể tải lịch sử đơn hàng'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isNaN(orderId)) {
    loadDetail()
  } else {
    error.value = 'ID đơn hàng không hợp lệ'
  }
})
</script>
