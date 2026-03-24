import type { RouteRecordRaw } from "vue-router"
import ReportsPage from "@/pages/report/ReportsPage.vue"

export const reportRoutes: RouteRecordRaw[] = [
  {
    path: "/reports",
    name: "Reports",
    component: ReportsPage,
    meta: { title: "Báo cáo" }
  }
]
