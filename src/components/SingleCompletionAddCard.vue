<template>
  <!--添加题目的对话框-->
    <div class="add-question-card">
    <el-divider></el-divider>
    <div>填空题</div>
    <el-form :model="questionForm"
             :rules="questionFormRules"
             ref="questionFormRef"
             label-width="80px">
      <el-form-item label="题目标题" prop="title">
        <el-input placeholder="请输入题目标题"
                  maxlength="30"
                  show-word-limit
                  v-model="questionForm.title" :autosize="true"
                  type="textarea" :clearable="true" resize="none"> </el-input>
      </el-form-item>
      <el-form-item label="备注" prop="content">
        <el-input placeholder="请输入题目备注"
                  maxlength="60"
                  show-word-limit
                  v-model="questionForm.content" :autosize="true"
                  type="textarea" :clearable="true" resize="none"> </el-input>
      </el-form-item>
      <el-form-item label="设置">
       <el-checkbox label="是否必填"
          v-model="questionForm.is_must_answer"></el-checkbox>
        <el-checkbox v-if="type==='exam'" label="是否考试题" v-model="questionForm.is_scoring"></el-checkbox>
      </el-form-item>
      
      <el-form-item label="正确答案" v-if="questionForm.is_scoring" prop="answer">
        <el-input v-model="questionForm.answer"></el-input>
      </el-form-item>
      <el-form-item label="题目分数" v-show="questionForm.is_scoring">
        <el-input-number v-model="questionForm.question_score" :step="1"></el-input-number>
      </el-form-item>

    </el-form>
    <div class="dialog-footer">
      <span> </span>
      <!-- <div>
        <el-button icon="el-icon-check" @click="finishQuestion()" type="success">完成</el-button>
        <el-button icon="el-icon-close" @click="cancelQuestion" type="danger">取消</el-button>
      </div> -->
    </div>
    </div>
</template>
<script>

import axios from "axios";
import {Base64} from "js-base64";

export default {
  // inject: ['reload'],
  name: "single-completion-addcard",
  props: {
    type: {
      type: String,
      default: 'normal'
    }
  },
  data(){
    return{
      temp: '',
      editSuccess : true,
      flag : 0,//判断创建还是修改问题
      questionForm: {
        title: '',
        content: '',
        type: '',
        ordering: 0,
        questionnaire: 0,
        is_must_answer: false,
        option_list: [
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
        ],
        answer:[
          {
            required: true,
            message: '你的答案呢',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods:{
    resetForm(questionType){
      this.questionForm = {
        // key: Date.now(),
        type: questionType,
        title: '',
        is_must_answer: false,
        option_list: [
        ],
        answer: ''
      }
    },
    addQuestion(questionType){
      this.resetForm(questionType)
      this.flag = 0
      this.addDialogVisible = true
    },
    reloadQuestion(question){
      this.questionForm = question
    },
    editQuestion(question){

      console.log("single-choice", question.type)
      if (question.isShow) {
        this.editSuccess = true
        this.finishQuestion(question)
        return 
      }
      this.questionForm = question
      this.flag = question.id
    },
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

    finishQuestion(question){
      this.$refs.questionFormRef.validate(valid => {
        if (!valid){
          this.editSuccess = false
          return this.$notify.error({
          title: '表单有错误'});
        }
        const that = this;
        this.questionForm.option_list[0].title = '正确答案';
        if(!this.flag){
          let s1 = that.$route.params.text;
          s1 = Base64.decode(s1);
          s1 = s1.substring(4,s1.length - 7);
          axios
              .post('/api/question/', {
                option_list: that.questionForm.option_list,
                answer: that.questionForm.answer,
                title: that.questionForm.title,
                content: that.questionForm.content,
                type: that.questionForm.type,
                ordering: that.questionForm.ordering,
                questionnaire: parseInt(s1),
                is_must_answer: that.questionForm.is_must_answer,
                is_show_result: that.questionForm.is_show_result,
                is_scoring: that.questionForm.is_scoring,
                question_score: that.questionForm.question_score
              })
              .then(function (response){
                // that.reload();
                that.editSuccess = true
                that.$notify.success({
                  title: '保存成功'
                })
                var data = response.data
                for (var key in data){
              　　if(data.hasOwnProperty(key)){
                    question[key] = data[key]
                  }
                }
              })
              .catch(function (error){
                that.questionForm.isShow = true
                that.$notify.error({
                  title: '出错啦',
                  message: error.message
                })
                console.log(error)
              })
        }
        else{
          let s1 = that.$route.params.text;
          s1 = Base64.decode(s1);
          s1 = s1.substring(4,s1.length - 7);
          axios
              .patch('/api/question/' + that.flag + '/', {
                option_list: that.questionForm.option_list,
                answer: that.questionForm.answer,
                title: that.questionForm.title,
                content: that.questionForm.content,
                type: that.questionForm.type,
                ordering: that.questionForm.ordering,
                questionnaire: parseInt(s1),
                is_must_answer: that.questionForm.is_must_answer,
                is_show_result: that.questionForm.is_show_result,
                is_scoring: that.questionForm.is_scoring,
                question_score: that.questionForm.question_score
              })
              .then(function (response){
                // that.reload();
                console.log(response)
                that.editSuccess = true
                that.$notify.success({
                  title: '保存成功'
                })
              })
              .catch(function (error){
                that.questionForm.isShow = true
                console.log(error.data)
                that.$notify.error({
                  title: '出错啦',
                  message: '编辑失败'
                })
              })
        }
      })
    },

    cancelQuestion(){
      this.$refs.questionFormRef.resetFields()
      this.addDialogVisible = false
    }

  }
}
</script>
<style lang="less" scoped>
.el-button{
  color: #fff;
}
.choiceinput{
  width: 70%;
  margin-right: 10%;
}
.dialog-footer{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0;
}
</style>
