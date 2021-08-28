<template>
  <div >
    <!--主题内容区域-->
    <el-container class="main">
      <el-container>
        <!--侧边栏区域-->
        <a-affix style="width: 23%" offset-top="4">
          <el-aside style="height: fit-content;">

            <el-container class="class" >
              <div @click="check" style="margin-left: 0px">
                <el-button class="button" circle>
                  <i class="el-icon-document-checked"></i>
                </el-button>
                <h4>预览问卷</h4>
              </div>
              <div @click="Finish" style="margin-left: 50px">
                <el-button class="button" circle>
                  <i class="el-icon-finished"></i>
                </el-button>
                <h4>完成编辑</h4>
              </div>
            </el-container>
            <!--              active-text-color="#DA70D6"-->
            <el-menu class="aside-mid">
              <div class="aside-top">
                <span> 题型选择 </span>
              </div>
              <!--一级菜单-->
              <el-submenu v-for="item in menuList" :key="item.type" :index="item.type">
                <template slot="title">
                  <span>{{item.name}}</span>
                </template>
                <!--二级菜单-->
                <el-menu-item v-for="subItem in item.children" :key="subItem.type" :index="subItem.type" @click="addQuestion(subItem.type)">
                  <template slot="title">
                    <span>{{subItem.name}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>

            <el-menu class="aside-mid" style="padding: 20px 25px">
              <div class="aside-top">
                <span> 问卷设置 </span>
              </div>
              <!--            时间控制-->
              <div class="time_control" style="margin-top: 20px">
                <span>时间控制</span>
                <el-switch
                    style="float: right"
                    @change="delete_time_control"
                    v-model="control_time"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
                <div v-if="control_time" style="padding-left: 15px">
                  <!--                开始时间-->
                  <div>
                    <div>
                      <el-checkbox v-model="info.is_start_time">开始时间</el-checkbox>
                    </div>
                    <div style="padding-left: 20px">
                      <el-date-picker
                          v-if="info.is_start_time"
                          v-model="info.start_time"
                          type="datetime"
                          placeholder="选择开始时间">
                      </el-date-picker>
                    </div>
                  </div>
                  <!--                结束时间-->
                  <div>
                    <div>
                      <el-checkbox v-model="info.is_end_time">结束时间</el-checkbox>
                    </div>
                    <div style="padding-left: 20px">
                      <el-date-picker
                          v-if="info.is_end_time"
                          v-model="info.end_time"
                          type="datetime"
                          placeholder="选择结束时间">
                      </el-date-picker>
                    </div>
                  </div>
                  <!--                保存按钮-->
                  <div style="float: right; margin-top: 15px;">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="save_time_control"
                    >
                      保存更改
                    </el-button>
                  </div>
                </div>
              </div>
              <!--            是否显示题号-->
              <div style="margin-top: 15px">
                <span style=" margin-top: 30px">是否显示题号</span>
                <el-switch
                    style="float: right"
                    @change="is_show_num"
                    v-model="info.is_show_question_num"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
                <!--              问卷设置密码-->
                <div style="margin-top: 15px">
                  <span style="margin-top: 30px">是否加密问卷</span>
                  <el-switch
                      style="float: right"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      v-model="info.is_locked"
                      @change="set_islocked"
                  >
                  </el-switch>
                  <div v-if="info.is_locked" style="margin-top: 15px;padding-left: 15px">
                    <span style="color: #555555;font-size: 15px">设置密码:</span>
                    <el-input
                        placeholder="请输入密码"
                        v-model="info.password"
                        show-password
                        v-on:keyup.enter.native="set_password"
                        style="min-width: 180px;max-width: 180px;margin-left: 10px"
                    >
                    </el-input>
                    <div style="margin-top: 15px; float: right">
                      <el-button
                          size="mini"
                          type="primary"
                          @click="set_password"
                      >
                        保存更改
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-menu>
          </el-aside>
        </a-affix>
        <!--问卷区域-->
        <el-main style="height: fit-content" class="questionnaire">
          <!--标题区域-->
          <div class="question-title" contenteditable="true" >
            <h2>{{info.title}}</h2>
          </div>
          <div class="intro" contenteditable="true" @input="info.content = $event.target.innerText" @blur="editTitle(info)"> {{info.content}}</div>

            <el-container          
            style="display:inline">
              <el-collapse v-model="info.isShow" class="question-container" @change="editTitle(info)">
                <el-collapse-item >
                    <template slot="title">
                        <span style="margin-left: 85%">  编辑标题和简介 </span>
                    </template>
                    <title-content-dialog ref="title-content-dialog"></title-content-dialog>
                </el-collapse-item>
              </el-collapse>
            </el-container>


          <draggable :list="info.question_list" animation="500" 
          chosen-class="chosen" 
          :disabled="disabled" 
          @start="onStart" 
          @end="onEnd"
          >
          <transition-group>              
          <div class="card"  v-for="(item, index) in info.question_list" :key="item.id ? item.id: item.key">
            <div style="padding: 20px">
            <div class="op">
              <ul @mouseenter="mouseEnter"
                  @mouseleave="mouseLeave">
                <li @click="cardDelete(index, item)"><v-icon small>mdi-delete-variant</v-icon>  删除</li>
                <li @click="cardCopy(index, item)"><v-icon small>mdi-content-copy</v-icon>  复制</li>
                <li @click="cardDown(index, item)"><v-icon small>mdi-arrow-down-circle-outline</v-icon>  下移</li>
                <li @click="cardUp(index, item)"><v-icon small>mdi-arrow-up-circle-outline</v-icon>  上移</li>
              </ul>
            </div>

            <!--单选框模板-->
            <template v-if="item.type === 'single-choice'">
              <div>
                <span v-if="info.is_show_question_num">{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[单选题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 15px">
                {{item.content}}
              </div>
              <el-radio-group v-model="item.answer">
                <el-radio v-for="(subItem, subIndex) in item.option_list" :key="subItem.id" :label="subIndex">
                  {{subItem.title}}
                </el-radio>
              </el-radio-group>
            </template>

            <!--多选框模板-->
            <template v-if="item.type === 'multiple-choice'">
              <div>
                <span v-if="info.is_show_question_num">{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[多选题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 15px">
                {{item.content}}
              </div>
              <el-checkbox-group v-model="item.answer">
                <el-checkbox  v-for="(subItem, subIndex) in item.option_list" :key="subIndex" :label="subIndex" >
                  {{subItem.title}}
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <!--单项填空模板-->
            <!--            <template v-if="item.type === 'completion'">-->
            <!--              <div>-->
            <!--                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>-->
            <!--                <span>{{(index+1)}}. </span>-->
            <!--                <span style="margin-top: 20px"> {{item.title}} </span>-->
            <!--              </div>-->
            <!--              <el-input v-model="item.answer" class="single-completion-input" :autosize="true"-->
            <!--                        type="textarea" :clearable="true" resize="none">-->
            <!--              </el-input>-->
            <!--            </template>-->
            <!--填空模板-->
            <template v-if="item.type === 'completion'">
              <div>
                <span v-if="info.is_show_question_num">{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[填空题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 15px">
                {{item.content}}
              </div>
<!--                <p style="margin-left:10px">{{subItem.title}}</p>-->
              <el-input class="single-completion-input" :autosize="true"
                        type="textarea" :clearable="true" resize="none" v-model="item.answer"></el-input>

            </template>
            <!--定位模板-->
            <template v-if="item.type == 'position'">
              <div>
                <span v-if="info.is_show_question_num">{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[定位题]</span>
                <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 15px">
                {{item.content}}
              </div>
                <br>
<!--                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>-->
<!--                <span style="margin-right:20px">  当前定位: </span>-->
                <el-button style="margin-left: 17px; width: 25%" :icon="positioning ? 'el-icon-loading': none " @click="getLocation">
                  <span v-if="location">{{ location["省份"] + ' ' + location["城市"] }}</span>
                  <div v-show="!location && !positioning" >点击获取位置</div>
                  <span v-show="positioning">
                          &nbsp;
                          等待获取中
                          <span class="red">{{ countDown }}</span> 秒
                      </span>
                  </el-button>
              </div>
            </template>
          <!--评分题-->
          <template v-if="item.type === 'scoring'">
              <div>
                <span v-if="info.is_show_question_num">{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[评分题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 15px">
                {{item.content}}
              </div>
              <el-slider class="scoring-input"
                  v-model="item.answer"
                  :step="1"
                  :max="item.option_list.length - 1"
              >
              </el-slider>
            </template>

                <!--单选题目框-->
            </div>
            
            <!--编辑界面-->
            <el-container          
            style="display:inline"
            >
            <div class="question-container">
                <el-collapse-transition>
                  <div v-show="item.isShow">
                    <single-choice-add-card :ref="'single-choice'+index" v-if="item.type === 'single-choice'"></single-choice-add-card>
        
                    <!--多选对话框-->
                    <multiple-choice-add-card :ref="'multiple-choice'+index" v-if="item.type === 'multiple-choice'"></multiple-choice-add-card>
           
                    <!--单项填空对话框-->
                    <single-completion-add-card :ref="'completion'+index" v-if="item.type === 'completion'"></single-completion-add-card>

                    <!--    评分对话框-->
                    <scoring-add-card :ref="'scoring'+index" v-if="item.type === 'scoring'"></scoring-add-card>

                    <position-add-card :ref="'position'+index" v-if="item.type === 'position'"></position-add-card>

                  </div>
                </el-collapse-transition>
            </div>
            </el-container>
            <!--编辑按钮-->
            <el-divider ></el-divider>
            <el-button @click="editQuestion(item, index)"
                       @mouseenter.native="mouseEnter"
                       @mouseleave.native="mouseLeave"
            class="edit-button"
            :icon=" item.isShow === true ? 'el-icon-arrow-up':'el-icon-arrow-down'"
            >
              <div v-show="item.isShow === true">完成编辑</div>
              <div v-show="item.isShow === false">进入编辑</div>
            </el-button>
            
            </div>
            </transition-group>
          </draggable>

          <div class="not_found" style="line-height: 100px">
            快去侧边栏选择题型创建新的问题o(*￣▽￣*)ブ <i class="el-icon-cold-drink"></i>
          </div>
          <el-button type="danger" class="main-footer" @click="Finish">完成编辑</el-button>
        </el-main>
      </el-container>
    </el-container>


    <!--波浪-->
    <!--    <wave></wave>-->
    <!-- <scoring-add-dialog ref="scoring"></scoring-add-dialog>
    <single-completion-add-dialog ref="completion"></single-completion-add-dialog>
    <single-choice-add-dialog ref="single-choice"></single-choice-add-dialog>
    <multiple-choice-add-dialog ref="multiple-choice"> </multiple-choice-add-dialog>
    <position-add-dialog ref="position"></position-add-dialog> -->
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import SingleChoiceAddCard from "../components/SingleChoiceAddCard.vue"
import MultipleChoiceAddCard from "../components/MultipleChoiceAddCard.vue"
import Wave from "../components/Wave.vue"
import SingleCompletionAddCard from '../components/SingleCompletionAddCard.vue'
import MultipleCompletionAddCard from '../components/MultipleCompletionAddCard.vue'
import authorization from "@/utils/authorization";
import ScoringAddCard from "../components/ScoringAddCard";
import axios from "axios";
import draggable from 'vuedraggable'
import TitleContentDialog from "../components/TitleContentDialog";
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Vue from 'vue'

import {Base64} from "js-base64";
Vue.component(CollapseTransition.name, CollapseTransition)

import { loadBMap } from '../assets/js/loadBMap'
import PositionAddCard from '../components/PositionAddCard.vue'

export default {
  components: {
        PositionAddCard, SingleChoiceAddCard,
        Wave, MultipleChoiceAddCard, SingleCompletionAddCard,
        MultipleCompletionAddCard,
        ScoringAddCard,draggable,
        TitleContentDialog
  },
  data(){
    return {
      isEdit: false,
      BMap: null,
      geolocation: null, // Geolocation对象实例
      positioning: false, // 定位中
      positioningInterval: null, // 定位倒计时计时器
      countDown: 30, // 倒计时，单位秒
      location: null, // 位置信息
      disabled: true,
      editPlace: {},
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
              type: "multiple-choice",
            }
          ]
        },
        {
          name: "填空题",
          type: "completion",
          children:[
            {
              name: "单项填空",
              type: "completion"
            },
          ]
        },
        {
          name: "评分题",
          type: "scoring",
          children: [
            {
              name: "评分题",
              type: "scoring",
            }
          ]
        }
      ],
      userLogin: localStorage.getItem('username.myblog'),
      info: null,
      answer: [],
      control_time: '',
      show_num: '',
    }
  },
  methods:{
    set_password() {
      const that = this;
      if(this.info.password === '') {
        that.$notify.error({
          title: '密码不能为空！',
          message: '请输入密码！'
        })
      }
      else {
        axios
            .patch('/api/questionnaire/' + that.info.id + '/', {
              is_locked: true,
              password: this.info.password,
            }, {
              headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
            })
            .then(function (response){
              that.$notify.success({
                title: '设置成功',
                message: '设置密码成功！'
              })
            })
            .catch(function (error){
              that.$notify.error({
                title: '出错啦',
                message: '设置密码失败！'
              })
            })
      }
    },
    set_islocked() {
      const that = this;
      if(this.info.is_locked === false) {
        axios
            .patch('/api/questionnaire/' + that.info.id + '/', {
              is_locked: false
            }, {
              headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
            })
            .then(function (response){
              that.$notify.success({
                title: '编辑成功',
                message: '问卷已解锁！'
              })
            })
            .catch(function (error){
              that.$notify.error({
                title: '出错啦',
                message: '解锁问卷失败'
              })
            })
      }
    },
    resetPositioning() {
      this.positioning = false
      this.location = null
      this.countDown = 30
      clearInterval(this.positioningInterval)
    },
    getLocation() {
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
    delete_time_control() {
      const that = this;
      if(this.control_time === false) {
        axios
            .patch('/api/questionnaire/' + that.info.id + '/', {
              is_start_time: false,
              // start_time: this.info.start_time,
              is_end_time: false,
              // end_time: this.info.end_time,
            }, {
              headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
            })
            .then(function (response){
              that.$notify.success({
                title: '编辑成功',
                message: '已关闭时间控制！'
              })
            })
            .catch(function (error){
              that.$notify.error({
                title: '出错啦',
                message: '设置时间失败'
              })
            })
      }
    },
    save_time_control() {
      let now = new Date();
      const that = this;
      if(this.info.is_start_time === false && this.info.is_end_time === false){
        this.$notify.warning({
          title: '设置失败',
          message: '请至少选择一项时间限制！'
        })
      }
      else if(this.info.is_start_time && this.info.start_time === null) {
        this.$notify.warning({
          title: '设置失败',
          message: '请设置开始时间！'
        })
      }
      else if(this.info.is_end_time && this.info.end_time === null) {
        this.$notify.warning({
          title: '设置失败',
          message: '请设置结束时间！'
        })
      }
      // if(this.is_end_time && Date.parse(this.end_time )< now) console.log("结束时间早于当前时间");
      else {
        var fl = 1;
        if(this.info.is_start_time && this.info.is_end_time) {
            // console.log(this.info.start_time);
            // console.log(this.info.end_time);
            if(Date.parse(this.info.start_time) > Date.parse(this.info.end_time)) {
              fl = 0;
            }
        }
        if(fl === 1) {
          axios
              .patch('/api/questionnaire/' + that.info.id + '/', {
                is_start_time: this.info.is_start_time,
                start_time: this.info.start_time,
                is_end_time: this.info.is_end_time,
                end_time: this.info.end_time,
              }, {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
              })
              .then(function (response){
                that.$notify.success({
                  title: '编辑成功',
                  message: '设置时间控制成功！'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '设置时间失败'
                })
              })
        }
        else {
          this.$notify.warning({
            title: '设置失败',
            message: '结束时间不能早于开始时间，请检查并修改！',
          })
        }

      }
    },
    is_show_num() {
      const that = this;
      axios
          .patch('/api/questionnaire/' + that.info.id + '/', {
            is_show_question_num: this.info.is_show_question_num,
          }, {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
          })
          .then(function (response){
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '设置失败'
            })
          })
    },
    check(){
      let s1 = Base64.encode('moyu' + this.$route.params.id + 'wenjuan');
      let url = window.location.origin+ "/check/" + s1; //预览链接
      window.open(url);
    },
    Finish(){
      if(this.info.question_list.length === 0){
        this.$notify.warning({
          title: '请至少创建一个问题哦'
        })
      }
      else{
        this.$router.push({path: '/index'});
        this.$notify.success({
          title: '问卷编辑完成',
          message: '快去发布吧'
        })
      }
    },
    addQuestion(questionType){
      // console.log("addQuestion", this.$refs, questionType)
      // this.$refs[questionType].addQuestion(questionType)
      if (this.isEdit){
        this.$notify.error({
          title: "请完成当前题目的编辑!"
        })
        return;
      }
      this.info.question_list.push({
        key: Date.now(),
        option_list: [
          {
            title: '',
            content:'',
            ordering: 1,
          },
        ],
        title: '',
        content: '',
        type: questionType,
        questionnaire: this.$route.params.id,
        is_must_answer: false,
        is_show_result: false,
        isShow: false
      })
      var index = this.info.question_list.length-1
      this.$nextTick(_=>{
        this.editQuestion(this.info.question_list[index], index)
      })
    },
    editQuestion(item, index){
      var questionType = item.type
      // 切换编辑界面显示
      console.log("editquestion", this.$refs[questionType+index][0])
      var temp = this.$refs[questionType+index][0]
      temp.editQuestion(this.info.question_list[index])

      console.log("afteredit",this.info.question_list[index])
      // 编辑成功才切换状态
      if (temp.editSuccess){
        item.isShow = !item.isShow
        this.$forceUpdate()
      }
      if (item.isShow) this.isEdit = true
      else this.isEdit = false
    },
    cardUp(index, item){
      if (this.isEdit){
        return this.$notify.error('请完成当前编辑')
      }
      if (index === 0){
        return this.$notify.error("已经到顶了啊");
      }
      const that = this;
      console.log(index);
      axios
        .patch('/api/question/' + item.id + '/', {
          ordering: index,
        }, {
          headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
        })
        .then(function (response){
          let temp = that.info.question_list[index];
          that.info.question_list[index] = that.info.question_list[index-1];
          that.info.question_list[index-1] = temp;
          that.$forceUpdate();
        })
        .catch(function (error){
          that.$notify.error({
            title: '出错啦',
            message: '更换顺序失败'
          })
        })
    },
    cardDown(index, item){
      if (this.isEdit){
        return this.$notify.error('请完成当前编辑')
      }
      if (index === this.info.question_list.length - 1){
        return this.$notify.error("不能继续往下了")
      }
      const that = this;
      console.log(index);
      axios
          .patch('/api/question/' + item.id + '/', {
            ordering: index + 2,
          }, {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
          })
          .then(function (response){
            let temp = that.info.question_list[index];
            that.info.question_list[index] = that.info.question_list[index+1];
            that.info.question_list[index+1] = temp;
            that.$forceUpdate();
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '更换顺序失败'
            })
          })
    },
    cardDelete(index, item){
      if (!item.hasOwnProperty('id')){
        this.info.question_list.splice(index, 1)
        return
      }
      const that = this;
      axios
          .delete('/api/question/' + item.id + '/',  {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
          })
          .then(function (response){
            that.info.question_list.splice(index, 1);
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '删除失败'
            })
          })
    },
    cardCopy(index, item){
      if (this.isEdit){
        return this.$notify.error('请完成当前编辑')
      }
      const that = this;
      axios
          .post('/api/question/copy/', {
            id: item.id,
          }, {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
          })
          .then(function (response){
            that.info.question_list.splice(index + 1, 0, JSON.parse(JSON.stringify(that.info.question_list[index])))
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '复制失败'
            })
          })
    },
    editTitle(info){
      this.info.isShow = !this.info.isShow
      this.$refs["title-content-dialog"].edit(info)
    },
    onStart() {
    this.drag = true;
    console.log("start")
    console.log(this.info.question_list)
    },
//拖拽结束事件
    onEnd(e) {
      this.drag = false;
      if (e.oldIndex == e.newIndex){
        return
      }
      // 重新渲染编辑页面
      for (let i = 0; i < this.info.question_list.length; i++){
        var item = this.info.question_list[i]
        // this.$refs[item.type+(e.ordering-1)][0] = item
        if (!item.isShow) continue
        this.$refs[item.type+i][0].questionForm = item
      }
      var id = this.info.question_list[e.newIndex].id
      const that = this
      axios
          .patch('/api/question/' + id + '/', {
            ordering: e.newIndex + 1,
          }, {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
          })
          .then(function (response){
            that.$notify.success({title:'交换成功'})
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '更换顺序失败'
            })
          })
    },
    mouseEnter(){
      this.disabled = true
    },
    mouseLeave(){
      this.disabled = false
    },
    mouseChange(){
      if (this.isEdit) this.disabled = true
      else this.disabled = false
    }
    // 添加成功的事件
  },
  mounted() {
    const _this = this
    window.initBaiduMapScript = () => {
      _this.BMap = window.BMap
    }
    loadBMap('initBaiduMapScript')
    const that = this;
    authorization().then(function (response) {
      if(response[0]){
        axios
            .get('/api/questionnaire/' + that.$route.params.id, {
              headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
            })
            .then(function (response) {
              that.info = response.data;
              // that.show_num = response.data.is_show_question_num;
              that.control_time = response.data.is_end_time || response.data.is_start_time;
              that.info.isShow = []
              console.log(that.info);
              if('' + that.info.author.username !== '' + that.userLogin) {
                that.$router.push({path: '/index'});
                that.$notify.error({
                  title: '您无权编辑此问卷',
                  // message: '爬',
                });
              }
              that.menuList.push({
                  name: "其他功能",
                  type: "function",
                  children:[
                    {
                      name: "定位",
                      type: "position"
                    },
                  ]
                })
              if (that.info.type == "epidemic-check-in"){

              }
              for (let item of that.info.question_list){
                item["isShow"] = false
              }
              for (let item of that.info.question_list) {
                if (item.type == 'completion'){
                  item.answer = ''
                }
                else item.answer = []
              }
            })
            .catch(function (error) {
              that.$notify.error({
                title: '好像发生了什么错误',
                message: '',
              })
            })
      }
      else {
        that.$notify.error({
          title: '请先登录！',
          message: '',})
      }
    })
  }
}
</script>


