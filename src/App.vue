<script setup lang="ts">
import { useRoute } from "vue-router"
import DefaultLayout from "./layouts/DefaultLayout.vue"

const route = useRoute()
</script>

<template>

  <!-- LOGIN PAGE -->
  <router-view v-if="route.path === '/login'" />

  <!-- NORMAL PAGES -->
  <DefaultLayout v-else>
    <router-view />
  </DefaultLayout>

</template>