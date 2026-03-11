import type { RouteRecordRaw } from "vue-router"
import OrdersListPage from "../pages/OrdersListPage.vue"
import CreateOrderPage from "../pages/CreateOrderPage.vue"
import OrderDetailPage from "../pages/OrderDetailPage.vue"

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: "/orders",
    name: "Orders",
    component: OrdersListPage,
    meta: { title: "Đơn hàng" }
  },
  {
    path: "/orders/create",
    name: "CreateOrder",
    component: CreateOrderPage,
    meta: { title: "Tạo đơn hàng", subtitle: "Tạo một đơn hàng mới" }
  },
  {
    path: "/orders/:id",
    name: "OrderDetail",
    component: OrderDetailPage,
    props: true,
    meta: { title: "Chi tiết đơn hàng", subtitle: "Xem thông tin chi tiết đơn hàng" }
  }
]
