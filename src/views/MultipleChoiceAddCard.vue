<template>
  <!--添加题目的对话框-->
    <div class="add-question-card">
    <el-divider></el-divider>
    <el-form :model="questionForm"
             :rules="questionFormRules"
             ref="questionFormRef"
             label-width="80px"
    >
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
      <el-form-item
          v-for="(option, index) in questionForm.option_list"
          :label="'选项 ' + (index + 1) "
          :key="index"
          :prop="'option_list.' + index + '.title'"
          :rules="{
                    required: true,  message: '内容不能为空', trigger: 'blur'
                }">

        <el-input v-model="option.title" class="choiceinput">
        </el-input >
        <el-button @click.prevent="removeChoice(option)" type="danger">删除</el-button>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button icon="el-icon-edit" @click="addChoice" type="primary">新增选项</el-button>
      <!-- <div>
        <el-button icon="el-icon-check" @click="finishQuestion()" type="success">完成</el-button>
        <el-button icon="el-icon-close" @click="cancelQuestion" type="danger"> 取消</el-button>
      </div> -->
    </div>
     </div>
</template>
<script>

import axios from "axios";

export default {
  inject: ['reload'],
  name: "multiple-choice-addcard",
  data(){
    return{
      temp: '',
      editSuccess: true,
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
      if (question.isShow) {
        this.editSuccess = true
        this.finishQuestion()
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

    finishQuestion(){
      this.$refs.questionFormRef.validate(valid => {
        if (!valid){
          this.editSuccess = false
          return this.$notify.error({
          title: '表单有错误'});
        }
        if (this.questionForm.option_list.length < 2){
          this.editSuccess = false
          return this.$notify.error({
            title: '请至少添加两个选项噢~'
          })
        }
        console.log("questionForm", this.questionForm)
        if (this.questionForm.is_scoring){
          console.log(111)
          var has_answer = false
          for (var option of this.questionForm.option_list){
            if (option.is_answer_choice){
              has_answer = true
              break
            }
          }
          if (!has_answer){
            this.editSuccess = false
            return this.$notify.error({
             title: '请设置正确答案'});
          }
        }

        const that = this;
        if(!this.flag){
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
                // that.reload();
                that.editSuccess = true
                that.$notify.success({
                  title: '保存成功'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '编辑失败'
                })
                  that.questionForm.isShow = true
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
                that.editSuccess = true
                that.$notify.success({
                  title: '保存成功'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '编辑失败'
                })
                that.questionForm.isShow = true
              })
        }
      })
    },

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