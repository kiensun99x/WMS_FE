import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

import OrdersListPage from "../modules/order/pages/OrdersListPage.vue"
import CreateOrderPage from "../modules/order/pages/CreateOrderPage.vue"
import OrderDetailPage from "../modules/order/pages/OrderDetailPage.vue"

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
    meta: { title: "Đơn hàng" }
  },

  {
    path: "/orders/create",
    name: "CreateOrder",
    component: CreateOrderPage,
    meta: { title: "Tạo đơn hàng" }
  },

  {
    path: "/orders/:id",
    name: "OrderDetail",
    component: OrderDetailPage,
    props: true
  },

  {
    path: "/warehouse",
    name: "Warehouse",
    component: WarehousePage
  },

  {
    path: "/dispatch",
    name: "Dispatch",
    component: DispatchPage
  },

  ...reportRoutes,

  {
    path: "/",
    redirect: "/hello"
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