// 🎨 Lấy CSS class cho status badge (để hiển thị màu)
// VD: 'NEW' -> blue badge, 'DELIVERED' -> green badge
const classes: Record<string, string> = {
    NEW: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800',
    STORED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800',
    DELIVERED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800',
    FAILED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800',
    RETURNED: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800',
  };

export const getStatusClass = (status: string) => {
  return classes[status] || '';
};