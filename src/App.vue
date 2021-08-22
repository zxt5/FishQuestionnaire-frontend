<template>
  <div id="app">
    <Header/>
    <div class="index_swiper">
      <Swiper/>
    </div>
    <transition>
      <router-view v-if="isRouterAlive"/>
    </transition>
    <!--    <el-backtop></el-backtop>-->
  </div>
</template>

<script>
import Swiper from "./views/MidSwiper";
import Header from "./components/Header";

export default {
  name: 'App',
  components: {Header, Swiper},
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return{
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    }
  },
}
</script>

<style>

body{
  /*background-color: whitesmoke;*/
  margin:0;
  padding:0;
  min-width:1400px;
  width:100vw !important;
  overflow-x: hidden;
}
.index_swiper {
  width: 100%;
  min-width: 1200px;
  min-height: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: -5;
}
</style>
