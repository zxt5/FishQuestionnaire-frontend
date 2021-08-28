<template>
  <div>
    <div class="questionnaire">
      <div v-if="info.type === 'vote'">
        <h1 class="title"> 投票结果:</h1>
<!--        <p v-if="flag">hhhhh</p>-->
        <div v-for="(item, index) in info.question_list" :key="index" style="margin-top:30px;padding-left: 10px">

          <div v-if="(item.type==='single-choice' || item.type==='multiple-choice') && item.is_show_result">

            <div style="padding-left: 30px;margin-bottom: 15px;">
              <h3>{{ (index+1) + '. ' + item.title}}</h3>
            </div>
            <!--          循环选项-->
            <div v-for="optionItem in item.option_list" style="margin-top: 4px;">

              <div style="float: left;padding-left: 55px; min-width: 550px;max-width: 630px;color: darkblue">
                <span>{{optionItem.title}}</span>
              </div>

              <div style="margin-left: 400px;">
                <span style="color: red">{{optionItem.answer_num}}票({{optionItem.percent_string}})</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      <h1 class="title">感谢填写!</h1>
      <el-result icon="success" title="成功提示" subTitle="请根据提示进行操作">
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
import {Base64} from "js-base64";

export default {
  name: "Thank",
  components: {},
  data(){
    return {
      info: '',
      flag: true,
    }
  },
  mounted() {
    const that = this;
    let s1 = that.$route.params.text;
    s1 = Base64.decode(s1);
    s1 = s1.substring(4,s1.length - 7);
    axios
        .get('/api/questionnaire/' + parseInt(s1))
        .then(function (response){
          that.info = response.data;
          that.htmlTitle = response.data.title;
        })
        .catch(function (error){
          that.$notify.error({
            title: '好像发生了什么错误',
            message: error.message
          })
        })
  },
  methods: {
    click(){
      this.$router.push({path: '/'});
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
  /*letter-spacing: 3em;*/
  /*text-indent: 2em;*/
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