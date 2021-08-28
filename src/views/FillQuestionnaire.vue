<template>
  <div>
    <div class="reminder"  v-if="info.status==='closed'">
      <h4>摸小鱼温馨提示：当前问卷处于关闭状态，无法提交哦~</h4>
    </div>
    <div class="questionnaire" v-if="info.is_locked === false">
      <!--标题-->
      <h1 class="title">{{info.title}}</h1>
      <div class="content" v-if="timeStamp===2">&nbsp;很抱歉，此问卷将于 {{startTime}} 开放！</div>
      <div class="content" v-if="timeStamp===3">&nbsp;很抱歉，此问卷已于 {{endTime}} 结束！</div>
      <div class="line" v-if="timeStamp!==1"></div>
      <el-button v-if="timeStamp!==1" type="primary" @click="toIndex">确定</el-button>


      <div v-if="timeStamp===1" class="content">&nbsp;{{info.content}}</div>
<!--      <div class="line"></div>-->
      <el-divider v-if="timeStamp===1"/>
      <div v-if="timeStamp===1" class="question_block" v-for="(item, index) in info.question_list" :key="index">
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
          <v-container class="px-0" fluid >
<!--            遍历选项-->
            <div style="float: left;">
              <v-radio-group v-model="item.answer" >
                <div v-for="optionItem in item.option_list">
                  <div style="float: left;min-width: 460px;max-width: 560px">
                    <v-radio
                        style="float: left"
                        :key="optionItem.id"
                        :label="optionItem.title "
                    ></v-radio>
                  </div>
                  <div v-if="item.is_show_result" style="float: right;padding-left: 30px;">
                    <span style="color: red;font-size: 18px">{{optionItem.answer_num}}票({{optionItem.percent_string}})</span>
                  </div>
                </div>
              </v-radio-group>
            </div>
          </v-container>
        </v-app>

        <!--多选题展示-->
        <v-app class="choice" v-if="item.type==='multiple-choice'">
          <v-container fluid>
            <div style="float: left" v-for="optionItem in item.option_list">
              <div style="float: left;min-width: 460px;max-width: 560px">
                <v-checkbox
                    :key="optionItem.id"
                    :label="optionItem.title"
                    v-model="optionItem.is_answer_choice"
                    hide-details
                ></v-checkbox>
              </div>
              <div v-if="item.is_show_result" style="float: right;padding-left: 30px;">
                <span style="color: red;font-size: 18px">{{optionItem.answer_num}}票({{optionItem.percent_string}})</span>
              </div>
            </div>
          </v-container>
        </v-app>

        <!--填空题展示-->
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

      <el-button v-if="timeStamp===1" type="primary" @click="click(info.id)">提交</el-button>
<!--      <div class="line"></div>-->
<!--      <div class="text2"> 摸鱼问卷 提供技术支持 </div>-->

    </div>

    <el-dialog
        title="问卷已加密！"
        center
        top="200px"
        :visible.sync="info.is_locked"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close= "false"
        width="30%"
    >
      <div>
        <div style="float: left">
          <span style="font-size: 17px">请输入密码：</span>
        </div>
        <div style="float: left; margin-left: 10px">
          <el-input placeholder="请输入密码" v-model="password" show-password v-on:keyup.enter.native="check_password"></el-input>
        </div>
      </div>
      <div style="margin-top: 100px;">
        <el-button style="" type="primary" @click="check_password">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import authorization from "../utils/authorization";
import axios from "axios";
import {Base64} from "js-base64";

