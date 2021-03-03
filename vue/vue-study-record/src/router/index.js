import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/homework',
    name: 'Homework',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Homework.vue')
  },
  {
    path:"/shopping",
    name:'shopping',
    component:()=>import('../views/Shopping')
  }
]

const router = new VueRouter({
  routes
})

export default router
