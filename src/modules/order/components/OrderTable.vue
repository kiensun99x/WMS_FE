<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <!-- Checkbox -->
          <th v-if="showCheckbox" class="px-4 py-3 text-left">
            <input 
              type="checkbox" 
              :checked="allSelected" 
              @change="toggleSelectAll"
              class="rounded"
            />
          </th>

          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">No</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã đơn hàng</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
          
          <!-- Status Column -->
          <th v-if="showStatus" class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
          
          <!-- Warehouse Column -->
          <th v-if="showWarehouse" class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên kho</th>
          
          <!-- Failed Delivery Count Column -->
          <th v-if="showFailedCount" class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số lần giao thất bại</th>
          
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nhà cung cấp</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Người nhận</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="(order, index) in orders" :key="order.id" class="hover:bg-gray-50 transition">
          <!-- Checkbox -->
          <td v-if="showCheckbox" class="px-4 py-4">
            <input 
              type="checkbox"
              :checked="props.selectedOrders?.includes(order.id)"
              @change="toggleSelect(order.id)"
              class="rounded"
            />
          </td>

          <!-- No -->
          <td class="px-6 py-4 text-sm text-gray-600">{{ index + 1 }}</td>

          <!-- Order Code -->
          <td class="px-6 py-4 text-sm">
            <router-link
              :to="`/orders/${order.id}`"
              class="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              {{ order.code }}
            </router-link>
          </td>

          <!-- Created Date -->
          <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(order.createdAt) }}</td>

          <!-- Status Column -->
          <td v-if="showStatus" class="px-6 py-4 text-sm">
            <span :class="getStatusClass(order.status)">
              {{ getStatusLabel(order.status) }}
            </span>
          </td>

          <!-- Warehouse Column -->
          <td v-if="showWarehouse" class="px-6 py-4 text-sm">
            <div class="font-semibold text-gray-900">{{ order.warehouseCode || 'N/A' }}</div>
            <div class="text-gray-500 text-xs">{{ order.warehouseName || 'Chưa phân bổ' }}</div>
          </td>

          <!-- Failed Delivery Count Column -->
          <td v-if="showFailedCount" class="px-6 py-4 text-sm text-gray-600">
            {{ order.failedDeliveryCount }}
          </td>

          <!-- Supplier -->
          <td class="px-6 py-4 text-sm w-xs">
            <div class="font-semibold text-gray-900">{{ order.supplierName }}</div>
            <div class="text-gray-500 text-xs">Đc: {{ order.supplierAddress }}</div>
            <div class="text-gray-500 text-xs">Sđt: {{ order.supplierPhone }}</div>
          </td>

          <!-- Receiver -->
          <td class="px-6 py-4 text-sm w-xs">
            <div class="font-semibold text-gray-900">{{ order.receiverName }}</div>
            <div class="text-gray-500 text-xs">Đc: {{ order.receiverAddress }}</div>
            <div class="text-gray-500 text-xs">Sđt: {{ order.receiverPhone }}</div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="orders.length === 0">
          <td :colspan="getColspan()" class="px-6 py-12 text-center">
            <div class="text-gray-500">Không có dữ liệu đơn hàng</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { type Order } from '../services/orderService';

// ===== PROPS =====
// orders: Danh sách đơn hàng cần hiển thị
// showCheckbox: Hiển thị cột checkbox (cho multi-select)
// Giới hạn số đơn hàng được chọn (nếu có)
// showStatus: Hiển thị cột Trạng thái
// showWarehouse: Hiển thị cột Tên kho
// showFailedCount: Hiển thị cột Số lần giao thất bại
// selectedOrders: Danh sách ID được chọn (từ parent) - để sync state
const props = withDefaults(defineProps<{
  orders: Order[];
  selectedOrders?: number[]; 
  maxSelect?: number;  
  showCheckbox?: boolean;
  showStatus?: boolean;
  showWarehouse?: boolean;
  showFailedCount?: boolean;
}>(), {
  selectedOrders: () => [],
  showCheckbox: false,
  showStatus: true,
  showWarehouse: true,
  showFailedCount: false,
});

// ===== EMIT =====
// 'update:selectedOrders': Phát sự kiện khi user chọn/bỏ chọn đơn hàng
const emit = defineEmits<{
  'update:selectedOrders': [ids: number[]];
}>();

