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
      <div class="flex gap-2">
        <button
        :disabled="selectedOrders.length === 0"
        @click="handleDispatch"
        class="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition"
      >
        <span>📦</span>
        <span>Xác nhận điều phối</span>
      </button>
      <button
        :disabled="selectedOrders.length === 0"
        @click="clearSelected"
        class="flex items-center gap-2 px-4 py-2 bg-red-400 hover:bg-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition"
      >
        <span>x</span>
        <span>Hủy bỏ</span>
      </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <OrderTable
        :orders="orders"
        :selectedOrders="selectedOrders"
        :maxSelect="MAX_DISPATCH"
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

const MAX_DISPATCH = 100;  // Giới hạn số đơn hàng được chọn để điều phối cùng lúc
// ===== STATE =====
// Danh sách đơn hàng từ API
const orders = ref<Order[]>([]);

// Danh sách ID đơn hàng được chọn (cho nút "Xác nhận điều phối")
const selectedOrders = ref<number[]>([]);

// Thông tin phân trang (size, trang hiện tại, tổng, tổng trang)
const pageInfo = ref({
  size: 10,           // Số items per page
  number: 0,          // Trang hiện tại (0-indexed)
  totalElements: 0,   // Tổng số đơn hàng
  totalPages: 0       // Tổng số trang
});

// Loading state cho API call
const loading = ref(false);

// ===== FILTER =====
// Lưu các filter mà user nhập
// Mặc định chỉ lấy các đơn hàng với statusCode = 0 (Mới/NEW)
const filters = ref<SearchOrderRequest>({
  orderCode: '',        // Mã đơn hàng
  supplierPhone: '',    // SĐT nhà cung cấp
  receiverPhone: '',    // SĐT người nhận
  statusCode: 0,        // Filter for NEW orders by default
});

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
// 📧 Load danh sách đơn hàng cần điều phối
// - Mặc định chỉ load đơn hàng với statusCode = 0 (Mới)
// - Gửi API fetch với filters
const loadOrders = async (page: number = 0) => {
  loading.value = true;  // Bắt đầu loading
  
  try {
    // Gửi API với filters hiện tại, trang, và 10 items per page
    const response = await fetchOrders(filters.value, page, 10);
    const data = response.data;
    
    // Cập nhật state nếu thành công
    if (data?.result) {
      orders.value = data.result.content || [];  // Danh sách đơn hàng
      pageInfo.value = data.result.page;         // Info phân trang
    }
  } catch (error) {
    console.error('Load orders failed:', error);
  } finally {
    loading.value = false;  // Stop loading dù success hay fail
  }
};

// 🔍 Xử lý khi user click "Tìm kiếm"
// - Cập nhật filters
// - Clear lựa chọn (selectedOrders) - vì dữ liệu thay đổi
// - Reset về trang 1
const handleSearch = (searchFilters: SearchOrderRequest) => {
  filters.value = searchFilters;      // Lưu filters
  clearSelected();
  loadOrders(0);                      // Load trang 1 (0-indexed)
};

// ↻ Xử lý khi user click "Đặt lại"
// - Clear tất cả filters
// - Clear lựa chọn
// - Reset về trang 1
const handleReset = () => {
  filters.value = {
    orderCode: '',
    supplierPhone: '',
    receiverPhone: '',
    statusCode: 0,  // Keep statusCode = 0 (only NEW orders)
  };
  clearSelected();
  loadOrders(0);
};

// ⬅️➡️ Xử lý khi user chuyển trang
// - Clear lựa chọn (vì dữ liệu trang mới khác)
// - Chuyển sang trang (page là 1-indexed, API cần 0-indexed)
const handlePageChange = (page: number) => {
  loadOrders(page - 1);       // Trừ 1 để convert sang 0-indexed
};

// 📦 Xử lý khi user click "Xác nhận điều phối"
const handleDispatch = () => {
  // Check: có chọn đơn hàng không?
  if (selectedOrders.value.length === 0) {
    alert('Vui lòng chọn ít nhất một đơn hàng');
    return;
  }
  if (selectedOrders.value.length > MAX_DISPATCH) {
    alert(`Chỉ có thể chọn tối đa ${MAX_DISPATCH} đơn hàng để điều phối cùng lúc`);
    return;
  }
  if (confirm(`Bạn có chắc muốn điều phối ${selectedOrders.value.length} đơn hàng đã chọn?`)) {
    // TODO: Implement dispatch functionality
    console.log('Dispatching orders:', selectedOrders.value);
    alert(`Xác nhận điều phối cho ${selectedOrders.value.length} đơn hàng (chức năng sắp được cập nhật)`);
    clearSelected();
  }
};

// Hủy bỏ tất cả lựa chọn đã chọn
const clearSelected = () => {
  selectedOrders.value = [];
};

// ⚙️ LIFECYCLE: Khi component được mount (trang load lần đầu)
// - Load danh sách đơn hàng cần điều phối (chỉ mới = NEW)
onMounted(async () => {
  loadOrders(0);  // Load trang 1 (0-indexed)
});
</script>