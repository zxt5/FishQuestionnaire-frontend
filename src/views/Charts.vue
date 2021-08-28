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
        <div v-if="activeName==='second'" style="display: flex">

          <div class="block">
            <span class="demonstration">定义行 [一般为需要分析的题目，如爱好，意愿等，限10题。]</span>
            <div v-for="(i, index) in cross1" :key="index" style="float: left;margin-left: 18.6%;">
              <el-select  style="margin-bottom: 20px; width: 400px" v-model="i.value" filterable placeholder="请选择">
                <el-option
                    v-for="item in info.question_list"
                    v-if="item.type !== 'completion'"
                    :key="item.id"
                    :label="item.ordering + '. ' + item.title"
                    :value="item.id">
                </el-option>
              </el-select>
              <i @click="remove1(index)" class="el-icon-circle-close" style="margin-left: 10px; color: grey; cursor: pointer" v-if="cross1.length > 1"></i>
            </div>
            <el-button class="button" plain @click="add1" v-if="cross1.length < 10">新增题目</el-button>
          </div>
          <div class="block">
            <span class="demonstration">定义列 [一般为样本属性，如性别，年龄等，限10题。]</span>
            <div v-for="(i, index) in cross2" :key="index" style="float: left;margin-left: 18.6%;">
              <el-select  style="margin-bottom: 20px; width: 400px" v-model="i.value" filterable placeholder="请选择">
                <el-option
                    v-for="item in info.question_list"
                    v-if="item.type !== 'completion'"
                    :key="item.id"
                    :label="item.ordering + '. ' + item.title"
                    :value="item.id">
                </el-option>
              </el-select>
              <i @click="remove2(index)" class="el-icon-circle-close" style="margin-left: 10px; color: grey; cursor: pointer" v-if="cross2.length > 1"></i>
            </div>
            <el-button class="button" plain @click="add2" v-if="cross2.length < 10">新增题目</el-button>
          </div>

        </div>



<!--        <el-divider/>-->
        <el-button  type="primary" @click="crossGen()">生成</el-button>
        <el-divider/>
        <div v-for="(i, index) in table_list">
<!--          <div v-for="(j, jndex) in info.question_list">-->
            <div :id="'1-1-' + index" :ref="'1-1-' + index" class="image-div">
            </div>
<!--          </div>-->
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
      placeHoledStyle: {
        normal: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        },
        emphasis: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        }
      },
      dataStyle: {
        normal: {
          label : {
            show: true,
            position: 'insideLeft',
            formatter: '{c}%'
          }
        }
      },
      crossShow: false,
      cross1: [
        {
          value: '',
        },
      ],
      cross2:[
        {
          value: '',
        },
      ],

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
      myChart: [],
      crossName_x :[],
      crossName_y :[],
      crossMat:[],
      pre_list :[
        {
          title: "111",
          num: [85, 50],

        },{
          title: "2222",
          num: [15, 50],
        }
      ],
      name:["111","222"],
      table_list : [
        {
          question_x : {
            title: "问题1",
            type : "single-choice",
            ordering : 1
          },
          question_y : {
            title: "问题2",
            type : "multiple-choice",
            ordering : 2,
          },
          option_x_list : [
            {
              id : 231,
              title : "23号问题的选项1",
              num : 10, //小计
              cnt : 2,
              option_y_list : [
                {
                  id: 241,
                  title: "24号问题的选项1",
                  num : 10,
                  percent: 100.0,
                  percent_string: "100.00%"
                },
                {
                  id : 242,
                  title: "24号问题的选项2",
                  num : 0,
                  percent: 0.0,
                  percent_string: "0.00%"
                }
              ]
            },
            {
              id : 232,
              title : "23号问题的选项2",
              num : 3, //小计
              cnt : 2,
              option_y_list : [
                {
                  id : 241,
                  title: "24号问题的选项1",
                  num : 2,
                  percent: 0.0,
                  percent_string: "0.00%"
                },
                {
                  id : 242,
                  title: "24号问题的选项2",
                  num : 1,
                  percent: 0.0,
                  percent_string: "0.00%"
                }
              ]
            }
          ]
        }
      ],
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
    crossGen() {
      this.crossName_x.splice(0,this.crossName_x.length)
      this.crossName_y.splice(0,this.crossName_y.length)
      this.crossMat.splice(0,this.crossMat.length)
      this.myChart.splice(0,this.myChart.length)
      let question_x_list = [];
      let question_y_list = [];
      for (let item of this.cross1) {
        if(item.value !== '') question_x_list.push(item.value);
      }
      for (let item of this.cross2) {
        if(item.value !== '') question_y_list.push(item.value);
      }
      const that = this;
      axios.put('/api/questionnaire/' + this.info.id + '/cross-analysis/', {
        question_x_list : question_x_list,
        question_y_list : question_y_list,
        },{
        headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
      }
      ).then(function (response) {
        console.log(response.data);
        that.table_list = response.data.table_list;
      })
      setTimeout(()=>{
        this.genData();
        for (let i = 0; i < that.table_list.length; i ++) {
          this.myChart.push('');
          this.genrateCross(i, "1-1-" + i);
        }
      }, 500)


    },
    add1() {
      this.cross1.push({
        value: '',
      })
    },
    add2() {
      this.cross2.push({
        value: '',
      })
    },
    remove1(index) {
      this.cross1.splice(index, 1);
    },
    remove2(index) {
      this.cross2.splice(index, 1);
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
    genData(){
      for (let item of this.table_list) {
        let tmpName_x = [];
        let tmpName_y = [];
        let tmpMat = [];
        for (let subItem of item.option_x_list) {
          tmpName_x.push(subItem.title);
          let tmp = [];
          for (let ii of subItem.option_y_list) {
            tmp.push(ii.num);
          }
          console.log(tmp);
          tmpMat.push({
            name: subItem.title,
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              position: 'top'
            },
            emphasis: {
              focus: 'series'
            },
            data: tmp,
          });
        }
        this.crossMat.push(tmpMat);
        for (let subItem of item.option_x_list[0].option_y_list) {
          tmpName_y.push((subItem.title));
        }
        this.crossName_x.push(tmpName_x);
        this.crossName_y.push(tmpName_y);
        console.log(tmpName_x)
        console.log(tmpName_y)
      }
    },
    genrateCross(index, eid) {
      console.log(eid)
      if (this.myChart[index] != null && this.myChart[index] !== "" && this.myChart[index] !== undefined){
        this.myChart[index].dispose();
      }
      this.myChart[index] = this.$echarts.init(document.getElementById(eid));
      option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // Use axis to trigger tooltip
              type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          legend: {
            // data: ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine']
            data: this.crossName_x[index],
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: this.crossName_y[index],
          },
          series: this.crossMat[index],
      };
      this.myChart[index].setOption(option)
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
      else if(type === 3) {
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // Use axis to trigger tooltip
              type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          legend: {
            // data: ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine']
            data: this.crossName_x[index],
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: this.crossName_y[index],
          },
          series: this.crossMat[index],
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

.block{
  //padding: 30px 0;
  text-align: center;
  border-right: 1px solid #eff2f6;
  width: 50%;
  box-sizing: border-box;
}
.demonstration{
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.button{
  width: 400px !important;
  display: block;
  margin: 0 auto;
  //padding-left: 15px;
}
//.el-input--suffix .el-input__inner {
//  padding-right: 230px !important;
//}
</style>