export default {
  name: "FillQuestionnaire",
  components: {},
  data(){
    return {
      single: 0,
      multiple: [],
      questionnaire_id: 1,
      content: '',
      info: '',
      submit_list: [],
      flag: true,
      timeStamp: 1,
      startTime: '',
      endTime: '',
      // dialogVisible: true,
      password: '',
    }
  },
  mounted() {
    const that = this;
    let s1 = that.$route.params.text;
    s1 = Base64.decode(s1);
    s1 = s1.substring(4,s1.length - 7);
    axios
        .get('/api/questionnaire/' + parseInt(s1) + '/')
        .then(function (response) {
          that.info = response.data;
          console.log(that.info);
          if(that.info.is_start_time) {
            var time = that.info.start_time;
            var date = new Date(time).toJSON();
            // console.log(date);
            var str = new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,' ');
            // console.log(str);
            that.startTime = str;
            if(Date.parse(that.info.start_time) > Date.now()) {
              that.timeStamp = 2;
            }
          }
          if(that.info.is_end_time) {
            var time = that.info.end_time;
            var date = new Date(time).toJSON();
            // console.log(date);
            var str = new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,' ');
            // console.log(str);
            that.endTime = str;
            if(Date.parse(that.info.end_time) < Date.now()) {
              that.timeStamp = 3;
            }
          }
          console.log(that.timeStamp);
        })
        .catch(function (error){
          that.$notify.error({
            title: '好像发生了什么错误',
            message: error.message
          })
        })
  },
  methods: {
    toIndex(){
      this.$router.push({path: '/'});
    },
    check_password() {
      if(this.password === this.info.password) {
        this.$notify.success({
          title: '通过验证！',
          message: '开始填写问卷吧~'
        })
        this.info.is_locked = false;
      }
      else {
        this.$notify.error({
          title: '密码错误!',
          message: '请重新输入~'
        })
      }
    },
    click(id){
      let tmp;
      const that = this;
      if(this.info.status==='closed'){
        this.$notify.error({
          title: '问卷已关闭',
          message: '无法提交'
        })
      }
      else if(this.info.status==='deleted'){
        this.$notify.error({
          title: '问卷已删除',
          message: '无法提交'
        })
      }
      else{
        this.submit_list.splice(0, this.submit_list.length);
        this.flag = true;
        for(let item of this.info.question_list){
          if(item.type === 'multiple-choice'){
            tmp = false;
            for(let i of item.option_list){
              if(i.is_answer_choice === true){
                let data = {
                  question: item.id,
                  option: i.id,
                };
                that.submit_list.push(data);
                tmp = true;
              }
            }
            if(tmp === false && item.is_must_answer) {
              that.flag = false;
              console.log('多选')
            }
          }
          else if(item.type === 'single-choice' || item.type === 'scoring'){
            tmp = false;
            for(let i of item.option_list){
              if(item.option_list.indexOf(i) === item.answer){
                let data = {
                  question: item.id,
                  option: i.id,
                };
                tmp = true;
                that.submit_list.push(data);
              }
            }
            if(tmp === false && item.is_must_answer) {
              that.flag = false;
              console.log('单选 | 评分')
            }
          }
          else if(item.type === 'completion'){
            if(item.answer === '' && item.is_must_answer) {
              that.flag = false;
              console.log('填空')
            }
            else {
              let data = {
                // questionnaire: that.info.id,
                question: item.id,
                option: item.option_list[0].id,
                content: item.answer,
              };
              that.submit_list.push(data);
            }
          }
        }
        console.log(that.submit_list);
        if(that.flag === true) {
          // 提交问卷
          axios
              .post('/api/answer/', {
                ip: returnCitySN.cip,
                cname: returnCitySN.cname,
                questionnaire: that.info.id,
                answer_list: that.submit_list,
              })
              .then(function (response){
                let s1 = Base64.encode('moyu' + id + 'wenjuan');
                let url = window.location.origin+ "/thank/" + s1;
                window.open(url);
              })
              .catch(function (error){
                that.$notify.error({
                  title: '好像发生了什么错误',
                  message: error.message
                })
              })
        }
        else {
          that.$notify.warning({
            title: '请完成所有的必选项题目!',
          })
        }

      }
    },
  }
}
</script>



<style scoped>

.line{
  /*width: 90%;*/
  height: 1px;
  border-top: solid 2px;
  margin-left: 30px;
  margin-right: 30px;
  color: #3F87DA;
}
.el-dialog__wrapper >>> .el-dialog {
  border-radius: 10px !important;
}

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
  margin: 40px auto 0;
  border-radius: 15px;
  opacity: 1;
  height: fit-content;
  padding-top: 10px !important;
  box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 40px;
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