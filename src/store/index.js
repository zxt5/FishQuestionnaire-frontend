import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    flag: false,
    url: '',
  },
  mutations: {
    flag_true(state){
      state.flag = true
    },
    flag_false(state){
      state.flag = false
    },
    toUrl(state, text){
      state.url = text
    }
  },
  actions: {
  },
  modules: {
  }
})
