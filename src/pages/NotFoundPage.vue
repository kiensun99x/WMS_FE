<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center px-6">
      <!-- 404 Icon/Number -->
      <div class="mb-6">
        <svg class="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Error Code -->
      <h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>

      <!-- Error Message -->
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">Không tìm thấy trang</h2>
      <p class="text-gray-600 mb-8 text-lg">
        Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã được xoá.
      </p>

      <!-- Suggestions -->
      <div class="mb-8">
        <p class="text-gray-600 mb-4">Bạn có thể:</p>
        <ul class="text-gray-600 space-y-2">
          <li>Kiểm tra lại địa chỉ URL</li>
          <li>Quay lại trang trước</li>
          <li>Về trang chủ</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 justify-center">
        <button
          @click="$router.back()"
          class="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          ← Quay lại
        </button>
        <router-link
          to="/"
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Về trang chủ →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
