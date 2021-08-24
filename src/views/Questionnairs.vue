<template>
  <div >
    <!--主题内容区域-->
    <el-container class="main">
      <el-container>
        <!--侧边栏区域-->
        <el-aside width="23%" style="height: fit-content;">

          <el-container class="class">
            <div @click="check" style="margin-left: 0px">
              <el-button class="button" circle>
                <i class="el-icon-document-checked"></i>
              </el-button>
              <h4>预览问卷</h4>
            </div>
            <div @click="toChart" style="margin-left: 50px">
              <el-button class="button" circle>
                <i class="el-icon-data-line"></i>
              </el-button>
              <h4>结果统计</h4>
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
        </el-aside>
        <!--问卷区域-->
        <el-main style="height: fit-content" class="questionnaire">
          <!--标题区域-->
          <div class="question-title">
            <h2>{{info.title}}</h2>
          </div>
          <div class="intro"> {{info.content}}</div>
          <div class="title-footer">
            <span></span>
            <el-button icon="el-icon-edit" type="primary" size="small" @click="editTitle">编辑</el-button>
          </div>
          <title-content-dialog ref="title-content-dialog" :prop_title="info.title" :prop_content="info.content"></title-content-dialog>
          <el-divider/>
          <el-card  v-for="(item, index) in info.question_list" :key="index">
            <div class="op">
