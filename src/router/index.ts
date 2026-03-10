import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

import OrdersListPage from "../modules/order/pages/OrdersListPage.vue"
import CreateOrderPage from "../modules/order/pages/CreateOrderPage.vue"
import OrderDetailPage from "../modules/order/pages/OrderDetailPage.vue"
import MyWarehousePage from "../modules/order/pages/MyWarehousePage.vue"

import WarehousePage from "../pages/WarehousePage.vue"
import DispatchPage from "../modules/dispatch/pages/DispatchPage.vue"
import { reportRoutes } from "../modules/report/routes/reportRoutes"
import { authRoutes } from "../modules/auth/routes/authRoutes"
import HelloWorldPage from "../pages/HelloWorldPage.vue"

import NotFoundPage from "../pages/NotFoundPage.vue"

const routes: Array<RouteRecordRaw> = [

  
  ...authRoutes,

  {
    path: "/hello",
    name: "Hello",
    component: HelloWorldPage,
    meta: { title: "Hello World" }
  },
  {
    path: "/orders",
    name: "Orders",
    component: OrdersListPage,
    meta: { title: 'Đơn hàng', subtitle: 'Quản lý và theo dõi tất cả đơn hàng' },
  },

  {
    path: "/orders/create",
    name: "CreateOrder",
    component: CreateOrderPage,
    meta: { title: 'Tạo đơn hàng', subtitle: 'Tạo một đơn hàng mới' },
  },

  {
    path: "/orders/:id",
    name: "OrderDetail",
    component: OrderDetailPage,
    meta: { title: 'Chi tiết đơn hàng', subtitle: 'Xem thông tin chi tiết đơn hàng' },
    props: true
  },

  {
    path: "/my-warehouse",
    name: "MyWarehouse",
    meta: { title: 'Kho hàng của tôi', subtitle: 'Quản lý hàng trong kho của bạn' },
    component: MyWarehousePage
  },

  {
    path: "/dispatch",
    name: "Dispatch",
    meta: { title: 'Điều phối đơn', subtitle: 'Phân phối và điều phối đơn hàng' },
    component: DispatchPage
  },

  ...reportRoutes,

  {
    path: "/",
    redirect: "/orders"
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * AUTH GUARD
 */
router.beforeEach((to, from, next) => {

  const token = localStorage.getItem("accessToken")

  if (!token && to.path !== "/login") {
    next("/login")
  } else {
    next()
  }

})

export default router