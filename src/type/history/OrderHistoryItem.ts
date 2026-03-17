import type { Order } from '../order/Order';


export interface OrderHistoryItem {
  userId: number;
  failureReason: string | null;
  actorType: string;
  occurredAt: string;
  fromStatus: Order['status'];
  toStatus: Order['status'];
}
