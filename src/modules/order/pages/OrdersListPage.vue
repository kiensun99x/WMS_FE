<template>
  <div class="p-6 space-y-6">
    <!-- Filter Section -->
    <OrderFilterBox @search="handleSearch" @reset="handleReset" />

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <OrderTable :orders="orders" />

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import OrderFilterBox from '../components/OrderFilterBox.vue';
import OrderTable from '../components/OrderTable.vue';
import OrderPagination from '../components/OrderPagination.vue';
import { fetchOrders, type Order, type SearchOrderRequest } from '../services/orderService';


// State
const orders = ref<Order[]>([])
const pageInfo = ref({
  size: 10,
  number: 0,
  totalElements: 0,
  totalPages: 0
})
const isLoading = ref(false)
const error = ref<string | null>(null)

// Filter state
const searchFilters = ref<SearchOrderRequest>({
  orderCode: '',
  supplierPhone: '',
  receiverPhone: '',
  statusCode: undefined,
  warehouseCode: '',
});

const currentPage = ref(1);

const startItem = computed(() => {
  return pageInfo.value.totalElements === 0 ? 0 : (pageInfo.value.number) * pageInfo.value.size + 1;
});

const endItem = computed(() => {
  return Math.min((pageInfo.value.number + 1) * pageInfo.value.size, pageInfo.value.totalElements);
});

// Methods
const loadOrders = async (page: number = 0) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await fetchOrders(searchFilters.value, page, 10)
    const data = response.data
    
    if (data.result) {
      orders.value = data.result.content
      pageInfo.value = data.result.page
      currentPage.value = page + 1 // Convert to 1-indexed for display
    }
  } catch (err: any) {
    error.value = err.message || 'Lỗi khi tải dữ liệu'
    console.error('Error loading orders:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = (filters: SearchOrderRequest) => {
  searchFilters.value = filters;
  loadOrders(0); // Reset to first page on new search
};

const handleReset = () => {
  searchFilters.value = {
    orderCode: '',
    supplierPhone: '',
    receiverPhone: '',
    statusCode: undefined,
    warehouseCode: '',
  };
  loadOrders(0);
};

const handlePageChange = (page: number) => {
  // page là 1-indexed, vì thế cần convert sang 0-indexed cho API
  loadOrders(page - 1)
};

// Load data khi component mount
onMounted(() => {
  loadOrders(0)
})
</script>
