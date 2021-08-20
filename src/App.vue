<template>
  <div id="app">
    <Header/>
    <transition>
      <router-view v-if="isRouterAlive"/>
    </transition>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  name: 'App',
  components: {Header},
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
</style>
