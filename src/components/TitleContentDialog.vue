<template>
  <!--添加题目的对话框-->
  <div class="add-question-card">
    <el-form :model="questionForm"
             :rules="questionFormRules"
             ref="questionFormRef"
             label-width="80px">
      <el-form-item label="问卷标题" prop="title">
        <el-input placeholder="请输入标题"
                  v-model="questionForm.title" :autosize="true"
                  type="textarea" :clearable="true" resize="none"> </el-input>
      </el-form-item>

      <el-form-item label="问卷描述" prop="content">
        <el-input placeholder="请输入问卷描述"
                  v-model="questionForm.content" :autosize="true"
                  type="textarea" :clearable="true" resize="none"> </el-input>
      </el-form-item>
    </el-form>
    <!-- <div class="dialog-footer">
      <span></span>
      <div>
        <el-button icon="el-icon-check" @click="finishQuestion" type="success">完成</el-button>
        <el-button icon="el-icon-close" @click="cancelQuestion" type="danger"> 取消</el-button>
      </div>
    </div> -->
  </div>
</template>
<script>

import axios from "axios";
import {Base64} from "js-base64";

export default {
  inject: ['reload'],
  name: "title-content-dialog",
  data(){
    return{
      temp: '',
      addDialogVisible : false,
      flag : 0,//判断创建还是修改问题
      questionForm: {

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
    edit(info){
      this.flag = 1
      // 完成编辑
      if (this.addDialogVisible){
        this.finishQuestion()
        this.addDialogVisible = false
        return
      }
      this.questionForm = info
      this.addDialogVisible = true
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
            let s1 = that.$route.params.text;
            s1 = Base64.decode(s1);
            s1 = s1.substring(4,s1.length - 7);
            axios
                .patch('/api/questionnaire/'+ parseInt(s1)+'/', {
                  title: that.questionForm.title,
                  content: that.questionForm.content,
                })
                .then(function (response){
                  // that.reload();
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
      )
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
add-question-card{
  background: #fff;
  width: 100%;
  position: relative;
  padding: 35px;
}
// .dialog-footer{
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   padding: 0;
// }
</style>