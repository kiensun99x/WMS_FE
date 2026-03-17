import type { Order } from './Order';


export interface OrderPageResponse {
  content: Order[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
