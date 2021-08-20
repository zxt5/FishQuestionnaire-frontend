<template>
<div >
      <!-- 头部盒子 -->
        <el-container class="main">
          <el-container>
            <el-aside width="300px" style="height: fit-content">
              侧边栏
            </el-aside>
            <el-main style="height: fit-content">
              <router-view></router-view>
              列表视图
            </el-main>
          </el-container>
        </el-container>
        <!-- 波浪区域 -->
        <div>
            <!-- svg 形状 -->
            <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <!-- 形状容器 -->
                <defs>
                    <path id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <!-- 组合形状 -->
               <g class="parallax">
                <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(118, 218, 255, 1)" />
                <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(118, 218, 255, 0.5)" />
                <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(118, 218, 255, 0.3)" />
                <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(118, 218, 255, 0.1)" />
              </g>
            </svg>
        </div>
        <div class="test">最底部</div>
</div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "Index",
  components: {Header},
  mounted(){
    this.init();
    var documentHeight = 0;
    $("aside").css({
      marginTop: 0
    });
    var topPadding = 15;
    $(function() {
      var offset = $("aside").offset();
      documentHeight = $(document).height();
      $(window).off('scroll');
      $(window).scroll(function() {
        var sideBarHeight = $("aside").height();
        if($("aside").height() >= $("main").height()){
          return;
        }
        if($(window).height() <= $("aside").height()+topPadding){
          if ($(window).scrollTop()+$(window).height() > offset.top+$("aside").height()) {
            var newPosition = ($(window).scrollTop() - offset.top + $(window).height() - $("aside").height()) - 50;
            if(newPosition > $("main").height() + topPadding  - $(window).height() + 60){
              let p = $("main").height() + topPadding  - $(window).height() + 60;
              $("aside").stop().animate({
                marginTop: p
              });
            }
            else{
              $("aside").stop().animate({
                marginTop: newPosition
              });
            }
          }
          else {
            $("aside").stop().animate({
              marginTop: 0
            });
          };
        }
        else{
          if($(window).scrollTop()>offset.top){
            var newPosition = ($(window).scrollTop() - offset.top) + topPadding + 60;
            $("aside").stop().animate({
              marginTop: newPosition
            });
          }
          else {
            $("aside").stop().animate({
              marginTop: 0
            });
          }
        }
      });
    });
  },
}
</script>


<style scoped>


.main{
  width: 1500px;
  margin: 40px auto auto;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 360px;
  height: 80%;
  /*padding-top: 50px;*/
}


.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

html, body {
    margin: 0;
    height: 100%;
    bottom: 0;
}
h1 {
    font-family: 'Lato','sans-serif';
    font-weight: 300;
    /* font-spacing:2px; */
    font-size: 48px;
}
.waves {
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: 0px;
    /* 最小值 */
    min-height: 10px;
    /* 最大值 */
    max-height: 150px;
}
.parallax>use {
    animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
}
/* 选择的一个use */
.parallax>use:nth-child(1) {
    /* 延迟 2s 执行 */
    animation-delay: -2s;
    /* 7s 内 执行完毕 */
    animation-duration: 7s;
}
.parallax>use:nth-child(2) {
      animation-delay: -3s;
      animation-duration: 10s;
}
.parallax>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}
.parallax>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}
/* 动画 */
@keyframes move-forever {
    0% {
        transform: translate3d(-90px,0,0);
    }
    100% {
        transform: translate3d(85px,0,0);
    }
}
</style>
