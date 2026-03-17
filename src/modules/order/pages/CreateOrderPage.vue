<template>
  <div class="p-6 pt-2 mx-auto">
    <!-- Tabs Header -->
    <div class="mb-6 border-b border-gray-200">
      <div class="flex gap-0">
        <button
          @click="activeTab = 'manual'"
          :class="[
            'px-6 py-3 font-bold text-sm transition',
            activeTab === 'manual'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="mr-2">✏️</span>Nhập thủ công
        </button>
        <button
          @click="activeTab = 'import'"
          :class="[
            'px-6 py-3 font-bold text-sm transition',
            activeTab === 'import'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="mr-2">📥</span>Import Excel
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <!-- Manual Entry Tab -->
      <CreateOrderManual v-if="activeTab === 'manual'" />

      <!-- Import Excel Tab -->
      <CreateOrderImport v-if="activeTab === 'import'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateOrderManual from '../components/CreateOrderManual.vue'
import CreateOrderImport from '../components/CreateOrderImport.vue'

const activeTab = ref<'manual' | 'import'>('manual')
</script>