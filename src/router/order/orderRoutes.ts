import type { RouteRecordRaw } from "vue-router"
import OrdersListPage from "@/pages/order/OrdersListPage.vue"
import CreateOrderHeader from "@/pages/createOrder/CreateOrderHeader.vue"
import OrderDetailPage from "@/pages/orderDetail/OrderDetailPage.vue"
import MyWarehousePage from "@/pages/warehouse/MyWarehousePage.vue"
import DispatchPage from "@/pages/dispatch/DispatchPage.vue"

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: "/orders",
    name: "Orders",
    component: OrdersListPage,
    meta: { title: "Đơn hàng", subtitle: "Toàn bộ đơn hàng trong hệ thống" }
  },
  {
    path: "/orders/create",
    name: "CreateOrder",
    component: CreateOrderHeader,
    meta: { title: "Tạo đơn hàng", subtitle: "Tạo một đơn hàng mới" }
  },
  {
    path: "/orders/:id",
    name: "OrderDetail",
    component: OrderDetailPage,
    props: true,
    meta: { title: "Chi tiết đơn hàng", subtitle: "Xem thông tin chi tiết đơn hàng" }
  },
  {
    path: '/my-warehouse',
    name: 'Warehouse',
    component: MyWarehousePage,
    meta: { title: 'Kho hàng của tôi', subtitle: 'Quản lý hàng trong  kho' },
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: DispatchPage,
    meta: { title: 'Danh sách các đơn hàng ', subtitle: 'Phân phối và điều phối đơn hàng mới đến kho chỉ định' },
  }
]