<style lang="less" scoped>
.question-container{
  padding-left: 20px;
  padding-right: 20px;
  //background-color: #fafafa;
}

.edit-button{
  width: 100%; 
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
}
// 侧边栏标题布局
.aside-top{
  text-align: center;
  margin-bottom: 5pt;
  font-size: 20px !important;
  font-weight: bolder;
}
.question-title{
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  padding: 10px 10px;
  margin:0 20px;
}
.question-title:hover{
  background-color: #fdfbfb;
}
.intro:hover{
  background-color: #fdfbfb;
}
.questionnaire {
  //padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  opacity: 0.95;
}
.intro{
  padding: 10px 10px;
  margin:10px 20px;
  font-size:15px;
  //color:#888;
  line-height: 1.5em;
}
.aside-mid{
  opacity: 0.95;
  background-color: #FFFFFF;
  padding-top: 20px;
  margin-top: 10px !important;
  border-radius: 10px;
  padding-bottom: 10px;
}
// 全部主题区域布局
.main{
  //width: 90%;
  //padding-left: 10%;
  //margin-top: 20pt;
  //height: 100%;
  width: 80%;
  margin: 40px auto 40px;
}

.card {
  margin: 15px;
  padding: 0px;
  border: solid 1px #9EC1E0 !important;
  border-radius: 10px;
}

