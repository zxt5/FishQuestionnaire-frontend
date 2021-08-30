<template>
  <div class="el-main" >
    <div class="questionnaire" direction="vertical">
      <div>
        <v-app style="width: 10%;float: right">
          <v-btn
              class="white-space"
              color="primary"
              depressed
              elevation="2"
              @click="back()"
          ><v-icon small>mdi-arrow-left</v-icon>    返回</v-btn>
        </v-app>
        <h2 class="title" style="min-width: 800px">创建问卷</h2>
        <!--        <v-row justify="center" style="margin-bottom: 40px">-->
        <!--          <v-btn :min-width="btnWidth" @click="expand = !expand">-->
        <!--            问卷类型及模板预览-->
        <!--          </v-btn>-->
        <!--        </v-row>-->
        <v-app>
          <v-container style="margin: 40px auto">
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
                          color="#3F87DA"
                          text
                          @click="Create(item)"
                      >
                        create
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
        </v-app>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import authorization from "../utils/authorization";
import {Base64} from "js-base64";
export default {
  inject: ['reload'],
  data(){
    return {
      type: [
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/survey@2x.png',
          title: '普通问卷',
          subtitle: '点击 CREATE 创建',
          type: 'normal',
          show: false,
          content: '这是普通问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/vote@2x.png',
          title: '投票问卷',
          subtitle: '预览模板',
          type: 'vote',
          show: false,
          content: '这是投票问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/form@2x.png',
          title: '报名问卷',
          subtitle: '预览模板',
          type: 'signup',
          show: false,
          content: '这是报名问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/exam@2x.png',
          title: '考试问卷',
          subtitle: '预览模板',
          type: 'exam',
          show: false,
          content: '这是考试问卷的模板'
        },
        {
          src: 'https://www.wjx.cn/images/newimg/pic-2/360-evaluate@2x.png',
          title: '健康打卡',
          subtitle: '预览模板',
          type: 'epidemic-check-in',
          show: false,
          content: '这是健康打卡的模板'
        },
      ]
    }
  },
  methods: {
    back() {
      this.$router.push({path: '/index'});
    },
    Create(item){
      const that = this;
      authorization()
          .then(function (response) {
            if(response[0]){
              axios
                  .post('api/questionnaire/',{
                    title : item.title + '标题',
                    content : item.title + '描述',
                    type: item.type,
                  }, {
                    headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
                  })
                  .then(function (response){
                    // console.log(response.data);
                    // that.dialog=false;
                    let s1 = Base64.encode('moyu' + response.data.id + 'wenjuan')
                    that.$router.push({path: '/edit/' + s1});
                  }).catch(function (error){
                // that.dialog=false;
                that.$notify.error({
                  title: '出错啦',
                  message: '创建问卷失败',
                })
              })
            }
            else {
              // that.dialog=false;
              that.$notify.error({
                title: '创建问卷失败',
                message: '请先登录！'
              })
            }
          })
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
@import url("../assets/common.css");
.img{
  margin:auto !important;
  /*padding: 30px 0 !important;*/
}
.mx-auto{
  padding-top: 20px;
}
.white-space {
  white-space:pre
}
.el-main {
  background-color: transparent;
  margin: 40px auto 0;
  border-radius: 15px;
  /*opacity: 1;*/
  color: #333;
  height: fit-content;
  padding-top: 0 !important;
  padding-bottom: 0;
  width: 77%;
  justify-content: center;
  /*text-align: center;*/
}

.questionnaire {
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  opacity: 0.95;
}

.title {
  border-bottom: 2px solid purple;
  padding-bottom: 20px;
  margin-bottom: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

</style>

<style>
.v-application--wrap {
  min-height: 0 !important;
}
</style>
