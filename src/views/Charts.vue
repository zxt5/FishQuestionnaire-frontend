<template>
  <div >
    <!--主题内容区域-->
    <div class="button-header">
      <el-button type="primary" @click="downloadExcel">导出excel</el-button>
      <el-button type="danger" @click="getPdf()" style="margin-left: 20px">导出pdf</el-button>
    </div>
    <el-container class="main" id="pdfDom">
      <!--图像区域-->
      <el-main style="height: fit-content" class="questionnaire">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-bottom: 20px;font-size: large">
          <el-tab-pane label="统计分析" name="first"></el-tab-pane>
          <el-tab-pane label="交叉分析" name="second"></el-tab-pane>
        </el-tabs>
        <!--统计分析-->
        <!--折叠面板-->
        <div v-if="activeName==='first'" v-for="(answer, index) in info.question_list" :key="index">
          <span style="margin-left: 30px; font-weight: bolder">第{{(index+1)}}题： </span>
          <span style="margin-top: 20px;margin-bottom: 10px"> {{answer.title}} </span>
          <span style="margin-top: 20px;margin-left: 6px;color: darkgray" v-if="answer.type === 'single-choice'">[单选题]</span>
          <span style="margin-top: 20px;margin-left: 6px;color: darkgray" v-if="answer.type === 'multiple-choice'">[多选题]</span>
          <span style="margin-top: 20px;margin-left: 6px;color: darkgray" v-if="answer.type === 'completion'">[填空题]</span>
          <span style="margin-top: 20px;margin-left: 6px;color: darkgray" v-if="answer.type === 'scoring'">[评分题]</span>
          <!--          <span style="margin-top: 20px;margin-left: 10px"> [单选题] </span>-->
          <el-collapse v-model="tmp[index].activeNames" @change="handleChange(index)" style="margin-top: 10px">
            <el-collapse-item  name="2" style="margin-left: 10px">
              <template slot="title" v-if="answer.type === 'single-choice' || answer.type === 'multiple-choice'">
                选项结果 <i class="header-icon el-icon-info"></i>
              </template>
              <template slot="title" v-if="answer.type === 'completion'">
                填空结果 <i class="header-icon el-icon-info"></i>
              </template>
              <template slot="title" v-if="answer.type === 'scoring'">
                评分结果 <i class="header-icon el-icon-info"></i>
              </template>
              <el-table :data="answer.option_list" stripe style="margin-left: 20px" v-if="answer.type === 'single-choice' || answer.type === 'multiple-choice'">
                <el-table-column prop="title" label="选项">
                </el-table-column>
                <el-table-column prop="number" label="数量">
                </el-table-column>
                <el-table-column prop="percent_string" label="占比">
                </el-table-column>
              </el-table>

              <el-table :data="answer.option_list" stripe style="margin-left: 20px" v-if="answer.type === 'scoring'">
                <el-table-column prop="title" label="评分">
                </el-table-column>
                <el-table-column prop="number" label="数量">
                </el-table-column>
                <el-table-column prop="percent_string" label="占比">
                </el-table-column>
              </el-table>

              <el-table :data="answer.option_list[0].answer_list" stripe style="margin-left: 20px" v-if="answer.type === 'completion'">
                <el-table-column prop="ordering" label="序号">
                </el-table-column>
                <el-table-column prop="modified_time" label="提交答卷时间">
                </el-table-column>
                <el-table-column prop="content" label="答案文本">
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <!--图片-->
            <el-collapse-item  name="3" style="margin-left: 10px" v-if="answer.type !== 'completion'">
              <template slot="title">
                图表分析<i class="header-icon el-icon-info"></i>
              </template>
              <el-tabs v-model="tmp[index].activeChart" @tab-click="handleChartClick(index)" style="margin-left: 30px">
                <el-tab-pane v-for="(pane, subIndex) in tab_panes"
                             :key="subIndex" :label="pane.name">
                  <div :id="index+'-'+subIndex" :ref="index+'-'+subIndex" class="image-div"></div>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!--交叉分析-->
        <div v-if="activeName==='second'">
          <el-form label-width="80px"
                   :model="questionForm"
                   :rules="questionFormRules">
            <el-form-item
                v-for="(option, index) in questionForm.option_list"
                :label="'选项 ' + (index + 1) "
                :key="index"
                :prop="'option_list.' + index + '.title'"
                :rules="{
                    required: true,  message: '内容不能为空', trigger: 'blur'
                }"
            >
              <el-input v-model="option.title" class="choiceinput">
              </el-input >
              <el-button @click.prevent="removeChoice(option)" type="danger">删除</el-button>
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button icon="el-icon-edit" @click="addChoice" type="primary">新增选项</el-button>
            <div>
              <el-button icon="el-icon-check" @click="finishQuestion()" type="success">完成</el-button>
              <el-button icon="el-icon-close" @click="cancelQuestion" type="danger"> 取消</el-button>
            </div>
          </div>
        </div>
      </el-main>


    </el-container>
    <!--波浪-->
