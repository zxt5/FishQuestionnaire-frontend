<template>
  <div>
    <div class="reminder">
      <h4>摸小鱼温馨提示：只能预览，不能提交哦~</h4>
    </div>
    <el-button @click="getPdf()"> 导出PDF</el-button>
    <div class="questionnaire" id="pdfDom">
      <!--标题-->
      <h1 class="title">{{info.title}}</h1>
      <div class="content">&nbsp;{{info.content}}</div>
<!--      <div class="line"></div>-->
      <el-divider/>
      <div class="question_block" v-for="(item, index) in info.question_list" :key="index">
        <div slot="header">
          <div class="questionTitle">
            <!--显示必填标识-->
            <span v-if="info.is_show_question_num">{{(index+1)+'. '}}</span>
            {{item.title}}
          <span style="color: #F56C6C;">
            <span v-if="item.is_must_answer">*</span>
          </span>
            <span style="color: lightgrey" v-if="item.type==='single-choice'">[单选题]</span>
            <span style="color: lightgrey" v-if="item.type==='multiple-choice'">[多选题]</span>
            <span style="color: lightgrey" v-if="item.type==='completion'">[填空题]</span>
            <span style="color: lightgrey" v-if="item.type==='scoring'">[评分题]（默认评分0）</span>
          </div>
        </div>
        <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 5px">
          {{item.content}}
        </div>

        <!--单选题展示-->
        <v-app class="choice" v-if="item.type==='single-choice'">
          <v-container
              class="px-0"
              fluid
          >
            <v-radio-group v-model="item.answer">
              <v-radio
                  v-for="optionItem in item.option_list"
                  :key="optionItem.id"
                  :label="optionItem.title"
              ></v-radio>
            </v-radio-group>
          </v-container>
        </v-app>

        <!--多选题展示-->
        <!--        <el-checkbox-group v-if="item.type==='multiple-choice'" v-model="answer_list[index]" onload>-->
        <!--          <div class="multiple_choice"  v-for="optionItem in item.option_list">-->
        <!--            <el-checkbox :label="optionItem.ordering" style="margin: 5px;">{{ optionItem.title }}{{optionItem.content}}</el-checkbox>-->
        <!--          </div>-->
        <!--        </el-checkbox-group>-->
        <v-app class="choice" v-if="item.type==='multiple-choice'">
          <v-container fluid>
            <v-checkbox
                v-for="optionItem in item.option_list"
                :key="optionItem.id"
                :label="optionItem.title"
                v-model="optionItem.is_answer_choice"
                hide-details
            ></v-checkbox>
          </v-container>
        </v-app>

        <!--填空题展示-->
        <!--        <el-input style="padding-left: 12px; padding-top: 5px; width: 98%"-->
        <!--                  placeholder="请在此输入答案~"-->
        <!--                  v-if="item.type==='completion'"-->
        <!--                  type="textarea"-->
        <!--                  maxlength="150"-->
        <!--                  show-word-limit-->
        <!--                  :autosize="{minRows: 2}"-->
        <!--                  :rows="item.row"-->
        <!--                  v-model="answer_list[index]"-->
        <!--                  resize="none">-->
        <!--        </el-input>-->
        <v-app class="choice" v-if="item.type==='completion'">
          <v-text-field
              v-model="item.answer"
              label="请在此输入答案~"
              single-line
          ></v-text-field>
        </v-app>

        <v-app class="choice" style="margin-top: 20px" v-if="item.type==='scoring'">
          <v-card-text>
            <v-slider
                v-model="item.answer"
                step="1"
                thumb-label
                ticks="always"
                :max="item.option_list.length - 1"
            ></v-slider>
          </v-card-text>
        </v-app>
      </div>
      <!--内容结束-->

      <el-button type="primary" @click="click">提交</el-button>

      <!--      <div class="line"></div>-->
      <!--      <div class="text2"> 摸鱼问卷 提供技术支持 </div>-->

    </div>
  </div>

</template>

<script>
import authorization from "../utils/authorization";
import axios from "axios";

export default {
  name: "check",
  components: {},
  data(){
    return {
      htmlTitle:'',
      single: 0,
      multiple: [],
      questionnaire_id: 1,
      content: '',
      info: '',
      answer_list: [],
      userLogin: localStorage.getItem('username.myblog'),
    }
  },
  mounted() {
    const that = this;
    axios
        .get('/api/questionnaire/' + this.$route.params.id)
        .then(function (response){
          that.info = response.data;
          that.htmlTitle = response.data.title;
          if('' + that.info.author.username !== '' + that.userLogin) {
            that.$router.push({path: '/index'});
            that.$notify.error({
              title: '您无权预览此问卷',
              // message: '爬',
            });
          }
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
      // if(this.info.status==='closed') alert('此问卷暂未发布，无法填写！');
      this.$notify.warning({
        title: '当前为预览',
        message: '无法提交'
      })
    },
  }
}
</script>



<style scoped>

.content {
  /*text-align: center;*/
  font-size: 15px;
  color: #555555;
  margin: 10px 40px 6px;
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
  margin: 20px auto;
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