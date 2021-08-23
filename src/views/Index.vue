<template>
  <div>
    <el-container class="main">
      <el-container>
        <el-aside width="23%" style="height: fit-content;">

          <el-container class="class">
            <div @click="add()" style="margin-left: 0px">
              <el-button class="button" circle>
                <i class="el-icon-edit"></i>
              </el-button>
              <h4>创建问卷</h4>
            </div>
          </el-container>

          <el-menu
              router
              :default-active="$route.path"
              class="el-menu-vertical-demo">
            <el-menu-item index="/questionnaires" @click="toQuestionnaire()">
              <i class="el-icon-document"></i>
              <span slot="title">个人问卷</span>
            </el-menu-item>
            <el-menu-item index="/recycle" @click="toRecycleBin()">
              <i class="el-icon-delete"></i>
              <span slot="title">回收站</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>

    <!--添加问卷弹窗-->
    <el-dialog title="创建问卷" :visible.sync="dialog" :close-on-click-modal="false" class="dialog">
      <el-form ref="form" :model="initQ" label-width="80px">
        <el-form-item label="问卷标题" style="width: 100%;" required>
          <el-input v-model="initQ.title" placeholder="请输入问卷标题" ></el-input>
        </el-form-item>
        <el-form-item label="问卷描述" style="width: 100%;">
          <el-input v-model="initQ.content" type="textarea" placeholder="请输入问卷描述" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%;text-align: right">
        <el-button style="margin-left: 10px;" @click="dialog=false">取消</el-button>
        <el-button type="primary" style="margin-left: 10px;" @click="addQ()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Header from "../components/Header";
import Questionnaire from "../components/Questionnaire";
import RecycleBin from "../components/RecycleBin";
import axios from "axios";
import authorization from "@/utils/authorization";
export default {
  name: "Index",
  components: {Questionnaire, Header},
  data() {
    return {
      info: {},
      avatar: null,
      name: '',
      content: '',
      uid: 0,
      identity: localStorage.getItem('identity.myblog'),
      dialog: false,
      initQ:{
        id:0,
        title:'',
        flag:0,
        content:'求求各位姥爷填一下小的问卷吧',
      },
    }
  },
  methods: {
    toBook(){
      this.$router.push({path: '/book'});
    },
    editQues(){
      this.$router.push({path: '/questionnairs'});
    },
    toGroupIndex(){
      this.$router.push({path: '/group/index'});
    },
    toDiscuss(){
      this.$router.push({path: '/group/discuss'});
    },
    toQuestionnaire(){
      this.$router.push({path: '/questionnaires'})
      console.log(this.$route.path);
    },
    toRecycleBin(){
      this.$router.push({path: '/recycle'})
    },
    add(){
      this.dialog = true;
      this.initQ ={
        id:0,
        title:'',
        flag:0,
        content:'求求各位姥爷填一下小的问卷吧',
      };
    },
    addQ(){
      if (this.initQ.title === ''){
        this.$message({
          type: 'error',
          message: '标题不能为空'
        });
        return;
      }
      const that = this;
      authorization()
          .then(function (response) {
            if(response[0]){
              axios
                  .post('api/questionnaire/',{
                    title : that.initQ.title,
                    content : that.initQ.content,
                  }, {
                    headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
                  })
                  .then(function (response){
                    console.log(response.data);
                    that.dialog=false;
                    that.$router.push({path: '/questionnairs/' + response.data.id});
                  }).catch(function (error){
                that.dialog=false;
                that.$notify.error({
                  title: '出错啦',
                  message: '创建问卷失败',
                })
              })
            }
            else {
              that.dialog=false;
              that.$notify.error({
                title: '创建问卷失败',
                message: '请先登录！'
              })
            }
          })

    },

  },
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
  width: 80%;
  margin: 40px auto 40px;
}

.el-icon-reading, .el-icon-edit{
  font-size: 30px;
}

.button {
  background-image: linear-gradient(to right, #0250c5, #d43f8d);
  color: white;
  opacity: 0.6;
  height: 60px;
  width: 60px;
  margin: 10px;
  /*border-radius : 50%;*/
}

.button:hover{
  background-color: #d43f8d;
}

.el-aside{
  background-color:transparent;
  color: #333;
  padding-top:0 !important;
  padding-bottom:30px;
}

.el-main {
  background-color: transparent;
  margin: 0 20px 0;
  border-radius: 15px;
  opacity: 1;
  color: #333;
  height: fit-content;
  padding-top: 0 !important;
  padding-bottom: 0;
}

.el-button--mini, .el-button--small {
  font-size: 20px !important;
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

.class {
  background-color: white;
  /*opacity: 0.9;*/
  border-radius: 10px;
  padding: 25px 10px 20px;
  text-align: center;
  justify-content: center;
}

.el-icon-reading, .el-icon-edit{
  font-size: 30px;
}

.el-menu {
  padding-top: 10px;
  margin-top: 10px !important;
  border-radius: 10px;
  padding-bottom: 10px;
}
.el-card {
  border-radius: 10px;
}

.el-aside {
  background-color: transparent;
  color: #333;
  padding-top:0 !important;
  padding-bottom:30px;
  /*border-radius: 15px;*/
  opacity: 0.9;
  /*line-height: 200px;*/
}
.el-main {
  /*background-color: black;*/
  margin: 0 20px 0;
  border-radius: 10px;
  opacity: 1;
  color: #333;
  height: fit-content;
  padding-top: 0 !important;
  padding-bottom: 0;
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
