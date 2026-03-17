import type { OrderHistoryItem } from './OrderHistoryItem';


export interface OrderHistoryResponse {
  orderId: number;
  histories: OrderHistoryItem[];
}
