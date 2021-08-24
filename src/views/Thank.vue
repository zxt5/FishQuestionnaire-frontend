<template>
  <div>
    <div class="questionnaire">
      <!--标题-->

      <h1 class="title">感谢填写！</h1>
      <el-result icon="success" title="成功提示" subTitle="请根据提示进行操作">
<!--        <template slot="extra">-->
<!--          <el-button type="primary" size="medium">返回</el-button>-->
<!--        </template>-->
      </el-result>
      <div class="content">&nbsp;问卷到此结束，感谢您的参与！</div>
      <div class="line"></div>
      <!--内容结束-->

      <el-button type="primary" @click="click">确定</el-button>

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

.content {
  text-align: center;
  font-size: 15px;
  color: #555555;
  margin: 20px auto 50px;
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
  margin-left: 30px;
  margin-right: 30px;
  color: #3F87DA;
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

.title{
  text-align: center;
  padding-top: 40px;
  padding-bottom: 15px;
}

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