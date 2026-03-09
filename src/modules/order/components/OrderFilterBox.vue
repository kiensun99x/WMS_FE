<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <!-- Order Code Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Mã đơn hàng</label>
        <div class="relative">
          <input
            v-model="localFilters.orderCode"
            type="text"
            placeholder="VD: #INB-2023..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Supplier Phone -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">SĐT Nhà cung cấp</label>
        <div class="relative">
          <input
            v-model="localFilters.supplierPhone"
            type="text"
            placeholder="Nhập sđt..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Receiver Phone -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">SĐT Người nhận</label>
        <div class="relative">
          <input
            v-model="localFilters.receiverPhone"
            type="text"
            placeholder="Nhập sđt..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái đơn hàng</label>
        <select
          v-model="localFilters.status"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="pending">Lưu kho</option>
          <option value="success">Thành công</option>
          <option value="failed">Thất bại</option>
        </select>
      </div>

      <!-- Warehouse Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Mã kho hàng</label>
        <select
          v-model="localFilters.warehouse"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả kho</option>
          <option value="K-TTT">Kho Tôn Thất Thuyết</option>
          <option value="K-SD">Kho Sơn Đồng</option>
          <option value="K-TD">Kho Trương Định</option>
          <option value="K-LD">Kho La Thành</option>
        </select>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        @click="resetFilters"
        class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
      >
        <span>↻</span>
        <span>Đặt lại</span>
      </button>
      <button
        @click="applyFilters"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        <span>🔍</span>
        <span>Tìm kiếm</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FilterState {
  orderCode: string;
  supplierPhone: string;
  receiverPhone: string;
  status: string;
  warehouse: string;
}

const emit = defineEmits<{
  search: [filters: FilterState];
  reset: [];
}>();

const localFilters = ref<FilterState>({
  orderCode: '',
  supplierPhone: '',
  receiverPhone: '',
  status: 'all',
  warehouse: 'all',
});

const applyFilters = () => {
  emit('search', localFilters.value);
};

const resetFilters = () => {
  localFilters.value = {
    orderCode: '',
    supplierPhone: '',
    receiverPhone: '',
    status: 'all',
    warehouse: 'all',
  };
  emit('reset');
};
</script>
