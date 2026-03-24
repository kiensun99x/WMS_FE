<template>
  <div class="flex items-center gap-2">
    <!-- Previous Button -->
    <button
      @click="goToPreviousPage"
      :disabled="currentPage === 1"
      class="py-1 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      <span class="text-lg">‹</span>
    </button>

    <!-- Page Numbers -->
    <div class="flex items-center gap-1">
      <!-- First page -->
      <button
        @click="$emit('change-page', 1)"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          currentPage === 1
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        ]"
      >
        1
      </button>

      <!-- Dots if needed -->
      <span v-if="currentPage > 3" class="px-2 text-gray-400">...</span>

      <!-- Middle pages -->
      <button
        v-for="page in middlePages"
        :key="page"
        @click="$emit('change-page', page)"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          currentPage === page
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ page }}
      </button>

      <!-- Dots if needed -->
      <span v-if="currentPage < totalPages - 2" class="px-2 text-gray-400">...</span>

      <!-- Last page (if total pages > 1) -->
      <button
        v-if="totalPages > 1"
        @click="$emit('change-page', totalPages)"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          currentPage === totalPages
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ totalPages }}
      </button>
    </div>

    <!-- Next Button -->
    <button
      @click="goToNextPage"
      :disabled="currentPage === totalPages"
      class="py-1 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      <span class="text-lg">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// ===== PROPS =====
// currentPage: Trang hiện tại (1-indexed)
// totalPages: Tổng số trang
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

// ===== EMIT =====
// 'change-page': Phát sự kiện khi user click nút phân trang (1-indexed page number)
const emit = defineEmits<{
  'change-page': [page: number];
}>();

// ===== COMPUTED =====
// Tính các trang nằm giữa trang đầu và trang cuối
// VD nếu currentPage = 5, totalPages = 10:
// - Thứ 1: page 1
// - Giữa: pages 4, 5, 6
// - Dấu "...": nếu có khoảng cách
// - Cuối: page 10
const middlePages = computed(() => {
  const pages: number[] = [];
  // Bắt đầu từ trang 2 (hoặc trang currentPage - 1, nếu currentPage >= 3)
  const start = Math.max(2, props.currentPage - 1);
  // Kết thúc ở trang (totalPages - 1) (hoặc trang currentPage + 1, nếu currentPage <= totalPages - 2)
  const end = Math.min(props.totalPages - 1, props.currentPage + 1);

  // Thêm tất cả các trang từ start đến end
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// ===== METHODS =====
// ⬅️ Xử lý nút "Trang trước"
// - Nếu đang ở trang 1, không làm gì
// - Không thì phát sự kiện 'change-page' với trang trước
const goToPreviousPage = () => {
  if (props.currentPage > 1) {
    emit('change-page', props.currentPage - 1);
  }
};

// ➡️ Xử lý nút "Trang sau"
// - Nếu đang ở trang cuối, không làm gì
// - Không thì phát sự kiện 'change-page' với trang sau
const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('change-page', props.currentPage + 1);
  }
};
</script>
