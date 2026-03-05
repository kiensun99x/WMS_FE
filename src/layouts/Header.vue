<template>
  <header class="h-16 bg-white flex items-center justify-between px-6 shadow">
    <h1 class="text-xl font-semibold">{{ title }}</h1>
    <div class="flex items-center space-x-4">
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const title = computed(() => route.meta.title || '');
</script>