<!--              <el-tooltip placement="top" content="上移" effect="dark" :enterable="false">-->
<!--                <el-button icon="el-icon-caret-top" type="text" @click="cardUp(index)">    </el-button>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip placement="top" content="下移" effect="dark" :enterable="false">-->
<!--                <el-button icon="el-icon-caret-bottom" type="text" @click="cardDown(index)">   </el-button>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip placement="top" content="删除" effect="dark" :enterable="false">-->
<!--                <el-button icon="el-icon-delete" type="text" @click="cardDelete(index)">    </el-button>-->
<!--              </el-tooltip>-->
<!--              <el-tooltip placement="top" content="复制" effect="dark" :enterable="false">-->
<!--                <el-button icon="el-icon-copy-document" type="text" @click="cardCopy(index)"></el-button>-->
<!--              </el-tooltip>-->
              <ul>
                <li @click="cardDelete(index, item)"><v-icon small>mdi-delete-variant</v-icon>  删除</li>
                <li @click="cardCopy(index, item)"><v-icon small>mdi-content-copy</v-icon>  复制</li>
                <li @click="cardDown(index, item)"><v-icon small>mdi-arrow-down-circle-outline</v-icon>  下移</li>
                <li @click="cardUp(index, item)"><v-icon small>mdi-arrow-up-circle-outline</v-icon>  上移</li>
              </ul>
            </div>
            <!--单选框模板-->
            <template v-if="item.type === 'single-choice'">
              <div>
                <span>{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[单选题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 5px">
                {{item.content}}
              </div>
              <el-radio-group v-model="item.answer">
                <el-radio v-for="(subItem, subIndex) in item.option_list" :key="subIndex" :label="subIndex">
                  {{subItem.title}}
                </el-radio>
              </el-radio-group>
            </template>
            <!--多选框模板-->
            <template v-if="item.type === 'multiple-choice'">
              <div>
                <span>{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[多选题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 5px">
                {{item.content}}
              </div>
              <el-checkbox-group v-model="answer[item.ordering - 1]">
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
            <!--多项填空模板-->
            <template v-if="item.type === 'completion'">
              <div>
                <span>{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[填空题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 5px">
                {{item.content}}
              </div>
              <div v-for="(subItem, subIndex) in item.option_list" :key="subIndex" class="multiple-completion-input">
<!--                <p style="margin-left:10px">{{subItem.title}}</p>-->
                <el-input class="single-completion-input" :autosize="true"
                          type="textarea" :clearable="true" resize="none" v-model="answer[item.ordering - 1][subIndex]"></el-input>
              </div>
            </template>
<!--            评分模板-->
            <template v-if="item.type === 'scoring'">
              <div>
                <span>{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
                <span style="color: lightgrey">[评分题]</span>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
              </div>
              <div style="color: dimgray ;font-size: 14px; padding-left: 17px; margin-top: 5px">
                {{item.content}}
              </div>
<!--              <el-radio-group v-model="item.answer">-->
<!--                <el-radio v-for="(subItem, subIndex) in item.option_list" :key="subIndex" :label="subIndex">-->
<!--                  {{subItem.title}}-->
<!--                </el-radio>-->
<!--              </el-radio-group>-->
              <el-slider class="scoring-input"
                  v-model="item.answer"
                  :step="1"
                  :max="item.option_list.length - 1"
              >
              </el-slider>
            </template>
            <div class="card-footer">
              <el-button icon="el-icon-edit" type="primary" size="small" @click="editQuestion(item.type, index)">编辑</el-button>
            </div>
          </el-card>
          <div class="not_found" style="line-height: 100px">
            快去侧边栏选择题型创建新的问题o(*￣▽￣*)ブ <i class="el-icon-cold-drink"></i>
          </div>
          <el-button type="danger" class="main-footer" @click="Finish">完成编辑</el-button>
        </el-main>
      </el-container>
    </el-container>

    <!--波浪-->
    <!--    <wave></wave>-->
    <!--单选对话框-->
    <single-choice-add-card ref="single-choice"></single-choice-add-card>
    <!--多选对话框-->
    <multiple-choice-add-card ref="multiple-choice"></multiple-choice-add-card>
    <!--单项填空对话框-->
    <single-completion-add-card ref="completion"></single-completion-add-card>
    <!--多项填空对话框-->
    <multiple-completion-add-card ref="multiple-completion"></multiple-completion-add-card>
<!--    评分对话框-->
    <scoring-add-card ref="scoring"></scoring-add-card>
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
import TitleContentDialog from '../components/TitleContentDialog.vue'
export default {
  components: {SingleChoiceAddCard, Wave, MultipleChoiceAddCard, SingleCompletionAddCard, MultipleCompletionAddCard, ScoringAddCard, TitleContentDialog},
  data(){
    return {
      // 菜单栏
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
            // {
            //   name: "多项填空",
            //   type: "multiple-completion"
            // }
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
      info: null,
      answer: [],
    }
  },
  methods:{
    check(){
      this.$router.push({path: '/check/' + this.$route.params.id});
    },
    toChart(){
      if(this.info.answer_num === 0){
        this.$notify.warning({
          title: '此问卷暂无答卷',
          message: '请先回收问卷'
        })
      }
      else{
        this.$router.push({path: '/charts/' + this.info.id});
      }
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
      this.$refs[questionType].addQuestion(questionType)
    },
    editQuestion(questionType, index){
      this.$refs[questionType].editQuestion(this.info.question_list[index])
    },
    cardUp(index, item){
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
    editTitle(){
      this.$refs["title-content-dialog"].edit()
    }
  },
  mounted() {
    const that = this;
    authorization().then(function (response) {
      if(response[0]){
        console.log(that.$route.params.id);
        // console.log('/api/questionnaire/' + that.$route.params.id);
        axios
            .get('/api/questionnaire/' + that.$route.params.id, {
              headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
            })
            .then(function (response) {
              that.info = response.data;
              console.log(that.info);
              for (let item of that.info.question_list) {
                that.answer.push([]);
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

// 侧边栏标题布局
.aside-top{
  text-align: center;
  margin-bottom: 5pt;
  font-size: 20px !important;
  font-weight: bolder;
  //background-color: white;
  //opacity: 0.95;
  //border-radius: 10px;
  //padding: 25px 10px 20px;
  //text-align: center;
  //justify-content: center;
}
.question-title{
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  margin-bottom: 20px;
}
.questionnaire {
  //padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  opacity: 0.95;
}
.intro{
  padding: 0 2em;
  margin:10px 0;
  font-size:15px;
  //color:#888;
  line-height: 1.5em;
}
.aside-mid{
  opacity: 0.95;
  background-color: #FFFFFF;
  padding-top: 10px;
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

.el-card {
  margin: 15px;
}

// 侧边栏布局
//.el-aside {
//  background-color: #FFFFFF;
//  opacity: 0.95;
//  margin-top: 0;
//  padding-top: 10pt;
//  border-radius: 3%;
//}
.el-aside {
  background-color: transparent;
  color: #333;
  padding-top:0 !important;
  padding-bottom:30px;
  /*border-radius: 15px;*/
  opacity: 0.9;
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

.el-icon-document-checked, .el-icon-data-line{
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
  //position: absolute;
  //color: #fff;
  //right: 13%;
  transform: translate(0, -80%);
  display: inline-block;
  float: right;
  //margin-bottom: 10px;
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
  margin-top: 20pt !important;
  width: 80% !important;
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
</style>
