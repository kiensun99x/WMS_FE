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
import OrderFilterBox from '@/components/filterBox/OrderFilterBox.vue';
import OrderTable from '@/components/table/OrderTable.vue';
import OrderPagination from '@/components/pagination/OrderPagination.vue';
import { fetchOrders, type SearchOrderRequest } from '@/services/order/orderService';
import { type Order } from '../../type/order/Order';


// ===== STATE =====
// Danh sách đơn hàng từ API
const orders = ref<Order[]>([])

// Thông tin phân trang (size, trang hiện tại, tổng, tổng trang)
const pageInfo = ref({
  size: 10,           // Số items per page
  number: 0,          // Trang hiện tại (0-indexed)
  totalElements: 0,   // Tổng số đơn hàng
  totalPages: 0       // Tổng số trang
})

// Loading state cho API call
const isLoading = ref(false)

// Error message nếu API fail
const error = ref<string | null>(null)

// ===== FILTER =====
// Lưu các filter mà user nhập
const searchFilters = ref<SearchOrderRequest>({
  orderCode: '',        // Mã đơn hàng
  supplierPhone: '',    // SĐT nhà cung cấp
  receiverPhone: '',    // SĐT người nhận
  statusCode: undefined,  // Trạng thái (0-4)
  warehouseCode: '',    // Mã kho
});

// Trang hiện tại (1-indexed cho display)
const currentPage = ref(1);

// ===== COMPUTED =====
// Tính số thứ tự item đầu tiên trên trang hiện tại
// VD: trang 1, 10 items/page -> startItem = 1
// VD: trang 2, 10 items/page -> startItem = 11
const startItem = computed(() => {
  return pageInfo.value.totalElements === 0 ? 0 : (pageInfo.value.number) * pageInfo.value.size + 1;
});

// Tính số thứ tự item cuối cùng trên trang hiện tại
// VD: trang 1, 10 items/page, 25 total -> endItem = 10
// VD: trang 3, 10 items/page, 25 total -> endItem = 25
const endItem = computed(() => {
  return Math.min((pageInfo.value.number + 1) * pageInfo.value.size, pageInfo.value.totalElements);
});

// ===== METHODS =====
// 📥 Load danh sách đơn hàng từ API
// page: trang cần load (0-indexed)
const loadOrders = async (page: number = 0) => {
  isLoading.value = true  // Bắt đầu loading
  error.value = null      // Clear error cũ
  
  try {
    // Gọi API với filters hiện tại, trang, và 10 items per page
    const response = await fetchOrders(searchFilters.value, page, 10)
    const data = response.data
    
    // Nếu API thành công, cập nhật state
    if (data.result) {
      orders.value = data.result.content                        // Danh sách đơn hàng
      pageInfo.value = data.result.page                         // Info phân trang
      currentPage.value = page + 1                              // Convert 0-indexed -> 1-indexed
    }
  } catch (err: any) {
    // Nếu API fail, lưu error message
    error.value = err.message || 'Lỗi khi tải dữ liệu'
    console.error('Error loading orders:', err)
  } finally {
    // Dù success hay fail, cũng stop loading
    isLoading.value = false
  }
}

// 🔍 Xử lý khi user click "Tìm kiếm"
// - Cập nhật filters
// - Reset về trang 1 (vì search mới)
// - Gọi API load lại dữ liệu
const handleSearch = (filters: SearchOrderRequest) => {
  searchFilters.value = filters;      // Lưu filters từ user
  loadOrders(0);                      // Load trang 1 (0-indexed)
};

// ↻ Xử lý khi user click "Đặt lại"
// - Clear tất cả filters
// - Reset về trang 1
// - Gọi API load lại dữ liệu từ đầu
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

// ⬅️➡️ Xử lý khi user chuyển trang
// - page từ Pagination component là 1-indexed
// - Cần convert sang 0-indexed để gửi API
const handlePageChange = (page: number) => {
  loadOrders(page - 1)  // Trừ 1 để convert sang 0-indexed
};

// ⚙️ LIFECYCLE: Khi component được mount (trang load lần đầu)
// - Load danh sách đơn hàng trang 1
onMounted(() => {
  loadOrders(0)  // Load trang 1 (0-indexed)
})
</script>
