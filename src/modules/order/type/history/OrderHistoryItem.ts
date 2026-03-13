import type { Order } from '../order/Order';


export interface OrderHistoryItem {
  userId: number;
  failureReasonId: number | null;
  actorType: string;
  occurredAt: string;
  fromStatus: Order['status'];
  toStatus: Order['status'];
}
