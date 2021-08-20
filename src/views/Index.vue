<template>
  <div>
    <el-container class="main">
      <el-container>
        <el-aside width="300px" style="height: fit-content">
          侧边栏
        </el-aside>
        <el-main style="height: fit-content">
          <router-view/>
          列表视图
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import Header from "../components/Header";
export default {
  name: "Index",
  components: {Header},
  // mounted(){
  //   this.init();
  //   var documentHeight = 0;
  //   $("aside").css({
  //     marginTop: 0
  //   });
  //   var topPadding = 15;
  //   $(function() {
  //     var offset = $("aside").offset();
  //     documentHeight = $(document).height();
  //     $(window).off('scroll');
  //     $(window).scroll(function() {
  //       var sideBarHeight = $("aside").height();
  //       if($("aside").height() >= $("main").height()){
  //         return;
  //       }
  //       if($(window).height() <= $("aside").height()+topPadding){
  //         if ($(window).scrollTop()+$(window).height() > offset.top+$("aside").height()) {
  //           var newPosition = ($(window).scrollTop() - offset.top + $(window).height() - $("aside").height()) - 50;
  //           if(newPosition > $("main").height() + topPadding  - $(window).height() + 60){
  //             let p = $("main").height() + topPadding  - $(window).height() + 60;
  //             $("aside").stop().animate({
  //               marginTop: p
  //             });
  //           }
  //           else{
  //             $("aside").stop().animate({
  //               marginTop: newPosition
  //             });
  //           }
  //         }
  //         else {
  //           $("aside").stop().animate({
  //             marginTop: 0
  //           });
  //         };
  //       }
  //       else{
  //         if($(window).scrollTop()>offset.top){
  //           var newPosition = ($(window).scrollTop() - offset.top) + topPadding + 60;
  //           $("aside").stop().animate({
  //             marginTop: newPosition
  //           });
  //         }
  //         else {
  //           $("aside").stop().animate({
  //             marginTop: 0
  //           });
  //         }
  //       }
  //     });
  //   });
  // },
}
</script>

<style scoped>
@import url("../assets/common.css");

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
  /*padding-top: 50px;*/
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>
