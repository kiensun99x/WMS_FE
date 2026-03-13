<template>
  <div class="bg-gray-50 min-h-screen py-8">
  <div class="max-w-[1180px] mx-auto space-y-6">
    
    <!-- Card -->
    <div class="bg-white rounded-xl shadow border border-[#F0F3F4] p-6">

      <!-- Tabs -->
      <div class="flex gap-8 border-b mb-6">
        <button
          class="pb-3 text-sm font-semibold border-b-2 transition"
          :class="currentTab === 'order'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500'"
          @click="currentTab = 'order'"
        >
          Tổng số lượng đơn hàng (Report01)
        </button>

        <button
          class="pb-3 text-sm font-semibold border-b-2 transition"
          :class="currentTab === 'delivery'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500'"
          @click="currentTab = 'delivery'"
        >
          Hiệu suất giao hàng (Report02)
        </button>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12">

        <!-- LEFT -->
        <div class="md:pr-6">

          <div class="flex justify-between mb-2">
            <div class="font-semibold text-gray-700">
              1. Chọn kho hàng (Tối đa 10)
            </div>

            <div class="text-sm text-gray-500">
              Đã chọn: {{ selectedIds.length }}/10
            </div>
          </div>

          <div
            class="border border-[#DCE3E6] rounded-lg p-4 max-h-[320px] overflow-y-auto space-y-3 bg-[#F9FAFB]"
          >
            <label
              v-for="w in warehouses"
              :key="w.id"
              class="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded"
            >
              <input
                type="checkbox"
                :value="w.id"
                v-model="selectedIds"
                :disabled="!selectedIds.includes(w.id) && selectedIds.length >= 10"
                class="appearance-none w-4 h-4 rounded-full border border-gray-400 transition checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
              />

              <span>
                {{ w.code }} - {{ w.name }}
              </span>
            </label>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="space-y-6">

          <!-- Report type -->
          <div>
            <div class="font-semibold mb-3 text-gray-700">
              2. Kiểu báo cáo
            </div>

            <div class="flex gap-6">

              <label class="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  value="DAY"
                  v-model="reportType"
                  class="appearance-none h-4 w-4 border border-gray-400 rounded-full checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                />
                <span>Theo ngày (Max 15 ngày)</span>
              </label>

              <label class="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  value="MONTH"
                  v-model="reportType"
                  class="appearance-none h-4 w-4 border border-gray-400 rounded-full checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                />
                <span>Theo tháng (Max 12 tháng)</span>
              </label>

            </div>
          </div>

          <!-- Time range -->
          <div>
            <div class="font-semibold mb-3 text-gray-700">
              3. Khoảng thời gian
            </div>

            <!-- DAY -->
            <div v-if="reportType === 'DAY'" class="space-y-2">

              <div
                class="relative border rounded-lg px-4 py-3 flex items-center gap-3"
                :class="errorMessage ? 'border-red-400' : 'border-[#DCE3E6]'"
              >
                <!-- calendar icon -->
                <svg
                  class="w-5 h-5 text-gray-400 absolute left-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>

                <input
                  type="date"
                  v-model="startDate"
                  class="outline-none pl-8"
                />

                <span class="text-gray-400">-</span>

                <input
                  type="date"
                  v-model="endDate"
                  class="outline-none"
                />
              </div>

            </div>

            <!-- MONTH -->
            <div v-else class="space-y-2">

              <div
                class="border rounded-lg px-4 py-3 flex items-center gap-3"
                :class="errorMessage ? 'border-red-400' : 'border-[#DCE3E6]'"
              >
                <input
                  type="month"
                  v-model="startMonth"
                  class="outline-none"
                />

                <span>-</span>

                <input
                  type="month"
                  v-model="endMonth"
                  class="outline-none"
                />
              </div>

            </div>

            <!-- Error -->
            <div
              v-if="errorMessage"
              class="text-red-500 text-sm flex items-start gap-2 mt-2"
            >
              <!-- <span class="material-icons text-red-500 text-[18px]">error</span> -->
              <span>{{ errorMessage }}</span>
            </div>
          </div>

        </div>

      </div>

      <!-- Button -->
      <div class="flex justify-end mt-8 border-t border-gray-200 pt-6">
        <button
          @click="generateReport"
          class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center gap-2 transition"
        >
          Xuất báo cáo Excel
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getWarehouses } from '@/modules/auth/services/warehouseService'
import type { Warehouse } from '@/modules/auth/services/warehouseService'
import type {
  WarehouseOrderStatisticRequest,
  DeliveryPerformanceRequest,
  ReportType
} from '../type/report'
import {
  exportWarehouseOrderStatistic,
  exportDeliveryPerformance
} from '../services/reportService'

