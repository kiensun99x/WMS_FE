<template>
  <nav class="h-screen bg-gray-900 text-white flex flex-col border">
    <!-- Logo Section -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="w-10 h-10 bg-blue-500 rounded flex items-center justify-center font-bold text-lg rounded-full">
          W
          
        </div>
        <span class="text-xl font-bold">WMS System</span>
      </div>
    </div>

    <!-- Menu Section -->
    <div class="flex-1 overflow-y-auto py-4 ">
      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="item.path"
        class="block px-6 py-3  transition"
        :class="{ 'bg-blue-600': isActive(item.path) }"
      >
        {{ item.label }}
      </router-link>
    </div>

    <!-- User Section -->
    <div class="border-t border-gray-700 p-4">
      <div class="text-sm font-semibold mb-3">User</div>
      <div class="text-sm mb-3"> Kho TTT</div>
      <div class="flex space-x-2">
        <button class="flex-1 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded transition">
          Settings
        </button>
        <button
          @click="handleLogout"
          class="flex-1 px-3 py-2 text-xs bg-red-600 hover:bg-red-700 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authStore } from '../modules/auth/store/authStore';

const route = useRoute();
const router = useRouter();

const handleLogout = () => {
  // clear store and local storage then navigate back to login
  authStore.logout();
  localStorage.clear();
  router.push('/login');
};

const menu = [
  // { path: '/dashboard', label: 'Dashboard', name: 'Dashboard' },
  { path: '/orders', label: 'Đơn hàng', name: 'Orders' },
  { path: '/orders/create', label: 'Tạo đơn hàng', name: 'CreateOrder' },
  { path: '/my-warehouse', label: 'Kho hàng của tôi', name: 'MyWarehouse' },
  { path: '/dispatch', label: 'Điều phối đơn', name: 'Dispatch' },
  { path: '/reports', label: 'Báo cáo', name: 'Reports' },
];

function isActive(path: string) {
  return route.path === path;
}
</script>