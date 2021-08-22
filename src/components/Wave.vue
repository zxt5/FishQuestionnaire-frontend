<template>
    <div>
    <!-- 波浪区域 -->
        <footer class="wavefooter">
            <!-- svg 形状 -->
            <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <!-- ,,形状容器 -->
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <!-- 组合形状 -->
               <g class="parallax">
                <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(118, 218, 255, 1)" />
                <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(118, 218, 255, 0.5)" />
                <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(118, 218, 255, 0.3)" />
                <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(118, 218, 255, 0.1)" />
              </g>
            </svg>
        </footer>
    </div>
</template>
<script>
export default {
    name:"wave"
}
</script>
<style scoped>
/* 背景相关的样式 */
html, body {
    
    height: 100%;
    position: absolute;
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
.wavefooter{
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: -1;
}
</style>