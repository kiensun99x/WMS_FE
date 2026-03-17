
export interface Order {
  id: number;
  code: string;
  createdAt: string;
  status: 'NEW' | 'STORED' | 'DELIVERED' | 'FAILED' | 'RETURNED';
  statusCode: number;
  failedDeliveryCount: number;
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
  supplierAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  warehouseId: number | null;
  warehouseCode: string | null;
  warehouseName: string | null;
}
