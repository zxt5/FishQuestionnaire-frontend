<template>
  <div>
    <div class="reminder">
      <h4>摸小鱼温馨提示：只能预览，不能提交哦~</h4>
    </div>
    <div class="button-header">
      <el-button type="danger" @click="getPdf()">导出pdf</el-button>
    </div>
    <div class="questionnaire" id="pdfDom">
      <!--标题-->
      <h1 class="title">{{info.title}}</h1>
      <div class="content">&nbsp;{{info.content}}</div>
      <!--      <div class="line"></div>-->
      <el-divider/>

      <!--      开始遍历问题渲染-->
      <div class="question_block" v-for="(item, index) in info.question_list" v-if="Show[index]" :key="index">
        <div slot="header">
          <div class="questionTitle">
            <!--显示必填标识-->
            <span v-if="info.is_show_question_num">{{(index+1)+'. '}}</span>
            {{item.title}}
            <span style="color: #F56C6C;">
            <span v-if="item.is_must_answer">*</span>
          </span>
            <span style="color: lightgrey" v-if="item.type==='single-choice'"> [单选题]</span>
            <span style="color: lightgrey" v-if="item.type==='multiple-choice'"> [多选题]</span>
            <span style="color: lightgrey" v-if="item.type==='completion'"> [填空题]</span>
            <span style="color: lightgrey" v-if="item.type==='scoring'"> [评分题]</span>
            <span style="color: lightgrey" v-if="item.type==='position'">[定位题]</span>
            <span style="color: #F56C6C" v-if="item.is_scoring">（{{item.question_score}}分）</span>
          </div>
        </div>
        <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 5px">
          {{item.content}}
        </div>

        <!--        &lt;!&ndash;单选题展示&ndash;&gt;-->
        <!--        <v-app class="choice" v-if="item.type==='single-choice'">-->
        <!--          <v-container-->
        <!--              class="px-0"-->
        <!--              fluid-->
        <!--          >-->
        <!--            <v-radio-group v-model="item.answer">-->
        <!--              <v-radio-->
        <!--                  v-for="optionItem in item.option_list"-->
        <!--                  :key="optionItem.id"-->
        <!--                  :label="optionItem.title"-->
        <!--              ></v-radio>-->
        <!--            </v-radio-group>-->
        <!--          </v-container>-->
        <!--        </v-app>-->

        <!--        &lt;!&ndash;多选题展示&ndash;&gt;-->
        <!--        <v-app class="choice" v-if="item.type==='multiple-choice'">-->
        <!--          <v-container fluid>-->
        <!--            <div style="float: left" v-for="optionItem in item.option_list">-->
        <!--              <div style="float: left;min-width: 460px;max-width: 560px">-->
        <!--                <v-checkbox-->
        <!--                    :key="optionItem.id"-->
        <!--                    :label="optionItem.title"-->
        <!--                    v-model="optionItem.is_attr_limit"-->
        <!--                    hide-details-->
        <!--                ></v-checkbox>-->
        <!--              </div>-->
        <!--              <div v-if="item.is_show_result" style="float: right; padding-left: 30px;">-->
        <!--                <span style="color: red;font-size: 18px">{{optionItem.answer_num}}票({{optionItem.percent_string}})</span>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </v-container>-->
        <!--        </v-app>-->
        <!--单选题展示-->
        <v-app class="choice" v-if="item.type==='single-choice'">
          <v-container class="px-0" fluid >
            <!--            遍历选项-->
            <div style="float: left;">
              <v-radio-group v-model="item.answer" @change="solveSin(index, item.answer)">
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
                <v-checkbox
                    :key="optionItem.id"
                    :label="optionItem.title"
                    v-model="optionItem.is_attr_limit"
                    hide-details
                    @change="solveMul(index, item.option_list)"
                ></v-checkbox>
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
              v-model="item.answer"
              label="请在此输入答案~"
              single-line
          ></v-text-field>
        </v-app>

        <!--        评分题展示-->
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
        <!--        定位题展示-->
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
      <!--内容结束-->

      <el-button type="primary" @click="click" class="submit">提交</el-button>

      <!--      <div class="line"></div>-->
      <!--      <div class="text2"> 摸鱼问卷 提供技术支持 </div>-->

    </div>
  </div>

</template>

