<template>
  <div class="p-6">
    <table class="min-w-full bg-white shadow rounded">
      <thead class="bg-gray-200">
        <tr>
          <th class="px-4 py-2">Code</th>
          <th class="px-4 py-2">Supplier</th>
          <th class="px-4 py-2">Warehouse</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.code" class="hover:bg-gray-100">
          <td class="border px-4 py-2">{{ order.code }}</td>
          <td class="border px-4 py-2">{{ order.supplier }}</td>
          <td class="border px-4 py-2">{{ order.warehouse }}</td>
          <td class="border px-4 py-2">{{ order.status }}</td>
          <td class="border px-4 py-2">
            <router-link :to="`/orders/${order.code}`" class="text-blue-600">View</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const orders = ref([
  { code: 'ORD001', supplier: 'Supplier A', warehouse: 'WH1', status: 'pending' },
  { code: 'ORD002', supplier: 'Supplier B', warehouse: 'WH2', status: 'completed' },
]);
</script>