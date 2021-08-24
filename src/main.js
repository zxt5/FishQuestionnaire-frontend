import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vuetify from './plugins/vuetify'
import Clipboard from "v-clipboard";
import axios from 'axios';
const echarts = require('echarts');
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Clipboard);
Vue.prototype.$echarts = echarts

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
      next('/notfound') // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
    }
    next() // 如果匹配到正确跳转
})



router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
