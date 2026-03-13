<template>
  <div>
    <!-- Supplier Info Section -->
    <div class="grid grid-cols-2 gap-8 mb-8">
      <!-- Left: Supplier Info -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🏢</span>
          <h2 class="text-lg font-bold text-gray-900">Thông tin nhà cung cấp</h2>
        </div>

        <!-- Supplier Name -->
        <div>
          <label class="block text-sm font-bold text-gray-900 mb-2">
            Tên nhà cung cấp <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.supplierName"
            type="text"
            placeholder="Nhập tên nhà cung cấp..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxlength="50"
          />
          <p class="text-right text-xs text-gray-500 mt-1">{{ form.supplierName.length }}/50</p>
        </div>

        
        <!-- Supplier Phone & Email -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">
              Số điện thoại <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.supplierPhone"
              type="tel"
                pattern="[0-9]{10,11}"
              placeholder="09xxxxxxxx"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.supplierEmail"
              type="email"
              placeholder="example@mail.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Supplier Address -->
        <div>
          <label class="block text-sm font-bold text-gray-900 mb-2">
            Địa chỉ người gửi <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.supplierAddress"
            placeholder="Số nhà, tên đường, phường/xã..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            maxlength="200"
          />
          <p class="text-right text-xs text-gray-500 mt-1">{{ form.supplierAddress.length }}/200</p>
        </div>
      </div>

      <!-- Right: Receiver Info -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🚚</span>
          <h2 class="text-lg font-bold text-gray-900">Thông tin bên nhận hàng</h2>
        </div>

        <!-- Receiver Name -->
        <div>
          <label class="block text-sm font-bold text-gray-900 mb-2">
            Tên bên nhận <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.receiverName"
            type="text"
            placeholder="Nhập tên đơn vị nhận hàng..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxlength="50"
          />
          <p class="text-right text-xs text-gray-500 mt-1">{{ form.receiverName.length }}/50</p>
        </div>

        <!-- Receiver Phone & Email -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">
              Số điện thoại <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.receiverPhone"
              type="tel"
                pattern="[0-9]{10,11}"
              placeholder="09xxxxxxxx"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.receiverEmail"
              type="email"
              placeholder="example@mail.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Receiver Address with Geocoding -->
        <div class="relative">
          <label class="block text-sm font-bold text-gray-900 mb-2">
            Địa chỉ nhận <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <textarea
              v-model="form.receiverAddress"
              @input="handleAddressInput"
              placeholder="Tên đường, phường/xã, quận/huyện..."
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxlength="200"
            />
            <!-- Loading Spinner -->
            <div v-if="isLoadingGeocode" class="absolute right-3 top-3">
              <div class="animate-spin">
                <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          </div>
          <p class="text-right text-xs text-gray-500 mt-1">{{ form.receiverAddress.length }}/200</p>

          <!-- Geocode Dropdown Results -->
          <div
            v-if="isShowGeocodeDropdown && geocodeResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <div
              v-for="(result, index) in geocodeResults"
              :key="`${result.place_id}-${index}`"
              @click="selectGeocodeResult(result)"
              class="px-4 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-200 last:border-b-0"
            >
              <div class="font-semibold text-sm text-gray-900">{{ result.name }}</div>
              <div class="text-xs text-gray-500">{{ result.display_name }}</div>
              <div class="text-xs text-gray-400 mt-1">
                Tọa độ: {{ result.lat }}, {{ result.lon }}
              </div>
            </div>
          </div>
        </div>

        <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">
              Địa chỉ cụ thể
            </label>
            <input
              v-model="form.receiverAddressDetail"
              type="text"
              placeholder="Số nhà, tên đường..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        <!-- Receiver Latitude & Longitude -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">
              Vĩ độ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.receiverLatitude"
              type="number"
              placeholder="-90 to 90"
              step="0.000001"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">
              Kinh độ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.receiverLongitude"
              type="number"
              placeholder="-180 to 180"
              step="0.000001"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 justify-center py-6 border-t border-gray-200">
      <button
        type="button"
        :disabled="isLoading"
        class="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition"
      >
        Hủy bỏ
      </button>
      <button
        type="button"
        @click="handleSubmit"
        :disabled="isLoading"
        class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {{ isLoading ? 'Đang tạo...' : 'Tạo đơn hàng' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createOrder } from '../../order/services/orderService'
import { geocodeAddress, type GeocodeResult } from '@/shared/services/geocodeService'
import type { ErrorResponse } from '@/services/error-Response'
import { onUnmounted } from 'vue'

const form = ref({
  supplierName: '',
  supplierAddress: '',
  supplierPhone: '',
  supplierEmail: '',
  receiverName: '',
  receiverAddress: '',
  receiverAddressDetail: '',
  receiverPhone: '',
  receiverEmail: '',
  receiverLatitude: '',
  receiverLongitude: ''
})

const isLoading = ref(false)

// Geocoding states
const isLoadingGeocode = ref(false)
const geocodeResults = ref<GeocodeResult[]>([])
const isShowGeocodeDropdown = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const handleAddressInput = () => {
  // Clear previous results and dropdown
  geocodeResults.value = []
  closeGeocodeDropdown()
  console.log("typing");
  
  // Clear previous debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Only search if address has meaningful content (more than 3 characters)
  if (form.value.receiverAddress.trim().length < 3) {
    return
  }

  // Debounce: wait 800ms before making API call
  debounceTimer = setTimeout(async () => {
    console.log("fetching");
    
    isLoadingGeocode.value = true
    try {
      const results = await geocodeAddress(form.value.receiverAddress)
      console.log("result fetched:", results);
      
      geocodeResults.value = results
      isShowGeocodeDropdown.value = results.length > 0
      if (results.length === 0) {
        clearLatLon()
        alert('Không tìm thấy địa chỉ nào. Vui lòng thử lại với địa chỉ khác hoặc nhập thủ công vĩ độ, kinh độ.')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      geocodeResults.value = []
      closeGeocodeDropdown()
    } finally {
      isLoadingGeocode.value = false
    }
  }, 800)
}

const selectGeocodeResult = (result: GeocodeResult) => {
  form.value.receiverAddress = result.display_name
  form.value.receiverLatitude = result.lat
  form.value.receiverLongitude = result.lon
  geocodeResults.value = []
  isShowGeocodeDropdown.value = false
}

const handleSubmit = async () => {
  // Validation
  const requiredFields = [
    'supplierName',
    'supplierAddress',
    'supplierPhone',
    'supplierEmail',
    'receiverName',
    'receiverAddress',
    'receiverPhone',
    'receiverEmail',
    'receiverLatitude',
    'receiverLongitude'
  ]

  const emptyFields = requiredFields.filter(field => !form.value[field as keyof typeof form.value])

  if (emptyFields.length > 0) {
    alert('Vui lòng điền đầy đủ tất cả các trường')
    return
  }

  // Validate GPS coordinates
  const lat = parseFloat(String(form.value.receiverLatitude))
  const lon = parseFloat(String(form.value.receiverLongitude))

  if (isNaN(lat) || lat < -90 || lat > 90) {
    alert('Vĩ độ phải nằm trong khoảng -90 đến 90')
    return
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    alert('Kinh độ phải nằm trong khoảng -180 đến 180')
    return
  }

  isLoading.value = true

  try {
    const response = await createOrder({
      supplierName: form.value.supplierName,
      supplierAddress: form.value.supplierAddress,
      supplierPhone: form.value.supplierPhone,
      supplierEmail: form.value.supplierEmail,
      receiverName: form.value.receiverName,
      receiverAddress: `${form.value.receiverAddressDetail}, ${form.value.receiverAddress}`,
      receiverPhone: form.value.receiverPhone,
      receiverEmail: form.value.receiverEmail,
      receiverLat: lat,
      receiverLon: lon
    })

    const data = (response as any).data

    if (data?.result) {
      alert(`Tạo đơn hàng thành công. Mã đơn: ${data.result.code}`)
      // Reset form
      form.value = {
        supplierName: '',
        supplierAddress: '',
        supplierPhone: '',
        supplierEmail: '',
        receiverName: '',
        receiverAddress: '',
        receiverPhone: '',
        receiverEmail: '',
        receiverLatitude: '',
        receiverLongitude: ''
      }
      // TODO: Redirect to order detail page or orders list
      console.log('Order created:', data.result)
    } else {
      alert(data?.message || 'Tạo đơn hàng không thành công. Vui lòng thử lại.')
    }
  } catch (error: ErrorResponse | any) {
    console.error('Create order failed:', error)
    const errorMessage = `${error.code}: ${error?.message}` || 'Lỗi khi tạo đơn hàng. Vui lòng thử lại.'
    alert(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const closeGeocodeDropdown = () => {
  if (isShowGeocodeDropdown.value) {
    isShowGeocodeDropdown.value = false
  }
}

const clearLatLon = () => {
  form.value.receiverLatitude = ''
  form.value.receiverLongitude = ''
}

onMounted(() => {
  document.addEventListener('click', closeGeocodeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeGeocodeDropdown)
})
</script>
