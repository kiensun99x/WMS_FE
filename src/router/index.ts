import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

import { orderRoutes } from "./order/orderRoutes"
import { reportRoutes } from "./report/reportRoutes"
import { authRoutes } from "./auth/authRoutes"

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