<!--    <wave></wave>-->
  </div>
</template>

<script>
import Wave from "../components/Wave.vue"
import authorization from "@/utils/authorization";
import axios from "axios";
import {Base64} from "js-base64";
var option;
export default {
  components: {Wave},

  data(){
    return {
      questionForm: {
        title: '',
        content: '',
        type: '',
        ordering: 0,
        questionnaire: 0,
        is_must_answer: false,
        option_list: [
          {
            title: '',
            content: '',
            ordering: 1,
            // key: Date.now()
          }
        ],
        answer: ''
      },
      questionFormRules:{
        title:[
          {
            required: true,
            message: '你的题目呢',
            trigger: 'blur'
          }
        ]
      },
      activeName: 'first',
      htmlTitle:'',
      // 当前用户
      userLogin: localStorage.getItem('username.myblog'),
      info: null,
      // 图标选项栏
      tab_panes:[
        {
          name: '柱状图',
          type: 0
        },
        {
          name: '饼状图',
          type: 1
        },
        {
          name: '圆环图',
          type: 2
        }
      ],
      tmp: [],
      nums:[],
      answers: [
        {
          activeChart: '0',
          activeNames: ['2',], // 折叠栏全部展开
          content: '第一个题目',
          type: "single-choice",
          result:[{
            content: "A",
            number: 2,
            percent: "10%"
          },
            {
              content: "B",
              number: 10,
              percent: "50%"
            },
            {
              content: "C",
              number: 8,
              percent: "40%"
            }
          ]
        },
        {
          activeChart: '0',
          activeNames: ['2',],
          content: '第二个题目',
          type: "single-choice",
          result:[{
            content: "A",
            number: 2,
            percent: "10%"
          },
            {
              content: "B",
              number: 10,
              percent: "50%"
            },
            {
              content: "C",
              number: 8,
              percent: "40%"
            }
          ]
        },
        {
          activeChart: '0',
          activeNames: ['2',], // 折叠栏全部展开
          content: '第三个题目',
          type: "single-choice",
          result:[{
            content: "A",
            number: 2,
            percent: "10%"
          },
            {
              content: "B",
              number: 10,
              percent: "50%"
            },
            {
              content: "C",
              number: 8,
              percent: "40%"
            }
          ]
        },
      ]
    }
  },

  mounted: function (){
    const that = this;
    authorization().then(function (response) {
      if(response[0]){
        let s1 = that.$route.params.text;
        s1 = Base64.decode(s1);
        s1 = s1.substring(4,s1.length - 7);
        axios
            .get('/api/questionnaire/' + parseInt(s1) + '/report/', {
              headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
            })
            .then(function (response) {
              that.info = response.data;
              that.htmlTitle = response.data.title + '_数据分析';
              // console.log(that.info);
              if('' + that.info.author.username !== '' + that.userLogin) {
                that.$router.push({path: '/index'});
                that.$notify.error({
                  title: '您无权查看此问卷',
                  // message: '爬',
                });
              }
              for (let item of that.info.question_list) {
                if(item.type === 'completion') {
                  that.tmp.push({
                    activeChart: '0',
                    activeNames: [],
                  });
                  let ord = 1;
                  for (let subItem of item.option_list[0].answer_list) {
                    // console.log(subItem.modified_time);
                    var time = subItem.modified_time;
                    var date = new Date(time).toJSON();
                    // console.log(date);
                    var str = new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,' ');
                    // console.log(str);
                    subItem.modified_time = str;
                    subItem.ordering = ord ++;
                  }
                }
                else {
                  that.tmp.push({
                    activeChart: '0',
                    activeNames: ['2',],
                  });
                }

                let data = [];
                let num = [];
                let percent = [];
                let pair = [];
                for (let subItem of item.option_list) {
                  data.push(subItem.title);
                  num.push(subItem.number);
                  percent.push(subItem.percent);
                  pair.push({
                    value: subItem.number,
                    name: subItem.title,
                  });
                }
                that.nums.push({
                  data: data,
                  num: num,
                  percent: percent,
                  pair: pair,
                })
              }
              // console.log(that.tmp);
              // console.log(that.answers);
            })
            .catch(function (error) {
              console.log(error);
              that.$notify.error({
                title: '好像发生了什么错误',
                // message: '',
              })
            })
      }
      else {
        that.$notify.error({
          title: '请先登录！',
          message: '',})
      }
    });
  },

  methods: {
    addChoice() {
      this.questionForm.option_list.push({
        title: '',
        content: '',
        ordering: this.questionForm.option_list.length + 1,
        // key: Date.now()
      })
    },
    removeChoice(item) {
      var index = this.questionForm.option_list.indexOf(item)
      if (index !== -1) {
        this.questionForm.option_list.splice(index, 1)
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(this.activeName)
    },
    downloadExcel() {
      let a = document.createElement('a')
      a.href ="http://49.233.52.139:8000/api/questionnaire/"+this.info.id+"/export-xls/";
      a.click();
    },
    init(){
      console.log(this.tmp);
      for (let i = 0; i < this.answers.length; i++){
        for (let j = 0; j < 3; j++){
          this.generateChart(i+'-'+j, j)
        }
      }
      },
    handleChange(index) {
      for (let j = 0; j < 3; j++) {
        this.generateChart(index, index + '-' + j, j);
      }
    },
    handleChartClick(index){
      for (let j = 0; j < 3; j++) {
        this.generateChart(index, index + '-' + j, j);
      }
    },
    generateChart(index, eid, type){
      console.log(eid)
      var myChart = this.$echarts.init(document.getElementById(eid))
      if (type === 0){
        option = {
          // title: {
          //   text: 'ECharts 入门示例'
          // },
          tooltip: {},
          legend: {
            data:['数量']
          },
          xAxis: {
            data: this.nums[index].data,
          },
          yAxis: {},
          series: [{
            // name: '销量',
            type: 'bar',
            data: this.nums[index].num,
          }]
        }
      }
      else if(type === 1){
        option = {
          // title: {
          //   text: '某站点用户访问来源',
          //   subtext: '纯属虚构',
          //   left: 'center'
          // },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              // name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: this.nums[index].pair,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
      }else if(type === 2){
        option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              // name: '访问来源',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: this.nums[index].pair
            }
          ]
        };
      }
      myChart.setOption(option)
    }
  },

}
</script>
<style lang="less" scoped>

// 全部主题区域布局
.main{
  position: relative;
  width: 70%;
  left: 50%;
  height: 100%;
  margin-top: 20pt;
  transform: translate(-50%);
}
.choiceinput{
  width: 70%;
  margin-right: 10%;
}
.questionnaire {
  //padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  opacity: 0.95;
  margin-bottom: 40px;
  margin-top: 20px;
}

.el-main {
  //background-color: #E9EEF3;
  //color: #333;
  //border-radius: 10px;
  //margin-left: 15pt;
  /*padding-top: 50px;*/
}
.button-header{
  position: relative;
  text-align: center;
  margin-top: 20pt;
  color: #fff;
}
.el-collapse{
  margin: 20pt;
}
.image-div{
  position: relative;
  width: 400pt;
  height: 300pt;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 10%);
}
</style>