<script>
import authorization from "../utils/authorization";
import axios from "axios";
import {Base64} from "js-base64";
import {loadBMap} from "../assets/js/loadBMap";

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
      BMap: null,
      geolocation: null, // Geolocation对象实例
      positioning: false, // 定位中
      positioningInterval: null, // 定位倒计时计时器
      countDown: 30, // 倒计时，单位秒
      location: null, // 位置信息
      Show: [],
      sTmp:[],
      mTmp:[],
      f:[],
      rep:[],
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
    axios
        .get('/api/questionnaire/' + parseInt(s1) + '/fill_or_preview/', {
          headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
        })
        .then(function (response){
          that.info = response.data;
          // console.log(response.data)
          that.init();
          console.log(that.Show);

          that.htmlTitle = response.data.title;
          if('' + that.info.author.username !== '' + that.userLogin) {
            that.$router.push({path: '/index'});
            that.$notify.error({
              title: '您无权预览此问卷',
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
    init(){
      const that = this;
      // console.log(that.info.question_list.length)
      for(let item of that.info.question_list){
        this.sTmp.push({
          last: null,
        })
        this.rep.push(item.relate_logic_option);
        if(item.relate_logic_option.length !== 0){
          this.Show.push(false);
        }
        else{
          this.Show.push(true);
        }
        let tmp = [];
        let mmp = [];
        for (let op of item.option_list) {
          tmp.push({
            rlq: op.related_logic_question,
            select:false,
          })
          mmp.push({
            select:false,
          })
        }
        this.f.push(tmp);
        this.mTmp.push(mmp);
        // console.log(tmp);
      }
      console.log(this.f);
      console.log(this.rep);
    },
    cancelOption(i, j) {
      // console.log(i, j)
      let option_queue = [];
      option_queue.push({x:i,y:j});
      this.f[i][j].select = false;
      while(option_queue.length > 0) {
        let p = option_queue.shift();
        // console.log("!!!")
        // console.log(p.x, p.y);
        if(this.f[p.x][p.y].rlq.length !== 0) {
          for (let q of this.f[p.x][p.y].rlq) {
            // console.log(q.ordering - 1)
            let f1 = this.Show[q.ordering - 1];
            // console.log('f1', f1);
            if(this.rep[q.ordering - 1].length <= 1) this.Show[q.ordering - 1] = false;
            else {
              let flag = false;
              for (let pp of this.rep[q.ordering - 1]) {
                if(this.f[pp.question_ordering - 1][pp.ordering - 1].select) flag = true;
              }
              // console.log('flag', flag);
              if(!flag) this.Show[q.ordering - 1] = false;
            }
            // console.log('this.Show[q.ordering - 1]', this.Show[q.ordering - 1]);
            if(f1 && !this.Show[q.ordering - 1]) {
              for (let pp  = 0; pp <  this.info.question_list[q.ordering - 1].option_list.length; pp ++) {
                // console.log('pp', pp)
                // console.log('this.f[q.ordering - 1][pp].select',this.f[q.ordering - 1][pp].select);
                if(this.f[q.ordering - 1][pp].select) {
                  this.f[q.ordering - 1][pp].select = false;
                  option_queue.push({x:q.ordering - 1,y:pp});
                }
              }
            }
          }
        }
      }
    },
    reSetF(){
      let i = 0;
      for(let item of this.info.question_list){
        if(item.type === 'single-choice') {
          if(item.answer !== '' || item.answer !== undefined) {
            if(this.f[i][item.answer] !== undefined)
                this.f[i][item.answer].select = true;
          }
        }
        else if(item.type === 'multiple-choice') {
          let j = 0;
          for (let op of item.option_list) {
            if(op.is_attr_limit) {
              if(this.f[i][j] !== undefined)
                this.f[i][j].select = true;
            }
            j ++;
          }
        }
        i ++;
      }
    },
    addOption(i, j) {
      this.reSetF();
      let option_queue = [];
      option_queue.push({x:i,y:j});
      this.f[i][j].select = true;
      while(option_queue.length > 0) {
        let p = option_queue.shift();
        console.log("!!!")
        console.log(p.x, p.y);
        if(this.f[p.x][p.y].rlq.length !== 0) {
          for (let q of this.f[p.x][p.y].rlq) {
            console.log(q.ordering - 1)
            let f1 = this.Show[q.ordering - 1];
            console.log('f1', f1);
            if(!f1) {
              this.Show[q.ordering - 1]  = true;
              for (let pp  = 0; pp <  this.info.question_list[q.ordering - 1].option_list.length; pp ++) {
                console.log('pp', pp)
                console.log(q.ordering - 1, pp)
                console.log('this.f[q.ordering - 1][pp].select',this.f[q.ordering - 1][pp].select);
                if(this.f[q.ordering - 1][pp].select) {
                  option_queue.push({x:q.ordering - 1,y:pp});
                }
              }
            }
          }
        }
      }
    },
    solveSin(i, j) {
      console.log(i, j);
      if(this.sTmp[i].last !== null) {
        this.cancelOption(i, this.sTmp[i].last);
      }
      this.sTmp[i].last = j;
      this.f[i][j].select = true;
      // for (let j of this.f[i][j].rlq) {
      //   this.Show[j.ordering - 1] = true;
      // }
      this.addOption(i, j);
    },
    solveMul(i, list){
      let j = 0;
      for (j  = 0; j < list.length; j ++) {
        if(list[j].is_attr_limit !== this.mTmp[i][j].select) {
          this.f[i][j].select = list[j].is_attr_limit;
          this.mTmp[i][j].select = list[j].is_attr_limit;
          break;
        }
      }
      console.log(i, j, this.mTmp[i][j].select)
      if(this.mTmp[i][j].select) {
        // for (let k of this.f[i][j].rlq) {
        //   this.Show[k.ordering - 1] = true;
        // }
        this.addOption(i, j);
      }
      else {
        this.cancelOption(i, j);
      }
    },

    click(){
      this.$notify.warning({
        title: '当前为预览',
        message: '无法提交'
      })
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

.submit{
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

.submit:hover{
  background-color: #3F87DA;
}
.button-header{
  position: relative !important;
  text-align: center !important;
  margin-top: 20pt !important;
  color: #fff !important;
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

.container{
  padding-left: 0 !important;
}

.v-messages{
  min-height: 0 !important;
}
</style>