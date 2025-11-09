import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import User from '@/views/User/ViewUser.vue'
import ProductDetails from '@/views/Product/ProductDetails.vue'
import UserProfile from '@/views/User/UserProfile.vue'
import UserOrders from '@/views/User/UserOrders.vue'
import UserHistory from '@/views/User/UserHistory.vue'
import ListProduct from '@/views/manage-view/list-product.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import CustomerLayout from '@/layout/CustomerLayout.vue'
import ListEmployee from '@/views/manage-view/list-employee.vue'
import EmployeeDetails from '@/views/manage-view/employee-details.vue'
import ProductDetailRow from '@/views/manage-view/product-detail-row.vue'
import ProductAdd from '@/views/manage-view/product-add.vue'
import EmployeeAdd from '@/views/manage-view/employee-add.vue'
import Schedule from '@/views/employee/schedule.vue'
import BookingRepair from '@/views/Booking/BookingRepair.vue'
import UserCart from '@/views/Product/user-cart.vue'
import Order from '@/views/Product/Order.vue'
import Arange from '@/views/employee/Arange.vue'

//-----------------------------------------------------------------
//-----------------------------------------------------------------
const customerRoutes = [
  {
    path: '/',
    component: CustomerLayout, // Sử dụng layout cho customer
    children: [
      { path: '', component: Home }, // Home page
      { path: '/login', component: Login }, // Login page
      {
        path: '/user',
        component: User,
        children: [
          { path: 'promotion', component: UserProfile },
          { path: 'history', component: UserHistory },
          { path: 'profile/my-info', component: UserProfile },
          { path: 'order', component: UserOrders },
          { path: 'cart', component: UserCart },
          { path: 'booking', component: BookingRepair },
        ],
      },
      { path: '/product-detail/:productId', component: ProductDetails },
    ],
  },
]

//-----------------------------------------------------------------
//-----------------------------------------------------------------
const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'product/list', component: ListProduct },
      { path: 'employee', component: ListEmployee },
      { path: 'employee/details', component: EmployeeDetails },
      { path: 'employee/add', component: EmployeeAdd },
      { path: 'product/details', component: ProductDetailRow },
      { path: 'product/add', component: ProductAdd },
      { path: 'product/order', component: Order },
      { path: 'employee/arange', component: Arange },
    ],
  },
]

//-----------------------------------------------------------------
//-----------------------------------------------------------------
const employeeRoutes = [
  {
    path: '/employee',
    children: [
      { path: 'schedule', component: Schedule },
      { path: 'profile', component: UserProfile },
      { path: 'history', component: UserHistory },
    ],
  },
]

const routes = [...customerRoutes, ...adminRoutes, ...employeeRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
