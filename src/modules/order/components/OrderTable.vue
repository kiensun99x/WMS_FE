<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <!-- Checkbox -->
          <th v-if="showCheckbox" class="px-4 py-3">
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
              :checked="selectedOrders.includes(order.id)"
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

const props = withDefaults(defineProps<{
  orders: Order[];
  showCheckbox?: boolean;
  showStatus?: boolean;
  showWarehouse?: boolean;
  showFailedCount?: boolean;
}>(), {
  showCheckbox: false,
  showStatus: true,
  showWarehouse: true,
  showFailedCount: false,
});

const emit = defineEmits<{
  'update:selectedOrders': [ids: number[]];
}>();

const selectedOrders = ref<number[]>([]);

const allSelected = computed(() => {
  return selectedOrders.value.length === props.orders.length && props.orders.length > 0;
});

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedOrders.value = [];
  } else {
    selectedOrders.value = props.orders.map(o => o.id);
  }
  emit('update:selectedOrders', selectedOrders.value);
};

const toggleSelect = (id: number) => {
  const index = selectedOrders.value.indexOf(id);
  if (index > -1) {
    selectedOrders.value.splice(index, 1);
  } else {
    selectedOrders.value.push(id);
  }
  emit('update:selectedOrders', selectedOrders.value);
};

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

const getColspan = () => {
  let count = 4; // checkbox, no, code, date
  if (props.showStatus) count++;
  if (props.showWarehouse) count++;
  if (props.showFailedCount) count++;
  count += 2; // supplier, receiver
  return count;
};
</script>
