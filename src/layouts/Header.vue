<template>
  <header v-if="title" class="bg-white flex flex-col p-6 justify-center shadow" >
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
      <p class="text-md text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const title = computed(() => route.meta.title || '');
const subtitle = computed(() => route.meta.subtitle || '');
</script>