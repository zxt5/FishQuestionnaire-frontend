<template>
  <div class="questionnaire">
    <!--标题-->
    <h1 class="title">{{title}}</h1>

    <div class="question_block" v-for="(item,index) in questionList">
      <div slot="header" class="clearfix">
        <div class="questionTitle">
          <!--显示必填标识-->
          <span style="color: #F56C6C;">
            <span v-if="item.is_must_answer">*</span>
            <span v-else>&nbsp;</span>
          </span>
          {{(index+1)+'.'+item.title}}
        </div>
      </div>

      <!--单选题展示-->
      <div class="single_choice" v-if="item.type=='single-choice'" v-for="optionItem in item.option_list">
        <el-radio v-model="single" :label="1" style="margin: 5px;">{{ optionItem.title }}</el-radio>
      </div>

      <!--多选题展示-->
      <el-checkbox-group v-if="item.type=='multiple-choice'" v-model="multiple">
        <div class="multiple_choice"  v-for="optionItem in item.option_list">
          <el-checkbox :label="optionItem.id" style="margin: 5px;">{{ optionItem.title }}</el-checkbox>
        </div>
      </el-checkbox-group>

      <!--填空题展示-->
      <!--        <el-input-->
      <!--            v-if="item.type=='completion'"-->
      <!--            type="textarea"-->
      <!--            :rows="item.row"-->
      <!--            v-model="item.textValue"-->
      <!--            resize="none">-->
      <!--        </el-input>-->

    </div>

    <!--内容结束-->
    <el-button class="button_submit" @click="alarm">提交</el-button>
    <div class="line"></div>
    <div class="text2"> 摸鱼问卷 提供技术支持 </div>

  </div>
</template>

<script>
import authorization from "../utils/authorization";
import axios from "axios";

export default {
  name: "FillQuestionnaire",
  components: {},
  data(){
    return {
      single: 0,
      multiple: [],
      questionnaire_id: 1,
      title: "问卷标题",
      questionList: [
        {
          id: 1,
          title: '第一题这个题很难啊为什么这么难呢难不难呢',
          type: 'single-choice',
          is_must_answer: true,
          option_list: [
            {
              id: 1,
              title: 'A.窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光窗前明月光',
            },
            {
              id: 2,
              title: 'B.疑是地上霜',
            },
            {
              id: 3,
              title: 'C.举头望明月',
            },
            {
              id: 4,
              title: 'D.低头思故乡',
            },
          ],
        },
        {
          id: 2,
          title: '第二题很简单很简单很简单',
          type: 'multiple-choice',
          is_must_answer: false,
          option_list: [
            {
              id: 1,
              title: 'A.窗前明月光',
            },
            {
              id: 2,
              title: 'B.疑是地上霜',
            },
            {
              id: 3,
              title: 'C.举头望明月',
            },
            {
              id: 4,
              title: 'D.低头思故乡',
            },
          ],

        },
      ],

    }
  },
  // mounted() {
  //   const that = this;
  //   authorization()
  //     .then(function (response){
  //       axios
  //         .get('/api/questionnaire/' + that.questionnaire_id,
  //             {
  //               headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
  //             }
  //         )
  //         .then(function (response){
  //           that.title= response.title;
  //           that.questionList = response.questions;
  //         })
  //         .catch(function (error) {
  //           that.$notify.error({
  //             title: '好像发生了什么错误',
  //             message: error.message
  //           })
  //         });
  //     })
  // },
  methods: {
    alarm(){
      alert('此问卷暂未发布，无法填写！');
    },
  }
}
</script>

<style scoped>

el-radio {
  width: 100%;
  text-overflow: ellipsis;
  white-space: normal;
}
p {
  line-height: 20px;
  font-size: 18px;
}

.questionTitle {
  padding-bottom: 5px;
}
.single_choice {
  padding-left: 15px;
}

.multiple_choice {
  padding-left: 15px;
}
.questionnaire{
  background-color: #F4F4F4;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  max-width: 1000px;
  min-width: 1000px;
}


.line{
  /*width: 90%;*/
  height: 1px;
  border-top: solid 1px;
  margin: 20px;
}

.question_block {
  margin-top: 20px;
  padding-left: 40px;
  padding-right: 40px;
}

/*.choice_question {*/
/*  margin-top: 20px;*/
/*  padding-left: 20px;*/
/*  padding-right: 40px;*/
/*}*/

.button_submit{
  margin-top: 20px;
  margin-left: 465px;
  margin-right: 465px;
  border-radius: 10px;
  background-color: #3F87DA;
  opacity: 0.7;
}

.text1{
  float: left;
  margin-left: 600px;
  margin-top: 18px;
}

.text2 {
  text-align: center;
  padding-bottom: 20px;
}

.reminder{
  background-color: #3F87DA;
  opacity: 0.7;
  margin-left: 0px;
  margin-right: 0px;
  min-height: 60px;
  overflow: hidden;
}

.title{
  text-align: center;
  padding-top: 30px;
  padding-bottom: 20px;
}

.button_back{
  float: right;
  margin-right: 50px;
  margin-top: 10px;
  border-radius: 10px;
}


</style>