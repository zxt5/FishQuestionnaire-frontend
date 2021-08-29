<template>
  <div>

<!--    倒计时-->
    <a-affix v-if="finish === false && is_open && info.is_locked===false && timeStamp === 1 && info.is_end_time"
        style="text-align: center;">
      <div style="padding: 20px;background-color: #fdf1f1; font-size: 22px; color: #ff0000">
        <h3>考试剩余时间：{{count_down}}</h3>
      </div>
    </a-affix>

    <div v-if="finish === false">
      <div class="questionnaire" v-if="info.is_locked === false">
        <!--标题-->
        <h1 class="title">{{info.title}}</h1>
        <div class="content" v-if="timeStamp===2">&nbsp;很抱歉，此问卷将于 {{startTime}} 开放！</div>
        <div class="content" v-if="timeStamp===3">&nbsp;很抱歉，此问卷已于 {{endTime}} 结束！</div>
        <div class="content" v-if="timeStamp===4">&nbsp;恭喜，您已成功提交此问卷！</div>
        <div class="content" v-if="timeStamp===5">&nbsp;报歉，此问卷限额已满无法填写！</div>
        <div class="content" v-if="!canSubmit" style="color: #ea0a1a">&nbsp;报歉，此问卷限额已满，无法提交！</div>
        <div class="line" v-if="timeStamp!==1"></div>
        <el-button v-if="timeStamp!==1" type="primary" @click="toIndex">确定</el-button>


        <div v-if="timeStamp" class="content">&nbsp;{{info.content}}</div>
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
              <span style="color: lightgrey" v-if="item.type==='scoring'">[评分题]</span>
              <span style="color: lightgrey" v-if="item.type==='position'">[定位题]</span>
              <span style="color: #F56C6C" v-if="item.is_scoring">（{{item.question_score}}分）</span>
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
                          style="float: left; margin-bottom: 8px"
                          :key="optionItem.id"
                          :label="optionItem.title "
                          :disabled="optionItem.limit_answer_number - optionItem.answer_num <= 0 && optionItem.is_limit_answer"
                      ></v-radio>
                      <span v-if="optionItem.is_limit_answer" style="margin-left: 10%">剩余  {{optionItem.limit_answer_number - optionItem.answer_num <= 0 ? 0 : optionItem.limit_answer_number - optionItem.answer_num}}</span>
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
                  <span v-if="optionItem.is_limit_answer" style="margin-right: 70%; float:right">剩余  {{optionItem.limit_answer_number - optionItem.answer_num <= 0 ? 0 : optionItem.limit_answer_number - optionItem.answer_num}}</span>
                  <v-checkbox
                      :key="optionItem.id"
                      :label="optionItem.title"
                      v-model="optionItem.is_attr_limit"
                      :disabled="optionItem.limit_answer_number - optionItem.answer_num <= 0 && optionItem.is_limit_answer"
                      hide-details
                  >
                  </v-checkbox>

                </div>
                <div v-if="item.is_show_result" style="float: right; padding-left: 30px;">
                  <span style="color: red;font-size: 18px">{{optionItem.answer_num}}票({{optionItem.percent_string}})</span>
                </div>
              </div>
            </v-container>
          </v-app>

          <!--填空题展示-->
          <v-app class="choice" v-if="item.type==='completion'">
            <v-text-field
                v-model="item.option_list[0].answer"
                label="请在此输入答案~"
                single-line
            ></v-text-field>
          </v-app>

          <!--评分题展示-->
          <v-app class="choice" style="margin-top: 20px" v-if="item.type==='scoring'">
            <div style="display: inline-block">
              <v-rating
                  style="float: left !important;"
                  color="primary"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  hover
                  :length="item.option_list.length"
                  size="30"
                  v-model="item.answer"
              ></v-rating>
              <div style="margin: 6px 20px; float: left !important; font-size: 22px">{{ item.answer }}</div>
            </div>
          </v-app>

          <!--定位题展示-->
          <v-app class="choice" v-if="item.type==='position'">
            <!--          <div style="display: inline-block">  当前定位: </div>-->
            <v-btn
                class="ma-2"
                outlined
                color="indigo"
                @click="getLocation"
            >
              <span v-if="location && !positioning">{{ location["省份"] + ' ' + location["城市"] }}</span>
              <span v-show="!location && !positioning" >点击获取位置</span>
              <span v-show="positioning"><i class="el-icon-loading"></i>&nbsp;等待获取中 {{ countDown }} 秒</span>
            </v-btn>
          </v-app>
        </div>

        <el-button :disabled="!canSubmit" v-if="timeStamp===1" type="primary" @click="click(info.id)">提 交</el-button>

      </div>
    </div>