// ===== COMPUTED =====
// Kiểm tra xem tất cả đơn hàng trên trang này có được chọn không?
const allSelected = computed(() => {
  if (props.orders.length === 0) return false;
  return props.orders.every(o => props.selectedOrders?.includes(o.id));
});

// ===== METHODS =====
// ☑️ Xử lý click vào checkbox "Select All"
// - Nếu đang chọn tất cả: bỏ chọn hết (chỉ loại bỏ orders hiện tại)
// - Nếu chưa chọn tất cả: chọn tất cả (thêm IDs của page orders hiện tại vào selectedOrders)
const toggleSelectAll = () => {
  const currentSelected = props.selectedOrders || [];
  
  if (allSelected.value) {
    // Bỏ chọn hết - Chỉ loại bỏ những ID có trong orders hiện tại
    const orderIds = props.orders.map(o => o.id);
    const newSelected = currentSelected.filter(id => !orderIds.includes(id));
    emit('update:selectedOrders', newSelected);
  } else {
    // Chọn tất cả - Thêm IDs từ orders (giữ IDs cũ)
    props.orders.forEach(order => {
      // Nếu có giới hạn maxSelect và đã đạt giới hạn, không thêm nữa
      if (props.maxSelect && currentSelected.length >= props.maxSelect) {
        alert(`Bạn chỉ có thể chọn tối đa ${props.maxSelect} đơn hàng.`);
        return;
      }
      if (!currentSelected.includes(order.id)) {
        currentSelected.push(order.id);
      }
    });
    emit('update:selectedOrders', currentSelected);
  }
};

// ☑️ Xử lý click vào checkbox riêng lẻ
// - Nếu có giới hạn maxSelect và đã đạt giới hạn khi muốn thêm, show alert và không thêm nữa
// - Tìm đơn hàng trong danh sách chọn
// - Nếu đã chọn: bỏ chọn
// - Nếu chưa chọn: thêm vào danh sách chọn
const toggleSelect = (id: number) => {
  if (props.maxSelect && props.selectedOrders && !props.selectedOrders.includes(id) && props.selectedOrders.length >= props.maxSelect) {
    alert(`Bạn chỉ có thể chọn tối đa ${props.maxSelect} đơn hàng.`);
    return;
  }
  const currentSelected = props.selectedOrders || [];
  const index = currentSelected.indexOf(id);
  
  let newSelected: number[];
  if (index > -1) {
    newSelected = currentSelected.filter((_, i) => i !== index);  // Bỏ chọn
  } else {
    newSelected = [...currentSelected, id];  // Thêm vào danh sách chọn
  }
  emit('update:selectedOrders', newSelected);  // Phát sự kiện cập nhật parent
};

// 🏷️ Chuyển đổi status code thành label tiếng Việt (để hiển thị)
// VD: 'NEW' -> 'Mới', 'DELIVERED' -> 'Đã giao'
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    NEW: 'Mới',
    STORED: 'Lưu kho',
    DELIVERED: 'Đã giao',
    FAILED: 'Giao thất bại',
    RETURNED: 'Trả hàng'
  };
  return labels[status] || status;
};

// 🎨 Lấy CSS class cho status badge (để hiển thị màu)
// VD: 'NEW' -> blue badge, 'DELIVERED' -> green badge
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    NEW: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800',
    STORED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800',
    DELIVERED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800',
    FAILED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800',
    RETURNED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800',
  };
  return classes[status] || '';
};

// 📅 Format lại đường dây ngày/giờ sang định dạng Việt
// Input: '2025-03-10T10:30:00Z'
// Output: '10/03/2025 10:30'
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 🔢 Tính số cột colspan cho hàng "Không có dữ liệu"
// - Luôn có 4 cột: checkbox/no/code/date + supplier + receiver = 6 cột base
// - Thêm 1 nếu hiển thị status
// - Thêm 1 nếu hiển thị warehouse
// - Thêm 1 nếu hiển thị failedCount
const getColspan = () => {
  let count = 4; // checkbox (nếu có), no, code, date
  if (props.showStatus) count++;
  if (props.showWarehouse) count++;
  if (props.showFailedCount) count++;
  count += 2; // supplier, receiver (luôn có)
  return count;
};
</script>
