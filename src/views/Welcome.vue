<template>
  <div>
    <v-app>
      <v-carousel
          cycle
          height="400"
          hide-delimiter-background
          show-arrows-on-hover
      >
        <v-carousel-item
            v-for="(item, i) in items"
            :key="i"
            :src="item.src"
            class="fill-height"
        >
          <v-row justify="center">
              <h2>{{ item.title }}</h2>
          </v-row>
          <v-row justify="center">
            <h3>{{ item.subtitle }}</h3>
          </v-row>
          <v-row justify="center">
            <img :src="item.img"/>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <h1 class="title"> 问卷？摸鱼！🐟 两不误</h1>
      <p style="max-width: 568px;">
        这里是介绍（懒得写了
      </p>
      <v-container style="margin-bottom: 40px">
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn
                elevation="4"
                :min-width="btnWidth"
                color="primary"
                @click="$router.push({path: '/index'})"
                depressed
                x-large
            >
              <v-icon left>
                mdi-speedometer
              </v-icon>
              开始使用吧
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
                elevation="4"
                :min-width="btnWidth"
                color="primary"
                href="https://zhuanlan.zhihu.com/p/338360442"
                target="_blank"
                outlined
                x-large
            >
              <v-icon left>
                mdi-fish
              </v-icon>
              为什么选择摸鱼
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
                elevation="4"
                :min-width="btnWidth"
                color="#212121"
                dark
                depressed
                href="https://github.com"
                rel="noopener"
                target="_blank"
                x-large
            >
              <v-icon left>
                mdi-github
              </v-icon>
              GitHub
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider style="width: 50%; margin: 0 auto"></v-divider>
      <p style="max-width: 568px; margin-top: 40px">
        项目团队精心设计和打造多种不同类型的问卷类型以适应不同场合需求。 创建发布收集一条龙 — 预览相应的问卷模板，以便更好地做出选择。
      </p>
      <v-row justify="center" style="margin-bottom: 40px">
        <v-btn :min-width="btnWidth" @click="expand = !expand">
          问卷类型及模板预览
        </v-btn>
      </v-row>
      <v-expand-transition>
        <v-container style="margin-bottom: 40px" v-show="expand">
          <v-row justify="center">
            <template v-for="(item, index) in type">
              <v-col cols="auto" :key="index">
                <v-card
                    class="mx-auto"
                    min-width="200px"
                >
                  <v-img class="img"
                         :src="item.src"
                         max-height="120px"
                         max-width="120px"
                  ></v-img>

                  <v-card-title>
                    {{ item.title }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ item.subtitle }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                        color="orange lighten-2"
                        text
                    >
                      preview
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        icon
                        @click="item.show = !item.show"
                    >
                      <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                    </v-btn>
                  </v-card-actions>
                  <v-expand-transition>
                    <div v-show="item.show">
                      <v-divider></v-divider>
                      <v-card-text>
                        {{ item.content }}
                      </v-card-text>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-col>
              <!--            <v-responsive-->
              <!--                v-if="index === 2"-->
              <!--                :key="`width-${index}`"-->
              <!--                width="100%"-->
              <!--            ></v-responsive>-->
            </template>
          </v-row>
        </v-container>
      </v-expand-transition>

      <v-footer padless>
        <v-col
            class="text-center"
            cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>软件工程实践(1) 19组 摸鱼问卷</strong>
        </v-col>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data () {
    return {
      show: false,
      expand: false,
      btnWidth: 228,
      items: [
        {
          src: 'https://z3.ax1x.com/2021/06/17/2juuz6.jpg',
          title: '简约好用的问卷系统',
          subtitle: '简约好用，轻松开启在线调试',
          img: 'https://wj.qq.com/image/index_slider_p1.png?v=@version'
        },
        {
          src: 'https://z3.ax1x.com/2021/06/17/2ju6Fs.jpg',
          title: '数据实时统计在线分析',
          subtitle: '回收数据实时在线统计，图表化展示，清晰直观',
          img: 'https://wj.qq.com/image/index_slider_p2.png?v=@version'
        },
        // {
        //   src: 'https://z3.ax1x.com/2021/06/17/2juLSx.jpg',
        //   title: '跨终端跨平台自适应？',
        //   subtitle: 'PC、手机、平板不同终端自适应，调研随时随地',
        //   img: 'https://wj.qq.com/image/index_slider_p3.png?v=@version'
        // },
        // {
        //   src: 'https://z3.ax1x.com/2021/06/17/2jKZnS.jpg',
        //   title: '多方式创建编辑问卷？',
        //   subtitle: '自由创建、导入问卷、使用模板三种方式随意选择',
        //   img: 'https://wj.qq.com/image/index_slider_p0.png?v=@version'
        // },
      ],
      type: [
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/survey@2x.png',
          title: '普通问卷',
          subtitle: '预览模板',
          show: false,
          content: '这是普通问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/vote@2x.png',
          title: '投票问卷',
          subtitle: '预览模板',
          show: false,
          content: '这是投票问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/form@2x.png',
          title: '报名问卷',
          subtitle: '预览模板',
          show: false,
          content: '这是报名问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/exam@2x.png',
          title: '考试问卷',
          subtitle: '预览模板',
          show: false,
          content: '这是考试问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/360-evaluate@2x.png',
          title: '健康打卡',
          subtitle: '预览模板',
          show: false,
          content: '这是健康打卡的模板'
        },
      ]
    }
  },
}
</script>

<style scoped>
h2{
  color: #fff;
  padding-top: 50px;
  margin-top: 0;
  font-weight: normal;
  font-size: 50px;
  margin-bottom: 0;
}
h3{
  margin-top: -3px;
  font-size: 20px;
  color: #fff;
  font-weight: normal;
  margin-bottom: 10px
}
.title{
  text-align: center ;
  position: relative;
  margin-bottom: 40px;
  margin-top: 40px;
  font-size: 3rem!important;
  line-height: 3.125rem;
  letter-spacing: normal;
  font-weight: 400;
  font-family: Roboto,sans-serif!important;
}
p{
  font-family: Roboto,sans-serif;
  line-height: 1.5;
  text-align: center!important;
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 40px;
  margin-right: auto;
  margin-left: auto;
  max-width: 568px;
}
.img{
  margin:auto !important;
  /*padding: 30px 0 !important;*/
}
.mx-auto{
  padding-top: 20px;
}
/*.theme--light.v-application{*/
/*  background: transparent !important;*/
/*}*/
</style>

<style>

</style>
