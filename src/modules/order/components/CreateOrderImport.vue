<template>
  <div class="space-y-6 flex gap-4">
    <main class="flex-1 space-y-6">
      <!-- Upload File Section -->
      <div 
        :class="[
          'border-2 border-dashed rounded-lg p-12 bg-gray-50',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <div v-if="selectedFile" class="text-center mt-4 text-sm text-gray-700">
          Đã chọn file: <span class="font-bold">{{ selectedFile.name }}</span>
        </div>
        <div v-else class="text-center">
          <div class="mb-4">
            <span class="text-6xl inline-block">📁</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Kéo thả file vào đây hoặc click để chọn</h3>
          <p class="text-sm text-gray-600 mb-6">
            Hỗ trợ định dạng .xlsx. Dung lượng tối đa 10MB.
            <br />
            Đảm bảo tệp tin không được đặt mật khẩu bảo vệ.
          </p>
          <button
            @click="triggerFileInput"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-lg transition"
          >
            Chọn file từ máy tính
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>
      </div>

      <!-- Error Alert (if exists) -->
      <div v-if="importError" class="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
        <span class="text-2xl flex-shrink-0">⚠️</span>
        <div>
          <h3 class="font-bold text-red-900 mb-1">Phát hiện lỗi dữ liệu</h3>
          <p class="text-sm text-red-800 mb-2">
            {{ importError }}
          </p>
          <button
            v-if="errorFileId"
            @click="downloadErrorFile"
            class="text-sm text-red-600 hover:text-red-700 font-bold underline"
          >
            ⬇️ Tải file lỗi
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-center py-6 border-t border-gray-200">
        <button
          type="button"
          class="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
          @click="removeFile"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          :disabled="!selectedFile"
          @click="submitImport"
          class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Xác nhận nhập dữ liệu
        </button>
      </div>
    </main>

    <aside class="w-96 space-y-6">
      <!-- Template File Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <span class="text-4xl">📄</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Tải file mẫu chuẩn</h3>
            <p class="text-sm text-gray-600 mb-4">
              Cần sử dụng đúng định dạng dạng tệp. 
              <a href="#" class="text-blue-600 font-bold">INB_ImportData.xlsx</a>
            </p>
            <button
              @click="getTemplateFile"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center gap-2"
            >
              <span>⬇️</span>
              <span>Tải file mẫu (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      

      <!-- Rules Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="flex items-start gap-3">
          <span class="text-2xl flex-shrink-0">ℹ️</span>
          <div>
            <h3 class="font-bold text-gray-900 mb-3">Quy tắc hệ thống</h3>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-start gap-2">
                <span class="text-blue-600 font-bold flex-shrink-0">•</span>
                <span>Hệ thống áp dụng Rollback toàn bộ nếu có bất kỳ dòng nào bị lỗi.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-600 font-bold flex-shrink-0">•</span>
                <span>Tối đa 100 dòng cho mỗi lần import.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-600 font-bold flex-shrink-0">•</span>
                <span>Định dạng email và tọa độ GPS phải tuân thủ chuẩn quốc tế.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>

    
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  fetchFileTemplate, 
  fetchImportOrders,
  fetchErrorFile, 
  type ImportOrdersResponse } from '../services/importOrderService'
import type { ErrorResponse } from '@/services/error-Response'

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const importError = ref<string>('')
const errorFileId = ref<number | null>(null)

const getTemplateFile = async () => {
  try {
    const response = await fetchFileTemplate()
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'INB_ImportData.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error fetching template file:', error)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files

  if (!files || files.length === 0) return

  processFile(files[0])
}

const processFile = (file: File | undefined) => {
  if (!file) return
  // reset error
  importError.value = ''

  // 1. validate extension
  if (!file.name.toLowerCase().endsWith('.xlsx')) {
    importError.value = 'Chỉ hỗ trợ định dạng file .xlsx'
    selectedFile.value = null
    return
  }

  // 2. validate size (10MB)
  const MAX_SIZE = 10 * 1024 * 1024

  if (file.size > MAX_SIZE) {
    importError.value = 'Dung lượng file không được vượt quá 10MB'
    selectedFile.value = null
    return
  }

  // 3. lưu file
  selectedFile.value = file
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (!target.files || target.files.length === 0) return

  processFile(target.files[0])
}

const removeFile = () => {
  selectedFile.value = null
  importError.value = ''
}

const submitImport = async () => {
  if (!selectedFile.value) return

  try {
    const response = await fetchImportOrders(selectedFile.value)

    const data = response.data

    
    const result : ImportOrdersResponse = data.result
    
    if(result.totalValidRows){
      alert(`Code: ${data.code}\nMessage: ${data.message} with ${result.totalValidRows} valid rows`)
    } else {
      errorFileId.value = result.errorFileId
    }



  } catch (error : ErrorResponse | any) {
    console.error(error)
    alert(error?.message)
  }
}

const downloadErrorFile = async () => {
  if (!errorFileId.value) return

  try {
    const response = await fetchErrorFile(errorFileId.value)

    const blob = new Blob(
      [response],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `INB_Import_Error_${errorFileId.value}.xlsx`

    a.click()

    URL.revokeObjectURL(url)

  } catch (error : ErrorResponse | any) {
    console.error('Download error file failed:', error.message || error)
  }
}
</script>
