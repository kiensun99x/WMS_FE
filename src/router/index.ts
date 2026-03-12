import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

import { orderRoutes } from "../modules/order/routes/orderRoutes"
import MyWarehousePage from "../modules/order/pages/MyWarehousePage.vue"

import WarehousePage from "../pages/WarehousePage.vue"
import DispatchPage from "../modules/order/pages/DispatchPage.vue"
import { reportRoutes } from "../modules/report/routes/reportRoutes"
import { authRoutes } from "../modules/auth/routes/authRoutes"

import NotFoundPage from "../pages/NotFoundPage.vue"

const routes: Array<RouteRecordRaw> = [

  
  ...authRoutes,
  ...orderRoutes,
  ...reportRoutes,
  {
    path: '/',
    redirect: '/orders',
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