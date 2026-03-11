<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Kho hàng của tôi</h1>
      <p class="text-gray-600">Quản lý hàng trong kho</p>
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
      <div class="flex gap-2">
        <button
            :disabled="selectedOrders.length === 0"
            @click="handleExportLabels"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition"
        >
            <span>📄</span>
            <span>Xuất nhãn giao hàng ({{ selectedOrders.length }}/{{ orders.length }})</span>
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
        :maxSelect="MAX_EXPORT"
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
import { fetchMyWarehouseOrders, exportLabels, type Order, type SearchOrderRequest } from '../services/orderService';

const MAX_EXPORT = 10;  // Giới hạn số đơn hàng được chọn để xuất nhãn cùng lúc
// ===== STATE =====
// Danh sách đơn hàng từ API
const orders = ref<Order[]>([]);

// Danh sách ID đơn hàng được chọn (cho nút "Xuất nhãn giao hàng")
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
const filters = ref<SearchOrderRequest>({
  orderCode: '',        // Mã đơn hàng
  supplierPhone: '',    // SĐT nhà cung cấp
  receiverPhone: '',    // SĐT người nhận
  statusCode: undefined,  // Trạng thái (0-4)
});

// Tính số thứ tự item đầu tiên trên trang hiện tại
const startItem = computed(() => {
  return pageInfo.value.totalElements === 0 ? 0 : (pageInfo.value.number) * pageInfo.value.size + 1;
});

// Tính số thứ tự item cuối cùng trên trang hiện tại
const endItem = computed(() => {
  return Math.min((pageInfo.value.number + 1) * pageInfo.value.size, pageInfo.value.totalElements);
});

// ===== METHODS =====
// 📧 Load danh sách đơn hàng chỉ của kho hiện tại
// - Thêm warehouseId từ authStore vào filters
// - Gửi API fetch với filters đã cập nhật
const loadOrders = async (page: number = 0) => {
  loading.value = true;  // Bắt đầu loading
  
  try {
    // Gửi API
    const response = await fetchMyWarehouseOrders(filters.value, page, 10);
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
  clearSelected();                    // Clear lựa chọn
  loadOrders(0);                      // Load trang 1
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
    statusCode: undefined,
  };
  clearSelected();  // Clear lựa chọn
  loadOrders(0);
};

// ⬅️➡️ Xử lý khi user chuyển trang
// - Clear lựa chọn (vì dữ liệu trang mới khác)
// - Chuyển sang trang (page là 1-indexed, API cần 0-indexed)
const handlePageChange = (page: number) => {
//   clearSelected();  // Clear lựa chọn
  loadOrders(page - 1);       // Trừ 1 để convert sang 0-indexed
};

// 📄 Xử lý khi user click "Xuất nhãn giao hàng"
const handleExportLabels = async () => {
  // Check: có chọn đơn hàng không?
  if (selectedOrders.value.length === 0) {
    alert('Vui lòng chọn ít nhất một đơn hàng');
    return;
  }
    if (selectedOrders.value.length > MAX_EXPORT) {
        alert(`Chỉ có thể chọn tối đa ${MAX_EXPORT} đơn hàng để xuất nhãn cùng lúc`);
        return;
    }
    if (confirm(`Bạn có chắc muốn xuất nhãn giao hàng cho ${selectedOrders.value.length} đơn hàng đã chọn?`)) {
        try {
            
            // Gọi API export labels
            const response = await exportLabels(selectedOrders.value);
            
            // Tạo blob URL để download file
            const blob = response.data;
            //tạo url từ blob để download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Lấy filename từ Content-Disposition header nếu có
            const contentDisposition = response.headers['content-disposition'];
            let filename = `Labels_${new Date().toISOString().split('T')[0]}.xlsx`; // Default filename
            
            if (contentDisposition && contentDisposition.includes('filename')) {
                const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/);
                if (filenameMatch) {
                    filename = decodeURIComponent(filenameMatch[1]);
                }
            }
            //set file name
            link.setAttribute('download', filename);
            //trigger click để download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert(`Xuất nhãn thành công cho ${selectedOrders.value.length} đơn hàng`);
            clearSelected();  // Clear lựa chọn sau khi export
        } catch (error) {
            console.error('Export labels failed:', error);
            alert('Xuất nhãn thất bại. Vui lòng thử lại.');
        }
    }
};

// Hủy bỏ tất cả lựa chọn đã chọn
const clearSelected = () => {
  selectedOrders.value = [];
};

// ⚙️ LIFECYCLE: Khi component được mount (trang load lần đầu)
// - Load danh sách kho hàng thước
// - Rồi load danh sách đơn hàng của kho hiện tại
onMounted(async () => {
  await loadWarehouses();  // Load kho trước (cần cho warehouseInfo)
  loadOrders(0);           // Rồi load đơn hàng trang 1
});
</script>