const currentTab = ref<'order' | 'delivery'>('order')
const reportType = ref<ReportType>('DAY')

const warehouses = ref<Warehouse[]>([])
const selectedIds = ref<number[]>([])

const startDate = ref('')
const endDate = ref('')
const startMonth = ref('')
const endMonth = ref('')

const errorMessage = ref('')

const selectedCount = computed(() => selectedIds.value.length)

onMounted(async () => {
  try {
    warehouses.value = await getWarehouses()
  } catch (err) {
    console.error('Failed to load warehouses', err)
  }
})

function validateInputs() {
  errorMessage.value = ''
  if (selectedIds.value.length === 0) {
    errorMessage.value = 'Vui lòng chọn ít nhất một kho'
    return false
  }

  if (reportType.value === 'DAY') {
    if (!startDate.value || !endDate.value) {
      errorMessage.value = 'Vui lòng chọn khoảng ngày'
      return false
    }
    const s = new Date(startDate.value)
    const e = new Date(endDate.value)
    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)
    if (diff < 0) {
      errorMessage.value = 'Ngày kết thúc phải sau ngày bắt đầu'
      return false
    }
    if (diff > 15) {
      errorMessage.value =
        'Lỗi SYSS-0008: Khoảng thời gian quá giới hạn (Tối đa 15 ngày đối với báo cáo theo ngày)'
      return false
    }
  } else {
    if (!startMonth.value || !endMonth.value) {
      errorMessage.value = 'Vui lòng chọn khoảng tháng'
      return false
    }
    const [sy, sm] = startMonth.value.split('-').map(Number) as [number, number]
    const [ey, em] = endMonth.value.split('-').map(Number) as [number, number]
    const monthsDiff = (ey - sy) * 12 + (em - sm)
    if (monthsDiff < 0) {
      errorMessage.value = 'Tháng kết thúc phải sau tháng bắt đầu'
      return false
    }
    if (monthsDiff > 12) {
      errorMessage.value =
        'Lỗi SYSS-0008: Khoảng thời gian quá giới hạn (Tối đa 12 tháng đối với báo cáo theo tháng)'
      return false
    }
  }
  return true
}

function downloadFile(data: Blob, filename: string) {
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function buildFilename(): string {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const ts =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  const prefix = currentTab.value === 'order' ? 'Report01_' : 'Report02_'
  return `${prefix}${ts}.xlsx`
}

async function generateReport() {
  if (!validateInputs()) return

  let payload: any = {
    type: reportType.value,
    warehouseIds: selectedIds.value
  }

  if (reportType.value === 'DAY') {
    payload.startDate = startDate.value
    payload.endDate = endDate.value
  } else {
    payload.startMonth = startMonth.value
    payload.endMonth = endMonth.value
  }

  try {
    let response
    if (currentTab.value === 'order') {
      response = await exportWarehouseOrderStatistic(payload as WarehouseOrderStatisticRequest)
    } else {
      response = await exportDeliveryPerformance(payload as DeliveryPerformanceRequest)
    }

    const filename = buildFilename()
    downloadFile(response.data, filename)
  } catch (err: any) {
    console.error('Report export failed', err)
    errorMessage.value = err?.message || 'Xuất báo cáo thất bại'
  }
}
</script>