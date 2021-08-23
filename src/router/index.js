import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login"
import Register from "../views/Register";
import Index from "../views/Index"
import Questionnaire from "../components/Questionnaire"
import RecycleBin from "../components/RecycleBin";
import checkQuestionnaire from "../views/checkQuestionnaire";
import FillQuestionnaire from "../views/FillQuestionnaire";
import Questionnairs from "../views/Questionnairs";
import Charts from "../views/Charts";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '',
        name: 'Questionnaire',
        component: Questionnaire,
        meta: {
          title: '摸鱼问卷',
        }
      },
    ]
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
        path: '',
        name: 'Questionnaire',
        component: Questionnaire,
        meta: {
          title: '全部问卷',
        }
      },
      {
        path: '/questionnaires',
        name: 'Questionnaire',
        component: Questionnaire,
        meta: {
          title: '创建问卷',
        }
      },
      {
        path: '/recycle',
        name: 'RecycleBin',
        component: RecycleBin,
        meta: {
          title: '回收站',
        }
      },
    ]
  },
  {
    path: '/check/:id',
    name: 'check',
    component: checkQuestionnaire
  },
  {
    path: '/fill/:id',
    name: 'fill',
    component: FillQuestionnaire
  },
  {
    path: '/questionnairs/:id',
    name: 'Questionnairs',
    component: Questionnairs,
    meta:{
      title:'创建问卷'
    }
  },
  {
    path: '/charts',
    name: 'Charts',
    component: Charts
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
