<template>
  <div>
    <div class="questionnaire">
      <!--标题-->
      <h1 class="notFound" >404</h1>
      <div class="content">&nbsp;</div>
      <div class="line"></div>
      <h1 class="content">找不到页面</h1>
      <!--内容结束-->

<!--      <el-button type="primary" @click="click">首页</el-button>-->

    </div>
  </div>

</template>

<script>
import authorization from "../utils/authorization";
import axios from "axios";

export default {
  name: "Thank",
  components: {},
  data(){
    return {

    }
  },
  mounted() {

  },
  methods: {
    click(){
      this.$router.push({path: '/index'});
    },
  }
}
</script>



<style scoped>

.title{
  text-align: center;
  padding-top: 40px;
  padding-bottom: 15px;
}
.content {
  /*text-align: center;*/
  font-size: 20px;
  /*color: #555555;*/
  margin: 5px 40px 6px;
  text-align: center;
  /*text-indent:1em;*/
}
p {
  line-height: 20px;
  font-size: 18px;
}

.questionTitle {
  padding-bottom: 5px;
}
.choice {
  padding-left: 15px;
}

.questionnaire{
  /*background-color: #ffffff;*/
  /*border-radius: 10px;*/
  /*margin: 20px auto;*/
  /*max-width: 1000px;*/
  /*min-width: 1000px;*/
  background-color: #fff;
  width: 50%;
  margin: 40px auto;
  border-radius: 15px;
  opacity: 1;
  height: fit-content;
  padding-top: 10px !important;
  box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.line{
  /*width: 90%;*/
  height: 1px;
  border-top: solid 2px;
  margin: 20px 30px 20px;
  color: #3F87DA;
}
.notFound{
  text-align: center !important;
  color: #aaa;
  line-height: 200px;
  font-size: 100px;
  background-color: #fff;
  width: 100%;
  border-radius: 15px;
  margin: 0 0 10px;
  position: relative;
  box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
}
.question_block {
  margin-top: 20px;
  padding-left: 40px;
  padding-right: 40px;
}

.el-button{
  width: 20%;
  /*color: white;*/
  display: flex;
  justify-content: center;
  background-image: linear-gradient(to right, #0250c5, #3F87DA);
  text-align: center;
  margin: 20px auto !important;
  height: 40px;
  letter-spacing: 3em;
  text-indent: 2em;
}

.el-button:hover{
  background-color: #3F87DA;
}

h4{
  /*display: inline-block;*/
  text-align: center;
  line-height: 60px;
}

.reminder{
  background-color: #3F87DA;
  opacity: 0.7;
  margin-left: 0;
  margin-right: 0;
  height: 60px;
  overflow: hidden;
}

/*.not_found{*/
/*  text-align: center;*/
/*  padding-top: 40px;*/
/*  padding-bottom: 15px;*/
/*}*/

.button_back{
  float: right;
  margin-right: 50px;
  margin-top: 10px;
  border-radius: 10px;
}
</style>

<style>
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
  margin-bottom: 8px;
}

.container{
  padding-left: 0 !important;
}

.v-messages{
  min-height: 0 !important;
}
</style>