import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import OrdersListPage from '../modules/order/pages/OrdersListPage.vue';
import CreateOrderPage from '../modules/order/pages/CreateOrderPage.vue';
import OrderDetailPage from '../modules/order/pages/OrderDetailPage.vue';
import WarehousePage from '../pages/WarehousePage.vue';
import DispatchPage from '../modules/dispatch/pages/DispatchPage.vue';
import ReportsPage from '../modules/report/pages/ReportsPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: () => import('../pages/DashboardPage.vue'),
  //   meta: { title: 'Dashboard', subtitle: 'Xem tổng quan về kho hàng' },
  // },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersListPage,
    meta: { title: 'Đơn hàng', subtitle: 'Quản lý và theo dõi tất cả đơn hàng' },
  },
  {
    path: '/orders/create',
    name: 'CreateOrder',
    component: CreateOrderPage,
    meta: { title: 'Tạo đơn hàng', subtitle: 'Tạo một đơn hàng mới' },

  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetailPage,
    meta: { title: 'Chi tiết đơn hàng', subtitle: 'Xem thông tin chi tiết đơn hàng' },
    props: true,
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: WarehousePage,
    meta: { title: 'Kho hàng của tôi', subtitle: 'Quản lý hàng trong  kho' },
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: DispatchPage,
    meta: { title: 'Điều phối đơn', subtitle: 'Phân phối và điều phối đơn hàng' },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsPage,
    meta: { title: 'Báo cáo', subtitle: 'Xem báo cáo và thống kê' },
  },
  {
    path: '/',
    redirect: '/orders',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;