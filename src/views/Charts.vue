<template>
  <div >
    <!--主题内容区域-->
    <div class="button-header">
      <el-button type="primary" >导出excel</el-button>
      <el-button type="danger">导出pdf</el-button>
    </div>
    <el-container class="main">
      <!--图像区域-->
      <el-main style="height: fit-content">
        <!--折叠面板-->
        <div v-for="(answer, index) in answers" :key="index">
          <div>第 {{' '+(index+1)+' '}} 题</div>
          <el-collapse v-model="answer.activeNames" @change="handleChange">
            <!--题目描述-->
            <el-collapse-item name="1">
              <template slot="title">
                题目描述<i class="header-icon el-icon-info"></i>
              </template>
              {{answer.content}}
            </el-collapse-item>
            <!--表格结果-->
            <el-collapse-item  name="2">
              <template slot="title">
                选项结果<i class="header-icon el-icon-info"></i>
              </template>
              <el-table :data="answer.result" stripe>
                <el-table-column prop="content" label="选项">
                </el-table-column>
                <el-table-column prop="number" label="数量">
                </el-table-column>
                <el-table-column prop="percent" label="占比">
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <!--图片-->
            <el-collapse-item  name="3">
              <template slot="title">
                图表分析<i class="header-icon el-icon-info"></i>
              </template>
              <el-tabs v-model="activeChart" @tab-click="handleChartClick(index)">
                <el-tab-pane v-for="(pane, subIndex) in tab_panes"
                             :key="subIndex" :label="pane.name">
                  <div :id="index+'-'+subIndex" :ref="index+'-'+subIndex" class="image-div"></div>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-main>
    </el-container>
    <!--波浪-->
    <wave></wave>
  </div>
</template>

<script>
import Wave from "../components/Wave.vue"
var option;
export default {
  components: { Wave},
  mounted: function (){
    for (let i = 0; i < this.answers.length; i++){
      for (let j = 0; j < 3; j++){
        this.generateChart(i+'-'+j, j)
      }
    }
  },
  data(){
    return {
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
      answers: [
        {
          activeChart: '0',
          activeNames: ['1', '2', '3'], // 折叠栏全部展开
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
          activeNames: ['1', '2', '3'],
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
      ]
    }
  },
  methods: {
    handleChange(val) {
    },
    handleChartClick(index){
      console.log(index)
    },
    generateChart(eid, type){
      console.log(eid)
      var myChart = this.$echarts.init(document.getElementById(eid))
      if (type == 0){
        option = {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data:['销量']
          },
          xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
      else if(type == 1){
        option = {
          title: {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: [
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'},
                {value: 484, name: '联盟广告'},
                {value: 300, name: '视频广告'}
              ],
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
      }else if(type == 2){
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
              name: '访问来源',
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
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'},
                {value: 484, name: '联盟广告'},
                {value: 300, name: '视频广告'}
              ]
            }
          ]
        };
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>

// 全部主题区域布局
.main{
  position: relative;
  width: 70%;
  left: 50%;
  height: 100%;
  margin-top: 10pt;
  transform: translate(-50%);
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  border-radius: 10px;
  margin-left: 15pt;
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
