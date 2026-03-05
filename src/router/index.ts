import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: () => import('../pages/DashboardPage.vue'),
  //   meta: { title: 'Dashboard' },
  // },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/orders/OrdersListPage.vue'),
    meta: { title: 'Đơn hàng' },
  },
  {
    path: '/orders/create',
    name: 'CreateOrder',
    component: () => import('../pages/orders/CreateOrderPage.vue'),
    meta: { title: 'Tạo đơn hàng' },

  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('../pages/orders/OrderDetailPage.vue'),
    meta: { title: 'Chi tiết đơn hàng' },
    props: true,
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('../pages/WarehousePage.vue'),
    meta: { title: 'Kho hàng của tôi' },
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: () => import('../pages/dispatch/DispatchPage.vue'),
    meta: { title: 'Điều phối đơn' },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../pages/reports/ReportsPage.vue'),
    meta: { title: 'Báo cáo' },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;