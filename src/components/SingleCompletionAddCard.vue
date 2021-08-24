<template>
  <!--添加题目的对话框-->
  <el-dialog
      title="添加题目[单项填空题]"
      width="50%"
      :visible.sync="addDialogVisible">
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
      <el-form-item label="是否必选" prop="is_must_answer">
        <el-switch v-model="questionForm.is_must_answer"
                   active-color="#409eff"
                   inactive-color="#dcdfe6"></el-switch>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <span> </span>
      <div>
        <el-button icon="el-icon-check" @click="finishQuestion()" type="success">完成</el-button>
        <el-button icon="el-icon-close" @click="cancelQuestion" type="danger">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>

import axios from "axios";

export default {
  inject: ['reload'],
  name: "single-completion-addcard",
  data(){
    return{
      temp: '',
      addDialogVisible : false,
      // title: '',
      // content: '',
      // type: '',
      // ordering: 0,
      // questionnaire: 0,
      // is_must_answer: false,
      // option_list: [],
      // answer: '',
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
    editQuestion(question){
      this.temp = question
      this.questionForm = JSON.parse(JSON.stringify(question))
      this.flag = question.id
      // console.log(this.questionForm);
      this.addDialogVisible = true
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

    finishQuestion(){
      this.$refs.questionFormRef.validate(valid => {
        if (!valid) return this.$notify.error({
          title: '表单有错误'
        });
        this.addDialogVisible = false;
        const that = this;
        if(this.flag === 0){
          this.questionForm.option_list.push({
            title: that.questionForm.title,
            content: that.questionForm.content,
            ordering: that.questionForm.option_list.length + 1,
            // key: Date.now()
          })
          axios
              .post('/api/question/', {
                option_list: that.questionForm.option_list,
                title: that.questionForm.title,
                content: that.questionForm.content,
                type: that.questionForm.type,
                ordering: that.questionForm.ordering,
                questionnaire: that.$route.params.id,
                is_must_answer: that.questionForm.is_must_answer,
              })
              .then(function (response){
                that.reload();
                that.$notify.success({
                  title: '保存成功'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: error.message
                })
                console.log(error)
              })
        }
        else{
          axios
              .patch('/api/question/' + that.flag + '/', {
                option_list: that.questionForm.option_list,
                title: that.questionForm.title,
                content: that.questionForm.content,
                type: that.questionForm.type,
                ordering: that.questionForm.ordering,
                questionnaire: that.$route.params.id,
                is_must_answer: that.questionForm.is_must_answer,
              })
              .then(function (response){
                that.reload();
                that.$notify.success({
                  title: '保存成功'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '编辑失败'
                })
              })
        }
        // console.log(this.$parent.info.questions_list.length);
        // var index = this.$parent.info.questions_list.indexOf(this.temp)
        // if (index === -1){
        //   this.$parent.info.questions_list.push(this.questionForm);
        // }
        // else{
        //   this.$parent.info.questions_list[index] = this.questionForm
        //   this.$parent.$forceUpdate()
        // }
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
