<template>
  <div class="p-6">
    <div class="bg-white p-4 rounded shadow">
      <p><strong>Order ID:</strong> {{ id }}</p>
      <p><strong>Supplier:</strong> Supplier A</p>
      <p><strong>Status:</strong> pending</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ id: string }>();
const id = props.id;
</script>