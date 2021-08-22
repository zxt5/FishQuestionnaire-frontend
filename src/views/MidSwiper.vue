<template>
  <ul class="main-swiper">
    <li class="swiper-item" v-for="(item,index) in bannerList" :key="item.id" :class="{isShow:index === isShowBg}">
      <img class="bg-item" :src="item.url" alt="">
    </li>
  </ul>
</template>

<script>
export default {
  name: "Swiper",
  data() {
    return {
      bannerList: [
        {
          id:0,
          url:"https://z3.ax1x.com/2021/06/17/2jnzin.jpg",
        },
        {
          id:1,
          url:"https://z3.ax1x.com/2021/06/17/2juuz6.jpg",
        },
        {
          id:2,
          url:"https://z3.ax1x.com/2021/06/17/2ju6Fs.jpg",
        },
        {
          id:3,
          url:"https://z3.ax1x.com/2021/06/17/2juLSx.jpg",
        },
        {
          id:4,
          url:"https://z3.ax1x.com/2021/06/17/2juHYR.jpg",
        },
        {
          id:5,
          url:"https://z3.ax1x.com/2021/06/17/2jKZnS.jpg",
        }
      ],
      isShowBg: 0,
      count:0.01,
      timeId:null,
    };
  },
  mounted(){
    this.bgSwiper()
  },
  methods:{
    bgSwiper(){
      this.timeId = setInterval(()=>{
        if(this.isShowBg < this.bannerList.length - 1){
          this.isShowBg ++
        }else{
          this.isShowBg = 0
        }
      },6000)
    }
  },
  beforeDestroy(){
    clearInterval(this.timeId)
    this.timeId = null
  }
};
</script>

<style scoped lang='less'>
.main-swiper{
  width: 100%;
  height: 100%;
  position: relative;
  .swiper-item{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition-duration:.8s;
    transition-timing-function: ease-in-out;
    .bg-item{
      width: 100%;
      height: 100%;
    }
  }
}
.isShow{
  opacity: .7 !important;
}
</style>
