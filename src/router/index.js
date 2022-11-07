import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import MenuView from '../views/MenuView.vue'
import CurrentStockList from '../views/CurrentStockList.vue'
import BuyRequestOutList from '../views/BuyRequestOutList.vue'
import ApprovallistX from '../views/ApprovallistX.vue'
import EmpInquiry from '../views/Emp-inquiry.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MenuView
  },
  {
    path: '/CurrentStockList',
    name: 'CurrentStockList',
    component: CurrentStockList
  },
  {
    path: '/BuyRequestOutList',
    name: 'BuyRequestOutList',
    component: BuyRequestOutList
  },
  {
    path: '/ApprovallistX',
    name: 'ApprovallistX',
    component: ApprovallistX
  },
  {
    path: '/EmpInquiry',
    name: 'EmpInquiry',
    component: EmpInquiry
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
