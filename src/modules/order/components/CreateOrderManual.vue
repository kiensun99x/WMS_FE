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
            Địa chỉ <span class="text-red-500">*</span>
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

        <!-- Receiver Address -->
        <div>
          <label class="block text-sm font-bold text-gray-900 mb-2">
            Địa chỉ nhận <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.receiverAddress"
            placeholder="Số nhà, tên đường, phường/xã..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            maxlength="200"
          />
          <p class="text-right text-xs text-gray-500 mt-1">{{ form.receiverAddress.length }}/200</p>
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
import { ref } from 'vue'
import { createOrder } from '../../order/services/orderService'
import type { ErrorResponse } from '@/services/error-Response'

const form = ref({
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
})

const isLoading = ref(false)

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
      receiverAddress: form.value.receiverAddress,
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
</script>
