<template>

  <div>
    <div class="reminder"  v-if="info.status==='closed'">
      <h4 class="text1">
        摸小鱼温馨提示：只能看看，不能填写哦~
      </h4>
      <el-button class="button_back">
        返回
      </el-button>
    </div>

    <div class="questionnaire" onload="init">
      <!--标题-->
      <h1 class="title" >{{info.title}}</h1>

      <div class="content">&nbsp;{{info.content}}</div>
      <div class="line"></div>


      <div class="question_block" v-for="(item,index) in info.question_list" >
        <div slot="header">
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
        <div>
          <div class="single_choice" v-if="item.type==='single-choice'" v-for="optionItem in item.option_list">
            <el-radio v-model="answer_list[index]" :label="optionItem.ordering" style="margin: 5px;">{{ optionItem.title }}{{optionItem.content}}</el-radio>
          </div>
        </div>

        <!--&lt;!&ndash;        多选题展示&ndash;&gt;-->
        <!--        <el-checkbox-group v-if="item.type==='multiple-choice'" v-model="answer_list[index]" onload>-->
        <!--          <div class="multiple_choice"  v-for="optionItem in item.option_list">-->
        <!--            <el-checkbox :label="optionItem.ordering" style="margin: 5px;">{{ optionItem.title }}{{optionItem.content}}</el-checkbox>-->
        <!--          </div>-->
        <!--        </el-checkbox-group>-->

        <!--填空题展示-->
        <el-input style="padding-left: 12px;padding-top: 5px;width: 98%"
                  placeholder="请在此输入答案~"
                  v-if="item.type==='completion'"
                  type="textarea"
                  maxlength="150"
                  show-word-limit
                  :autosize="{minRows: 2}"
                  :rows="item.row"
                  v-model="answer_list[index]"
                  resize="none">
        </el-input>

      </div>
      <!--内容结束-->
      <el-button class="button_submit" @click="click">提交</el-button>
      <div class="line"></div>
      <div class="text2"> 摸鱼问卷 提供技术支持 </div>

    </div>
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
      content: '',
      info: '',
      answer_list: [],
    }
  },
  mounted() {
    const that = this;
    axios
        .get('/api/questionnaire/' + this.questionnaire_id)
        .then(response => (this.info = response.data))
        .catch(function (error){
          that.$notify.error({
            title: '好像发生了什么错误',
            message: error.message
          })
        })
  },
  methods: {
    init() {
      console.log("zhixing");
      let i = 0;
      for( let a in this.info.question_list) {
        if(a.type === 'single-choice') {
          let t = 'aaa';
          this.answer_list[i++] = t;
        }
        else if(a.type === 'multiple-choice') {
          let t = [];
          this.answer_list[i++] = t;
        }
        else {
          let t = 'bbb';
          this.answer_list[i++] = t;
        }
      }
    },
    click(){
      if(this.info.status==='closed') alert('此问卷暂未发布，无法填写！');
      this.answer_list.push(this.multiple);
      console.log(this.answer_list);
      // 提交问卷
      // else {
      //   axios
      //       .post('/api/questionnaire/' + this.questionnaire_id)
      //       .then(response => (this.info = response.data))
      //       .catch(function (error){
      //         that.$notify.error({
      //           title: '好像发生了什么错误',
      //           message: error.message
      //         })
      //       })
      // }
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

.button_submit{
  margin: 20px 465px 15px;
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
  margin-top: 10px;
  color: #555555;
  font-size: 15px;
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
  padding-top: 40px;
  padding-bottom: 15px;
}

.button_back{
  float: right;
  margin-right: 50px;
  margin-top: 10px;
  border-radius: 10px;
}


</style>