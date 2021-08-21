import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login"
import Register from "../views/Register";
import Index from "../views/Index"
import Questionnaire from "../components/Questionnaire"
import RecycleBin from "../components/RecycleBin";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    children: [
      {
        path: 'questionnaires',
        name: 'Questionnaire',
        component: Questionnaire,
        meta: {
          title: '全部问卷',
        }
      },
      {
        path: 'recycle',
        name: 'RecycleBin',
        component: RecycleBin,
        meta: {
          title: '回收站',
        }
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
