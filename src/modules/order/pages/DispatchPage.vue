<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Điều phối đơn</h1>
      <p class="text-gray-600">Phân phối và điều phối đơn hàng đến các kho hàng</p>
    </div>

    <!-- Filter Box -->
    <div class="mb-6">
      <OrderFilterBox 
        :hideWarehouse="true"
        :hideStatus="true"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <!-- Selection Info & Dispatch Button -->
    <div class="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex justify-between items-center">
      <div class="text-amber-900">
        <span class="font-semibold">{{ selectedOrders.length }} đơn hàng</span> được chọn
      </div>
      <button
        :disabled="selectedOrders.length === 0"
        @click="handleDispatch"
        class="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition"
      >
        <span>📦</span>
        <span>Xác nhận điều phối ({{ selectedOrders.length }}/{{ orders.length }})</span>
      </button>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <OrderTable
        :orders="orders"
        :showCheckbox="true"
        :showStatus="false"
        :showWarehouse="false"
        :showFailedCount="false"
        @update:selectedOrders="selectedOrders = $event"
      />
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Hiển thị <span class="font-semibold">{{ pageNumber * pageSize + 1 }}</span> đến 
        <span class="font-semibold">{{ (pageNumber + 1) * pageSize }}</span>
        trong số <span class="font-semibold">{{ totalElements }}</span> kết quả
      </div>
      <div class="flex gap-2">
        <button
          :disabled="pageNumber === 0"
          @click="previousPage"
          class="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded transition"
        >
          ←
        </button>
        <span class="px-3 py-2">Trang {{ pageNumber + 1 }}</span>
        <button
          :disabled="(pageNumber + 1) * pageSize >= totalElements"
          @click="nextPage"
          class="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded transition"
        >
          →
        </button>
      </div>
    </div>

    <!-- Dispatch Info Section (Optional) -->
    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <span class="text-xl">ℹ️</span>
        <div>
          <h3 class="font-semibold text-blue-900 mb-1">Mẹo điều phối</h3>
          <p class="text-blue-800 text-sm">
            Bạn có thể chọn cùng lúc nhiều đơn hàng để điều phối vào cùng một kho nhằm tiết kiệm thời gian vận chuyển.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import OrderTable from '../../order/components/OrderTable.vue';
import OrderFilterBox from '../../order/components/OrderFilterBox.vue';
import { fetchOrders, type Order, type SearchOrderRequest } from '../../order/services/orderService';

// State
const orders = ref<Order[]>([]);
const selectedOrders = ref<number[]>([]);
const pageNumber = ref(0);
const pageSize = ref(10);
const totalElements = ref(0);
const loading = ref(false);

// Filter - for dispatch, we want all orders that are in "NEW" or "STORED" status
const filters = ref<SearchOrderRequest>({
  orderCode: '',
  supplierPhone: '',
  receiverPhone: '',
  statusCode: 0, // Filter for NEW orders by default
});

// Methods
const loadOrders = async () => {
  try {
    loading.value = true;
    
    const response = await fetchOrders(filters.value, pageNumber.value, pageSize.value);
    
    if (response.data?.result) {
      orders.value = response.data.result.content || [];
      totalElements.value = response.data.result.page?.totalElements || 0;
    }
  } catch (error) {
    console.error('Load orders failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = async (searchFilters: SearchOrderRequest) => {
  filters.value = searchFilters;
  pageNumber.value = 0;
  selectedOrders.value = [];
  await loadOrders();
};

const handleReset = async () => {
  filters.value = {
    orderCode: '',
    supplierPhone: '',
    receiverPhone: '',
    statusCode: 0,
  };
  pageNumber.value = 0;
  selectedOrders.value = [];
  await loadOrders();
};

const handleDispatch = () => {
  if (selectedOrders.value.length === 0) {
    alert('Vui lòng chọn ít nhất một đơn hàng');
    return;
  }
  // TODO: Implement dispatch functionality
  console.log('Dispatching orders:', selectedOrders.value);
  alert(`Xác nhận điều phối cho ${selectedOrders.value.length} đơn hàng (chức năng sắp được cập nhật)`);
};

const nextPage = async () => {
  if ((pageNumber.value + 1) * pageSize.value < totalElements.value) {
    pageNumber.value++;
    selectedOrders.value = [];
    await loadOrders();
  }
};

const previousPage = async () => {
  if (pageNumber.value > 0) {
    pageNumber.value--;
    selectedOrders.value = [];
    await loadOrders();
  }
};

// Lifecycle
onMounted(async () => {
  await loadOrders();
});
</script>