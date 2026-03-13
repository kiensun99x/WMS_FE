<template>
  <header v-if="title" class="bg-white flex p-6 shadow" >
    <div class="flex flex-col justify-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ title }} 
          <span v-if="route.path === '/dispatch'" 
            class="inline-flex items-center px-4 py-1 rounded-full text-xl font-medium bg-blue-100 text-blue-800"
          > Mới </span>
        </h1> 
        
            
        
      </div>
      <p class="text-md text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
    <div v-if="warehouseSlot" class="ml-auto flex items-center space-x-4">
      <div class="text-xl text-gray-600">
        <span class="font-semibold">{{ warehouseSlot.available }}</span> / 
        <span class="font-semibold">{{ warehouseSlot.capacity }}</span> slots
      </div>
      <div class="w-32 h-6 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-green-500" 
          :style="{ width: (warehouseSlot.available / warehouseSlot.capacity * 100) + '%' }"
        ></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getCurrentWarehouse } from '@/shared/services/warehouseService';
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const title = computed(() => route.meta.title || '');
const subtitle = computed(() => route.meta.subtitle || '');

const warehouseSlot = ref<{
  capacity: number;
  available: number;
} | null>(null);

const fetchWarehouse = async () => {
  if (route.name === 'Warehouse') {
    const response = await getCurrentWarehouse();
    if (response?.result) {
      warehouseSlot.value = {
        capacity: response.result.capacity,
        available: response.result.availableSlots
      };
    }
  } else {
    warehouseSlot.value = null;
  }
};


// Watch để fetch lại khi route thay đổi
watch(() => route.name, fetchWarehouse);

</script>