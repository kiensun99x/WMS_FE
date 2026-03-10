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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import OrderTable from '../components/OrderTable.vue';
import OrderFilterBox from '../components/OrderFilterBox.vue';
import { fetchOrders, type Order, type SearchOrderRequest } from '../services/orderService';
import { authStore } from '@/modules/auth/store/authStore';
import { type Warehouse, getWarehouses } from '@/modules/auth/services/warehouseService';

// State
const orders = ref<Order[]>([]);
const selectedOrders = ref<number[]>([]);
const pageNumber = ref(0);
const pageSize = ref(10);
const totalElements = ref(0);
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

// Methods
const loadOrders = async () => {
  try {
    loading.value = true;
    
    // Add warehouseId to filter
    const requestFilters = {
      ...filters.value,
      warehouseId: authStore.warehouseId
    };

    const response = await fetchOrders(requestFilters as any, pageNumber.value, pageSize.value);
    
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

const loadWarehouses = async () => {
  try {
    const list = await getWarehouses();
    warehouses.value = list || [];
  } catch (error) {
    console.error('Load warehouses failed:', error);
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
    statusCode: undefined,
  };
  pageNumber.value = 0;
  selectedOrders.value = [];
  await loadOrders();
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
  await loadWarehouses();
  await loadOrders();
});
</script>