// 侧边栏布局
.el-aside {
 background-color: #FFFFFF;
 opacity: 0.95;
 margin-top: 0;
 padding-top: 10pt;
 //border-radius: 3%;
}

.bottom-button{
  height: 100%;
  width: 100% !important;
  padding: 0;
  font-size: 15pt;
  color: #83a1ce;
  border: none;
  display: flex;
  justify-content: center;
}
.el-aside {
  //position: fixed;
  background-color: transparent;
  color: #333;
  padding-top:0 !important;
  padding-bottom:30px;
  width: auto !important;
  /*border-radius: 15px;*/
  //opacity: 0.9;
  /*line-height: 200px;*/
}
// element ui 的主题区域布局
.el-main {
  //background-color: #E9EEF3;
  //color: #333;
  //border-radius: 10px;
  margin-left: 30pt;
  //margin-top: 0;
  /*padding-top: 50px;*/
}

// 菜单布局
.el-menu{
  position: relative;
  top: 0;
  width: 100%;
  border-right: none;
}

.class {
  background-color: white;
  /*opacity: 0.9;*/
  border-radius: 10px;
  padding: 25px 10px 20px;
  text-align: center;
  justify-content: center;
}

.el-icon-document-checked, .el-icon-finished{
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
.title-footer{
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 35px;
}
.button:hover{
  background-color: #d43f8d;
}

//body > .el-container {
//  margin-bottom: 40px;
//}

// 按钮组布局
.el-radio-group,.el-checkbox-group{
  margin-top: 10pt;
  display: grid;
}
.el-radio, .el-checkbox{
  margin: 10pt;
}

.op{
  font-size:15px;
  vertical-align: text-top;
}

.op ul{
  padding-left:15px;
  line-height: 28px;
}

.op li{
  list-style: none;
  float:right;
  margin-left:15px;
  font-size: 15px;
  cursor: pointer;
}

//卡片底部
.card-footer{
  position: relative;
  //color: #fff;
  //right: 13%;
  width: 100%;
  //margin-bottom: 10px;
  text-align: center;
  height: 35px;
}
.el-divider--horizontal{
  margin: 0;
}

// el-main footer
.main-footer{
  position: relative;
  margin-top: 10px;
  color: #fff;
  left: 50%;
  transform: translate(-50%,0);
}

.single-completion-input, .multiple-completion-input{
  margin-top: 12px !important;
  width: 80% !important;
}

.chosen {
    border: solid 2px #0d9fcf !important;
    background: #F7F8F9;
    opacity: 0.5;
}

</style>
<style>

.el-submenu__title{
  font-size: 18px !important;
}
.el-menu-item{
  font-size: 16px !important;
}

.el-slider__runway{
  width: 80% !important;
  margin: 60px 10px !important;
}
.el-textarea .el-input__count{
  background-color: transparent !important;
}
/*.el-collapse-item__content{*/
/*  background-color: #FAFAFA;*/
/*}*/

</style>