<!--    <el-button v-if="finish === true" @click="getPdf()">导出PDF</el-button>-->
    <div v-if="finish === true" class="questionnaire" id="pdfDom">
      <div style="padding: 10px">
        <h1 style="text-align: center; padding-top: 30px">{{info.title}}</h1>
        <el-row style="margin-top: 35px">
          <el-col :span="8">
            <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
              <div style="text-align: center;padding:10px 10px 10px 10px;">
                <h3>试卷得分</h3>
                <p style="margin-top: 10px">{{result.user_get_score}}分/{{result.total_score}}分</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
              <div style="text-align: center; padding:10px 10px 10px 10px;">
                <h3>做对题数</h3>
                <p style="margin-top: 10px">{{result.user_get_score_question_cnt}}道/{{result.total_score_question_cnt}}道</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
              <div style="text-align: center;padding:10px 10px 10px 10px;">
                <h3>正确率</h3>
                <p style="margin-top: 10px">{{result.correct_rate}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="content">&nbsp;问卷到此结束，感谢您的参与！</div>


        <div style="margin-top: 20px; margin-left: 20px">
          <div style="font-size: 16px;">

            <div>
              <h3 style="margin-bottom: 15px;color: midnightblue; cursor: pointer" @click="isShow = !isShow">答案解析
                <el-icon v-if="isShow" class="el-icon-arrow-up"/>
                <el-icon v-else class="el-icon-arrow-down"/>
              </h3>
              <div style="margin-top: 20px" v-if="isShow">
                <span>仅显示错题&nbsp</span>
                <el-switch
                    v-model="only_show_wrong_question"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </div>
            </div>


            <div v-for="(item, index) in result.question_list"  :key="index"
                 style="margin-bottom: 20px" v-if="isShow">
              <div v-if="item.is_scoring === true && !(item.is_user_answer_right && only_show_wrong_question)">

                <div slot="header" >
                  <div class="questionTitle">
                    <!--显示必填标识-->
                    <span v-if="info.is_show_question_num">{{(index+1)+'. '}}</span>
                    {{item.title}}

                    <span style="color: #F56C6C;">
                    <span v-if="item.is_must_answer">*</span>
                  </span>

                    <span style="color:gray">
                    （{{item.question_score}}分）
                  </span>

                  </div>
                </div>
                <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 5px">
                  {{item.content}}
                </div>


                <v-app class="choice" v-if="item.type==='single-choice'">
                  <v-container class="px-0" fluid >
                    <!--            遍历选项-->
                    <div style="float: left;">
                      <v-radio-group v-model="item.answer_ordering-1" disabled>
                        <div v-for="optionItem in item.option_list">
                          <div style="float: left;min-width: 460px;max-width: 560px;">
                            <v-radio
                                style="float: left; margin-bottom: 8px"
                                :key="optionItem.id"
                                :label="optionItem.title "
                            ></v-radio>
                          </div>
                        </div>
                      </v-radio-group>
                    </div>
                  </v-container>
                </v-app>

                <v-app class="choice" v-if="item.type==='multiple-choice'">
                  <v-container fluid>
                    <div style="float: left" v-for="optionItem in item.option_list">
                      <div style="float: left;min-width: 460px;max-width: 560px">
                        <v-checkbox
                            disabled
                            :key="optionItem.id"
                            :label="optionItem.title"
                            v-model="optionItem.is_user_answer"
                            hide-details
                        ></v-checkbox>
                      </div>
                    </div>
                  </v-container>
                </v-app>

                <v-app class="choice" v-if="item.type==='completion'" style="margin-bottom: 10px">
                  <div v-for="optionItem in item.option_list">
                    你的答案：{{optionItem.user_answer_content}}
                  </div>
                </v-app>

                <div style="background-color: whitesmoke; border-radius: 10px;">
                  <div style="padding: 8px">
                    <span v-if="item.is_user_answer_right" style="color: green">回答正确</span>
                    <span v-else style="color: darkred">回答错误</span>
                    <i class="el-icon-success" v-if="item.is_user_answer_right" style="color: green"></i>
                    <i class="el-icon-error" style="color: red" v-else></i>
                    <span v-if="item.is_user_answer_right" style="float: right; padding-right: 5px;color: green">+{{item.user_get_score}}分</span>
                    <span v-else style="float: right; padding-right: 5px;color: red">+{{item.user_get_score}}分</span>
                  </div>
                </div>

                <div v-if="item.is_user_answer_right === false"
                     style="background-color: whitesmoke; border-radius: 10px;margin-top: 10px;padding: 8px">
                  <div style="color: green">正确答案：</div>
                  <div v-if="item.type === 'single-choice' || item.type === 'multiple-choice'">
                  <span v-for="(optionItem, index) in item.option_list">
                    <span v-if="optionItem.is_answer_choice">{{optionItem.title}}, </span>
                  </span>
                  </div>
                  <div v-else>
                    <span v-for="optionItem in item.option_list">{{optionItem.answer}}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <!--内容结束-->

      <el-button type="primary" @click="$router.push({path: '/'})">确定</el-button>
    </div>


    <el-dialog
        title="问卷已加密！"
        :visible.sync="info.is_locked"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close= "false"
        width="30%"
        center
    >
      <div style="width: 50%; margin: 0 auto">
        <el-input placeholder="请输入密码" v-model="password" show-password v-on:keyup.enter.native="check_password"></el-input>
      </div>
      <div style="margin: 40px auto 0;">
        <el-button style="margin-bottom: 0 !important;" type="primary" @click="check_password">确   定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import authorization from "../utils/authorization";
import axios from "axios";
import {Base64} from "js-base64";
import {loadBMap} from "../assets/js/loadBMap";

export default {
  name: "FillQuestionnaire",
  components: {},
  data(){
    return {
      canSubmit: true,
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
      password: '',
      BMap: null,
      geolocation: null, // Geolocation对象实例
      positioning: false, // 定位中
      positioningInterval: null, // 定位倒计时计时器
      countDown: 30, // 倒计时，单位秒
      location: null, // 位置信息
      result:'',
      finish: false,
      only_show_wrong_question: false,
      isShow: false,
      is_start: false,
      is_end: false,
      count_down: '',
      is_open: true,
      rightTime: '',
    }
  },

  mounted() {
    const _this = this
    window.initBaiduMapScript = () => {
      _this.BMap = window.BMap
    }
    loadBMap('initBaiduMapScript')
    const that = this;
    let s1 = that.$route.params.text;
    s1 = Base64.decode(s1);
    s1 = s1.substring(4,s1.length - 7);
    authorization()
      .then(function (res){
        if(res[0]){
          axios
              .get('/api/questionnaire/' + parseInt(s1) + '/fill_or_preview/', {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
              })
              .then(function (response) {
                that.info = response.data;
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
                if(that.info.is_only_answer_once){
                  const _that = that;
                  axios
                      .put('/api/answer/check_answer/', {
                        id: _that.info.id
                      }, {
                        headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
                      })
                      .then(function (resp){
                        console.log(resp.data)
                        if(resp.data.has_answer === true){
                          _that.timeStamp = 4;
                        }
                      })
                      .catch(function (error){
                        _that.$notify.error({
                          title: '出错啦',
                          message: '限制失败'
                        })
                      })
                }
                if(that.info.is_limit_answer) {
                  let total = that.info.limit_answer_number;
                  let num = that.info.answer_num;
                  if(num >= total && that.timeStamp !== 4)  that.timeStamp = 5;
                }
                if(that.timeStamp === 1) {
                  let flag = true;
                  for (let i of that.info.question_list) {
                    if (i.is_limit_answer && i.is_must_answer) {
                      let tmp = false;
                      for (let j of i.option_list) {
                        if (j.limit_answer_number - j.answer_num > 0) tmp = true;
                      }
                      if (tmp === false) flag = false;
                      // console.log(i.title);
                    }
                    if (flag === false) that.canSubmit = false;
                  }
                }
                    // console.log(i)
                console.log(that.info.is_only_answer_once)
                console.log(that.timeStamp);
                if(that.timeStamp === 1) {
                  _this.Djs_time();
                }
              })
              .catch(function (error){
                // that.$notify.error({
                //   title: '好像发生了什么错误',
                //   message: error.response
                // })
                console.log(error.response)
              })
        }
        else{
          axios
              .get('/api/questionnaire/' + parseInt(s1) + '/fill_or_preview/')
              .then(function (response) {
                that.info = response.data;
                if(that.info.is_required_login){
                  that.$store.commit('flag_true');
                  that.$store.commit('toUrl', that.$route.params.text);
                  that.$notify.warning({
                    title: '请先登录',
                    message: '发布者设置了登陆验证'
                  })
                  that.$router.push({path: '/login'});
                }
                // console.log(that.info);
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
                if(that.info.is_only_answer_once){
                  const _that = that;
                  axios
                      .put('/api/answer/check_answer/', {
                        id: _that.info.id
                      }, {
                        headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
                      })
                      .then(function (resp){
                        console.log(resp.data)
                        if(resp.data.has_answer === true){
                          _that.timeStamp = 4;
                        }
                      })
                      .catch(function (error){
                        _that.$notify.error({
                          title: '出错啦',
                          message: '限制失败'
                        })
                      })
                }
                if(that.info.is_limit_answer) {
                  let total = that.info.limit_answer_number;
                  let num = that.info.answer_num;
                  if(num >= total && that.timeStamp !== 4)  that.timeStamp = 5;
                }
                if(that.timeStamp === 1) {
                  let flag = true;
                  for (let i of that.info.question_list) {
                    if (i.is_limit_answer && i.is_must_answer) {
                      let tmp = false;
                      for (let j of i.option_list) {
                        if (j.limit_answer_number - j.answer_num > 0) tmp = true;
                      }
                      if (tmp === false) flag = false;
                      // console.log(i.title);
                    }
                    if (flag === false) that.canSubmit = false;
                  }
                }
                if(that.timeStamp === 1) {
                  _this.Djs_time();
                }
              })
              .catch(function (error){
                // that.$notify.error({
                //   title: '好像发生了什么错误',
                //   message: error.response
                // })
                console.log(error.response)
              })
        }
      })

  },

  methods: {

    Djs_time: function(){
      if(this.info.is_end_time) {
        let ret = setInterval( ()=> {
          let startTime = new Date(this.info.start_time).getTime();
          let endTime = new Date(this.info.end_time).getTime();
          let presentTime=new Date().getTime();
          this.rightTime = endTime - presentTime;
          if( this.info.is_start_time && (presentTime - startTime < 0) ) {
            this.count_down = "问卷还未开始！";
          }
          else {
            if (this.rightTime > 0) {
              let dd = Math.floor(this.rightTime / 1000 / 60 / 60 / 24);
              let hh = Math.floor((this.rightTime / 1000 / 60 / 60) % 24);
              let mm = Math.floor((this.rightTime / 1000 / 60) % 60);
              let ss = Math.floor((this.rightTime / 1000) % 60);
              this.count_down= dd + "天" + hh + "小时" + mm + "分" + ss + "秒";
              this.is_open = true;
            }
            else if(this.rightTime === 0){
              // this.count_down="问卷已结束"
              this.is_open = false;
            }
            else {
              this.click(this.info.id);
              clearInterval(ret);
            }
          }
        }, 1000);
      }
    },

    resetPositioning() {
      this.positioning = false
      this.location = null
      this.countDown = 30
      clearInterval(this.positioningInterval)
    },

    getLocation() {
      const that = this;
      if(!this.location && !this.positioning) {
        this.$confirm('请选择是否同意获取定位', '该题需要获取您的地理位置', {
          confirmButtonText: '同意',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that._getLocation()
        })
      }
    },
    _getLocation() {
      const _this = this
      _this.geolocation = new _this.BMap.Geolocation()
      if (_this.geolocation) {
        // 开启SDK辅助定位，仅当使用环境为移动web混合开发，且开启了定位sdk辅助定位功能后生效
        _this.geolocation.enableSDKLocation()
        // 开始定位
        this.positioning = true
        // 倒计时
        this.positioningInterval = setInterval(() => {
          if (this.countDown === 0) {
            this.countDown = 30
            clearInterval(this.positioningInterval)
          } else {
            this.countDown--
          }
        }, 1000)
        // 位置选项
        const positionOptions = {
          enableHighAccuracy: true, // 要求浏览器获取最佳结果
          timeout: 30, //    超时时间
          maximumAge: 0 // 允许返回指定时间内的缓存结果。如果此值为0，则浏览器将立即获取新定位结果
        }
        // 获取用户位置信息
        _this.geolocation.getCurrentPosition(position => {
          _this.resetPositioning()
          // 获取定位结果状态码
          const statusCode = _this.geolocation.getStatus()
          let msg = '由于未知错误而无法检索设备的位置' // 提示消息
          let msgType = 'error' // 消息类型
          // 判断结果状态码，为0代表获取成功，读取省市、经纬度
          switch (statusCode) {
            case 0:
              msgType = 'success'
              msg = '获取地理位置定位请求成功'
              if (position) {
                // 数据变量定义
                let lat = 0.0 // 经度
                let lng = 0.0 // 纬度
                let province = '未知' // 经度
                let city = '未知' // 纬度

                // 坐标
                if (position.point) {
                  lat = position.point.lat
                  lng = position.point.lng
                }
                // 位置
                if (position.address) {
                  province = position.address.province
                  city = position.address.city
                }
                _this.location = {
                  省份: province,
                  城市: city,
                  经度: lat,
                  纬度: lng
                }
              } else {
                msg = '由于未知错误而无法检索设备的位置'
              }
              break
            case 2:
              msg = '由于未知错误而无法检索设备的位置'
              break
            case 4:
            case 5:
              msg = '位置服务请求非法'
              break
            case 6:
              msg = '应用程序没有使用位置服务的权限'
              break
            case 7:
              msg = '网络不可用或者无法连接到获取位置信息的卫星'
              break
            case 8:
              msg = '无法在指定的最大超时间隔内检索位置信息'
              break
            default:
              msg = '由于未知错误而无法检索设备的位置'
              break
          }
          _this.$$notify[msgType]({
            key: NotificationKey,
            message: '提示',
            description: msg
          })
        }, positionOptions)
      } else {
        _this.$$notify.error({
          key: NotificationKey,
          message: '提示',
          description: '您的浏览器不支持地理位置服务'
        })
      }
    },

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
              if(i.is_attr_limit === true){
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
          else if(item.type === 'single-choice' ){
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
          else if( item.type === 'scoring'){
            tmp = false;
            for(let i of item.option_list){
              if(item.option_list.indexOf(i) + 1 === item.answer){
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
            if(item.option_list[0].answer === '' && item.is_must_answer) {
              that.flag = false;
              console.log('填空')
            }
            else {
              let data = {
                question: item.id,
                option: item.option_list[0].id,
                content: item.option_list[0].answer,
              };
              that.submit_list.push(data);
            }
          }
          else if(item.type === 'position'){
            if(that.location === null && item.is_must_answer) {
              that.flag = false;
              console.log('定位')
            }
            else {
              let data;
              if(that.location === null) {
                data = {
                  question: item.id,
                  option: item.option_list[0].id,
                  content: '',
                };
              }
              else {
                data = {
                  question: item.id,
                  option: item.option_list[0].id,
                  content: that.location['城市'],
                };
              }
              that.submit_list.push(data);
            }
          }
        }
        console.log(that.submit_list);
        console.log(that.rightTime);
        if(that.flag === true || that.rightTime < 0 ) {
          // 提交问卷
          const that = this;

          // this.$confirm('交卷后将无法修改答案！', '是否立即交卷？', {
          //   confirmButtonText: '确认交卷',
          //   cancelButtonText: '我再看看',
          //   type: 'warning'
          // }).then(() => {
            axios
                .post('/api/answer/', {
                  // ip: returnCitySN.cip,
                  // cname: returnCitySN.cname,
                  questionnaire: that.info.id,
                  answer_list: that.submit_list,
                }, {
                  headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
                })
                .then(function (response){
                  that.result = response.data;
                  console.log(that.result.answer_number);
                  if(that.info.type === 'exam' && that.result.is_show_answer_detail === true) {
                    that.finish = true;
                  }
                  else {
                    let s1 = Base64.encode('moyu' + id + 'wenjuan');
                    // let url = window.location.origin+ "/thank/" + s1;
                    that.$router.push({path: '/thank/' + s1});
                  }
                })
                .catch(function (error){
                  if(error.response.status === 400) {
                    that.$notify.warning({
                      title: '问卷限额已满，提交失败！',
                      // message: error.message
                    })
                    that.$router.push({path: '/'});
                  }
                  else {
                    that.$notify.error({
                      title: '好像发生了什么错误',
                      message: error.message
                    })
                  }
                })
          // })
        }
        else {
          that.$notify.warning({
            title: '请完成所有的必选项题目!',
          })
        }
      }
    },
    click_1(id) {
      const that = this;
      // this.$confirm('交卷后将无法修改答案！', '是否立即交卷？', {
      //   confirmButtonText: '确认交卷',
      //   cancelButtonText: '我再看看',
      //   type: 'warning'
      // }).then(() => {
      axios
          .post('/api/answer/', {
            // ip: returnCitySN.cip,
            // cname: returnCitySN.cname,
            questionnaire: that.info.id,
            answer_list: that.submit_list,
          }, {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
          })
          .then(function (response){
            that.result = response.data;
            console.log(that.result.answer_number);
            if(that.info.type === 'exam' && that.result.is_show_answer_detail === true) {
              that.finish = true;
            }
            else {
              let s1 = Base64.encode('moyu' + id + 'wenjuan');
              // let url = window.location.origin+ "/thank/" + s1;
              that.$router.push({path: '/thank/' + s1});
            }
          })
          .catch(function (error){
            that.$notify.error({
              title: '好像发生了什么错误',
              message: error.message
            })
          })
    }
  }
}
</script>



<style scoped>

.line{
  height: 1px;
  border-top: solid 2px;
  margin-left: 30px;
  margin-right: 30px;
  color: #3F87DA;
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
  color: white;
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

.ma-2 {
  margin-top: 20px !important;
  margin-left: 0 !important;
  width: 30%;
  display: flex
  /*height: 50px !important;*/
}
</style>

<style>
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
  margin-bottom: 8px;
}
.v-input--radio-group--column{
  margin-bottom: 8px !important;
}

.container{
  padding-left: 0 !important;
}

.v-messages{
  min-height: 0 !important;
}
</style>