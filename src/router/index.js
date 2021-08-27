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
import Search from "../views/Search";
import NotFound from "../views/NotFound";
import Thank from "../views/Thank";
import Welcome from "../views/Welcome";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
    meta: {
      title: '欢迎使用摸鱼问卷',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'注册'
    }
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
          title: '全部问卷',
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
    path: '/check/:text',
    name: 'check',
    component: checkQuestionnaire,
    meta:{
      title:'问卷预览'
    }
  },
  {
    path: '/fill/:text',
    name: 'fill',
    component: FillQuestionnaire,
    meta:{
      title:'问卷填写'
    }
  },
  {
    path: '/edit/:id',
    name: 'Questionnairs',
    component: Questionnairs,
    meta:{
      title:'问卷编辑'
    }
  },
  {
    path: '/charts/:text',
    name: 'Charts',
    component: Charts,
    meta:{
      title:'结果统计'
    }
  },
  {
    path: '/thank/:text',
    name: 'Thank',
    component: Thank,
    meta:{
      title:'填写完成'
    }
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component: NotFound,
    meta:{
      title:'找不到页面'
    }
  },
// {
//   path: '/search',
//   name: 'Search',
//   component: Search,
// },
  {
    path:'/search/:text',
    name: 'SearchResult',
    component: Search,
    meta: {
      title: '搜索结果'
    }
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

// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }

export default router
