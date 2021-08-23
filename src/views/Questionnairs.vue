<template>
  <div >
    <!--主题内容区域-->
    <el-container class="main">
      <el-container>
        <!--侧边栏区域-->
        <el-aside width="23%" style="height: fit-content;">
          <div class="aside-top">
            <span> 题型选择 </span>
          </div>
          <!--              active-text-color="#DA70D6"-->
          <el-menu class="aside-mid" text-color="#1E90FF">
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
            <h1></h1>
            <h1></h1>
            <h1></h1>
          </div>
          <div class="intro">{{info.content}}</div>
          <el-card  v-for="(item, index) in info.question_list" :key="index">
            <div class="button-top">
              <el-tooltip placement="top" content="上移" effect="dark" :enterable="false">
                <el-button icon="el-icon-caret-top" type="text" @click="cardUp(index)">    </el-button>
              </el-tooltip>
              <el-tooltip placement="top" content="下移" effect="dark" :enterable="false">
                <el-button icon="el-icon-caret-bottom" type="text" @click="cardDown(index)">   </el-button>
              </el-tooltip>
              <el-tooltip placement="top" content="删除" effect="dark" :enterable="false">
                <el-button icon="el-icon-delete" type="text" @click="cardDelete(index)">    </el-button>
              </el-tooltip>
              <el-tooltip placement="top" content="复制" effect="dark" :enterable="false">
                <el-button icon="el-icon-copy-document" type="text" @click="cardCopy(index)"></el-button>
              </el-tooltip>
            </div>
            <!--单选框模板-->
            <template v-if="item.type === 'single-choice'">
              <div>
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
                <span>{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
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
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
                <span>{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
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
                <span v-if="item.is_must_answer" style="color: #F56C6C">* </span>
                <span>{{(index+1)}}. </span>
                <span style="margin-top: 20px"> {{item.title}} </span>
              </div>
              <div v-for="(subItem,subIndex) in item.option_list" :key="subIndex" class="multiple-completion-input">
                <p style="margin-left:10px">{{subItem.title}}</p>
                <el-input class="single-completion-input" :autosize="true"
                          type="textarea" :clearable="true" resize="none" v-model="answer[item.ordering - 1][subIndex]"></el-input>
              </div>
            </template>
            <div class="card-footer">
              <el-button icon="el-icon-edit" type="primary" size="small" @click="editQuestion(item.type, index)">编辑</el-button>
            </div>
          </el-card>
          <el-button type="danger" class="main-footer">完成编辑</el-button>
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
    <single-completion-add-card ref="single-completion"></single-completion-add-card>
    <!--多项填空对话框-->
    <multiple-completion-add-card ref="multiple-completion"></multiple-completion-add-card>
  </div>
</template>

<script>
import SingleChoiceAddCard from "../components/SingleChoiceAddCard.vue"
import MultipleChoiceAddCard from "../components/MultipleChoiceAddCard.vue"
import Wave from "../components/Wave.vue"
import SingleCompletionAddCard from '../components/SingleCompletionAddCard.vue'
import MultipleCompletionAddCard from '../components/MultipleCompletionAddCard.vue'
import authorization from "@/utils/authorization";
import axios from "axios";
export default {
  components: {SingleChoiceAddCard, Wave, MultipleChoiceAddCard, SingleCompletionAddCard, MultipleCompletionAddCard, },
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
              type: "single-completion"
            },
            {
              name: "多项填空",
              type: "multiple-completion"
            }
          ]
        }
      ],
      info: null,
      answer: [],
      questionnair:{
        title: null,
        content: null,
        questions_list: null,
        // questions:[
        //   {
        //     content: "第一题",
        //     answer: '',
        //     key: 1,
        //     type: "single-choice",
        //     ismust: 1,
        //     groups:[
        //       {
        //         content: "xxx",
        //         key: 2,
        //       },
        //       {
        //         content: "xxx",
        //         key: 3,
        //       }
        //     ]
        //   },
        //   {
        //     content: "第二题",
        //     answer: [],
        //     key: 4,
        //     type: "multiple-choice",
        //     ismust: 1,
        //     groups:[
        //       {
        //         content: "xxx",
        //         key: 5,
        //       },
        //       {
        //         content: "xxxxx",
        //         key: 6,
        //       }
        //     ]
        //   },
        //   {
        //     content: "第三题",
        //     answer: [],
        //     key: 7,
        //     type: "single-completion",
        //     ismust: 1,
        //     groups:[
        //       {
        //         content: "xxx",
        //         key: 8,
        //       },
        //     ]
        //   },
        //   {
        //     content: "第四题",
        //     answer: [],
        //     key: 9,
        //     type: "multiple-completion",
        //     ismust: 1,
        //     groups:[
        //       {
        //         content: "xxx",
        //         key: 10,
        //       },
        //     ]
        //   }
        // ]
      }
    }
  },
  methods:{
    addQuestion(questionType){
      this.$refs[questionType].addQuestion(questionType)
    },
    editQuestion(questionType, index){
      this.$refs[questionType].editQuestion(this.questionnair.questions[index])
    },
    cardUp(index){

      if (index === 0){
        return this.$notify.error("已经到顶了啊");
      }
      let temp = this.questionnair.questions[index];
      this.questionnair.questions[index] = this.questionnair.questions[index-1];
      this.questionnair.questions[index-1] = temp;
      this.$forceUpdate()
    },
    cardDown(index){

      if (index === this.questionnair.questions.length - 1){
        return this.$notify.error("不能继续往下了")
      }
      let temp = this.questionnair.questions[index];
      this.questionnair.questions[index] = this.questionnair.questions[index+1];
      this.questionnair.questions[index+1] = temp;
      this.$forceUpdate()
    },
    cardDelete(index){
      this.questionnair.questions.splice(index, 1)
    },
    cardCopy(index){
      this.questionnair.questions.push(JSON.parse(JSON.stringify(this.questionnair.questions[index])))
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
        this.$notify.error({
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
  font-size: 14pt;
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
  //text-align: center;
  margin-bottom: 5pt;
  font-size: 14pt;
  //font-weight: bolder;
  //background-color: white;
  opacity: 0.95;
  background-color: #FFFFFF;
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
.el-aside {
  background-color: #FFFFFF;
  opacity: 0.95;
  margin-top: 0;
  padding-top: 10pt;
  border-radius: 3%;
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

// 按钮组布局
.el-radio-group,.el-checkbox-group{
  margin-top: 10pt;
  display: grid;
}
.el-radio, .el-checkbox{
  margin: 10pt;
}


// 上下 删除布局
.button-top{
  position: absolute;
  height: 20pt;
  width: 52%;
  text-align: end;
  transform: translate(0, -50%);
  float: right;
}

// 按钮布局
.el-button{
  margin: 0;
}

//卡片底部
.card-footer{
  position: absolute;
  color: #fff;
  right: 13%;
  transform: translate(0, -80%);
}

// el-main footer
.main-footer{
  position: relative;
  color: #fff;
  left: 50%;
  transform: translate(-50%,0);
}

.single-completion-input, .multiple-completion-input{
  margin-top: 20pt;
  width: 80%;
}
</style>
