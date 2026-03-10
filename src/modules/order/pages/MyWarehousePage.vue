<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Kho hàng của tôi</h1>
      <p class="text-gray-600">Quản lý hàng trong kho - Warehouse: {{ warehouseInfo }}</p>
    </div>

    <!-- Filter Box -->
    <div class="mb-6">
      <OrderFilterBox 
        :hideWarehouse="true"
        :hideStatus="false"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <!-- Selection Info & Export Button -->
    <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
      <div class="text-blue-900">
        <span class="font-semibold">{{ selectedOrders.length }} đơn hàng</span> được chọn
      </div>
      <button
        :disabled="selectedOrders.length === 0"
        @click="handleExportLabels"
        class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition"
      >
        <span>📄</span>
        <span>Xuất nhãn giao hàng ({{ selectedOrders.length }}/{{ orders.length }})</span>
      </button>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <OrderTable
        :orders="orders"
        :showCheckbox="true"
        :showStatus="true"
        :showWarehouse="false"
        :showFailedCount="true"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import OrderTable from '../components/OrderTable.vue';
import OrderFilterBox from '../components/OrderFilterBox.vue';
import OrderPagination from '../components/OrderPagination.vue';
import { fetchOrders, type Order, type SearchOrderRequest } from '../services/orderService';
import { authStore } from '@/modules/auth/store/authStore';
import { type Warehouse, getWarehouses } from '@/modules/auth/services/warehouseService';

// State
const orders = ref<Order[]>([]);
const selectedOrders = ref<number[]>([]);
const pageInfo = ref({
  size: 10,
  number: 0,
  totalElements: 0,
  totalPages: 0
});
const warehouses = ref<Warehouse[]>([]);
const loading = ref(false);

// Filter
const filters = ref<SearchOrderRequest>({
  orderCode: '',
  supplierPhone: '',
  receiverPhone: '',
  statusCode: undefined,
});

// Computed
const warehouseInfo = computed(() => {
  if (!authStore.warehouseId) return 'N/A';
  const warehouse = warehouses.value.find(w => w.id === authStore.warehouseId);
  return warehouse ? `${warehouse.code} - ${warehouse.name}` : 'N/A';
});

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
    // Add warehouseId to filter
    const requestFilters = {
      ...filters.value,
      warehouseId: authStore.warehouseId
    };

    const response = await fetchOrders(requestFilters as any, page, 10);
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

const loadWarehouses = async () => {
  try {
    const list = await getWarehouses();
    warehouses.value = list || [];
  } catch (error) {
    console.error('Load warehouses failed:', error);
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
    statusCode: undefined,
  };
  selectedOrders.value = [];
  loadOrders(0);
};

const handlePageChange = (page: number) => {
  selectedOrders.value = [];
  loadOrders(page - 1);
};

const handleExportLabels = () => {
  if (selectedOrders.value.length === 0) {
    alert('Vui lòng chọn ít nhất một đơn hàng');
    return;
  }
  // TODO: Implement export functionality
  console.log('Exporting labels for orders:', selectedOrders.value);
  alert(`Xuất nhãn cho ${selectedOrders.value.length} đơn hàng (chức năng sắp được cập nhật)`);
};

// Lifecycle
onMounted(async () => {
  await loadWarehouses();
  loadOrders(0);
});
</script>
