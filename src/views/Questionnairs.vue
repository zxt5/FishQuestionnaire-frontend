<template>
<div >
      <!--主题内容区域-->
        <el-container class="main">
          <el-container>
            <!--侧边栏区域-->
            <el-aside>
              <div class="aside-top">
                <span> 题型选择 </span>
              </div>
              <el-menu 
                background-color="#fff"
                text-color="#18927B"
                active-text-color="#000"
              >
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
            <el-main style="height: fit-content">
              <!--标题区域-->
              <div class="question-title"> 
                <span>{{questionnair.title}}</span>
              </div>
              <el-card  v-for="(item, index) in questionnair.questions" :key="item.key">
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
                <div>
                  <span v-if="item.ismust" style="color: #F56C6C">*</span>
                  <span> 第{{' '+(index+1)+' '}}题</span>
                  <p style="margin-top: 20px"> {{item.content}} </p>
                </div>
                <el-radio-group v-model="item.answer">
                      <el-radio v-for="subItem in item.groups" :key="subItem.key" :label="subItem.key">
                        {{subItem.content}}
                      </el-radio>
                </el-radio-group>
                <div class="card-footer">
                  <el-button icon="el-icon-edit" type="primary" size="small" @click="editQuestion(index)">编辑</el-button>
                </div>
              </el-card>
              <el-button type="danger" class="main-footer">完成编辑</el-button>
            </el-main>
          </el-container>
        </el-container>


        <!-- 波浪区域 -->
        <footer class="wavefooter">
            <!-- svg 形状 -->
            <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <!-- ,,形状容器 -->
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <!-- 组合形状 -->
               <g class="parallax">
                <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(118, 218, 255, 1)" />
                <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(118, 218, 255, 0.5)" />
                <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(118, 218, 255, 0.3)" />
                <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(118, 218, 255, 0.1)" />
              </g>
            </svg>
        </footer>
    <add-card ref="addcard"></add-card>
</div>
</template>

<script>
import AddCard from "../components/AddCard.vue"
export default {
  components: {AddCard},
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
              type: "mutiple-choice",
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
            }
          ]
        }
      ],
      questionnair:{

          title: 'xxx',
          questions:[
                {
                  content: "第一题",
                  answer: '',
                  key: 1,
                  groups:[
                    {
                      content: "xxx",
                      key: 2,
                    },
                    {
                      content: "xxx",
                      key: 3,
                    }
                  ]
                },
                 {
                  content: "第二题",
                  answer: '',
                  key: 4,
                  groups:[
                    {
                      content: "xxx",
                      key: 5,
                    },
                    {
                      content: "xxxxx",
                      key: 6,
                    }
                  ]
                }
          ]
      }
    }
  },
  methods:{
      addQuestion(questionType){
          this.$refs.addcard.addQuestion(questionType)
      },
      editQuestion(index){
        this.$refs.addcard.editQuestion(this.questionnair.questions[index])
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
  }
}
</script>


<style lang="less" scoped>

// 侧边栏标题布局
.aside-top{
  text-align: center;
  margin-bottom: 5pt;
  font-size: 14pt;
  font: bolder;
}
// 全部主题区域布局
.main{
  width: 90%;
  padding-left: 10%;
  margin-top: 20pt; 
  height: 100%;
}

.el-card {
  margin: 15px;
}

// 侧边栏布局
.el-aside {
  background-color: #D3DCE6;
  margin-top: 0%;
  padding-top: 10pt;
  border-radius: 3%;
}
// element ui 的主题区域布局
.el-main {
  background-color: #E9EEF3;
  color: #333;
  border-radius: 10px;
  margin-left: 15pt;
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
.el-radio-group{
  margin-top: 10pt;
  display: grid;
}
.el-radio{
  margin: 10pt;
}


// 上下 删除布局
.button-top{
  position: absolute;
  height: 20pt;
  width: 52%;
  text-align: end;
  transform: translate(0, -50%);
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

/* 背景相关的样式 */
html, body {
    
    height: 100%;
    position: absolute;
}
h1 {
    font-family: 'Lato','sans-serif';
    font-weight: 300;
    /* font-spacing:2px; */
    font-size: 48px;
}
.waves {
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: 0px;
    /* 最小值 */
    min-height: 10px;
    /* 最大值 */
    max-height: 150px;
}
.parallax>use {
    animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
}
/* 选择的一个use */
.parallax>use:nth-child(1) {
    /* 延迟 2s 执行 */
    animation-delay: -2s;
    /* 7s 内 执行完毕 */
    animation-duration: 7s;
}
.parallax>use:nth-child(2) {
      animation-delay: -3s;
      animation-duration: 10s;
}
.parallax>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}
.parallax>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}
/* 动画 */
@keyframes move-forever {
    0% {
        transform: translate3d(-90px,0,0);
    }
    100% {
        transform: translate3d(85px,0,0);
    }
}
.wavefooter{
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: -1;
}
</style>
