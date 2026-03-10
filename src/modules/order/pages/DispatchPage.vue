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
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Hiển thị <span class="font-semibold">{{ startItem }}</span> đến
        <span class="font-semibold">{{ endItem }}</span> trong số
        <span class="font-semibold">{{ pageInfo.totalElements }}</span> kết quả
      </div>
      <OrderPagination
        :current-page="pageInfo.number + 1"
        :total-pages="pageInfo.totalPages"
        @change-page="handlePageChange"
      />
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
import { ref, onMounted, computed } from 'vue';
import OrderTable from '../../order/components/OrderTable.vue';
import OrderFilterBox from '../../order/components/OrderFilterBox.vue';
import OrderPagination from '../../order/components/OrderPagination.vue';
import { fetchOrders, type Order, type SearchOrderRequest } from '../../order/services/orderService';

// State
const orders = ref<Order[]>([]);
const selectedOrders = ref<number[]>([]);
const pageInfo = ref({
  size: 10,
  number: 0,
  totalElements: 0,
  totalPages: 0
});
const loading = ref(false);

// Filter - for dispatch, we want all orders that are in "NEW" or "STORED" status
const filters = ref<SearchOrderRequest>({
  orderCode: '',
  supplierPhone: '',
  receiverPhone: '',
  statusCode: 0, // Filter for NEW orders by default
});

// Computed
const startItem = computed(() => {
  return pageInfo.value.totalElements === 0 ? 0 : (pageInfo.value.number) * pageInfo.value.size + 1;
});

const endItem = computed(() => {
  return Math.min((pageInfo.value.number + 1) * pageInfo.value.size, pageInfo.value.totalElements);
});

// Methods
const loadOrders = async (page: number = 0) => {
  loading.value = true;
  
  try {
    const response = await fetchOrders(filters.value, page, 10);
    const data = response.data;
    
    if (data?.result) {
      orders.value = data.result.content || [];
      pageInfo.value = data.result.page;
    }
  } catch (error) {
    console.error('Load orders failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (searchFilters: SearchOrderRequest) => {
  filters.value = searchFilters;
  selectedOrders.value = [];
  loadOrders(0);
};

const handleReset = () => {
  filters.value = {
    orderCode: '',
    supplierPhone: '',
    receiverPhone: '',
    statusCode: 0,
  };
  selectedOrders.value = [];
  loadOrders(0);
};

const handlePageChange = (page: number) => {
  selectedOrders.value = [];
  loadOrders(page - 1);
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

// Lifecycle
onMounted(async () => {
  loadOrders(0);
});
</script>