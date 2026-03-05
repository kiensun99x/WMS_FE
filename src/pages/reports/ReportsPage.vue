<template>
  <div class="p-6">
    <div class="bg-white p-6 rounded shadow">
      <p class="mb-4">Select fields and generate report:</p>
      <div class="space-y-4 max-w-md">
        <div>
          <label class="block text-sm font-semibold mb-2">From Date</label>
          <input type="date" class="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">To Date</label>
          <input type="date" class="border px-3 py-2 rounded w-full" />
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Generate
        </button>
      </div>
    </div>
  </div>
</template>