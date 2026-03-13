// 🏷️ Chuyển đổi status code thành label tiếng Việt (để hiển thị)
// VD: 'NEW' -> 'Mới', 'DELIVERED' -> 'Đã giao'
const labels: Record<string, string> = {
    NEW: 'Mới',
    STORED: 'Lưu kho',
    DELIVERED: 'Đã giao',
    FAILED: 'Giao thất bại',
    RETURNED: 'Trả hàng'
  };

export const getStatusLabel = (status: string) => {
  return labels[status] || status;
};