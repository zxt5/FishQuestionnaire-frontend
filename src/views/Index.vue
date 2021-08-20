<template>
<div >
      <!--主题内容区域-->
        <el-container class="main">
          <el-container>
            <!--侧边栏区域-->
            <el-aside>
              <div class="aside-top">
                <span> 题型选择 </span>
              </div>
              <el-menu 
                background-color="#fff"
                text-color="#18927B"
                active-text-color="#000"
              >
              <!--一级菜单-->
              <el-submenu v-for="item in menuList" :key="item.type" :index="item.type">
                <template slot="title">
                  <span>{{item.name}}</span>
                </template>
                  <!--二级菜单-->
                  <el-menu-item v-for="subItem in item.children" :key="subItem.type" :index="subItem.type">
                     <template slot="title">
                      <span>{{subItem.name}}</span>
                     </template>
                  </el-menu-item>
              </el-submenu>
              
            </el-menu>
            </el-aside>
            <el-main style="height: fit-content">
              <router-view></router-view>
              列表视图
            </el-main>
          </el-container>
        </el-container>
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
  data(){
    return {
      menuList:[
        {
          name: "选择题",
          type: "choice",
          children:[
            {
              name: "单选题",
              type: "single-choice",
            },
            {
              name: "多选题",
              type: "mutiple-choice",
            }
          ]
        },
        {
          name: "填空题",
          type: "completion",
          children:[
            {
            name: "单项填空",
            type: "single-completion"
            }
          ]
        }
      ]
    }
  },
}
</script>


<style scoped>

.aside-top{
  text-align: center;
  margin-bottom: 5pt;
  font-size: 14pt;
  font: bolder;
}

.main{
  width: 90%;
  padding-left: 10%;
  align-items: center;
  margin-top: 20pt; 
}

.el-aside {
  background-color: #D3DCE6;
  text-align: center;
  margin-top: 0%;
  padding-top: 10pt;
  border-radius: 3%;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 360px;
  height: 80%;
  border-radius: 10px;
  margin-left: 15pt;
  /*padding-top: 50px;*/
}

.el-menu{
  position: relative;
  top: 0;
  width: 100%;
  border-right: none;
}

/* 背景相关的样式 */

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
.wavefooter{
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
