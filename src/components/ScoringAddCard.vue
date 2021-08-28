<template>
  <!--添加题目的对话框-->
    <div class="add-question-card">
    <el-divider></el-divider>
    <div>评分题</div>
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
      <el-form-item label="最大分值" prop="answer">
        <el-input-number v-model="questionForm.answer" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
      </el-form-item>
    </el-form>
    <!-- <div class="dialog-footer">
      <span> </span>
      <div>
        <el-button icon="el-icon-check" @click="finishQuestion" type="success">完成</el-button>
        <el-button icon="el-icon-close" @click="cancelQuestion" type="danger"> 取消</el-button>
      </div>
    </div> -->
    </div>
</template>
<script>

import axios from "axios";

export default {
  inject: ['reload'],
  name: "scoring-addcard",
  data(){
    return{
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
        answer: 0
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
    handleChange(value) {
      console.log(value);
    },
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
    },
    editQuestion(question){
      if (question.isShow) {
        this.editSuccess = true
        this.finishQuestion(question)
        return 
      }
      // 置空选项
      question.option_list = []
      this.questionForm = question
      console.log("answer", question.answer)
      this.flag = question.id
    },
    addChoice(title) {
      this.questionForm.option_list.push({
        title: title,
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
        if(!this.flag){
          for(var i = 0; i <= that.questionForm.answer; ++i){
            that.addChoice(i);
          }
          axios
              .post('/api/question/', {
                option_list: that.questionForm.option_list,
                title: that.questionForm.title,
                content: that.questionForm.content,
                type: that.questionForm.type,
                ordering: that.questionForm.ordering,
                questionnaire: that.$route.params.id,
                is_must_answer: that.questionForm.is_must_answer,
                is_show_result: that.questionForm.is_show_result
              })
              .then(function (response){
                // that.reload();'
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
                that.$notify.error({
                  title: '出错啦',
                  message: '编辑失败'
                })
                that.questionForm.isShow = true
              })
        }
        else{
          for(var i = 0; i <= that.questionForm.answer; ++i){
            that.addChoice(i);
          }
          axios
              .patch('/api/question/' + that.flag + '/', {
                option_list: that.questionForm.option_list,
                title: that.questionForm.title,
                content: that.questionForm.content,
                type: that.questionForm.type,
                ordering: that.questionForm.ordering,
                questionnaire: that.$route.params.id,
                is_must_answer: that.questionForm.is_must_answer,
                is_show_result: that.questionForm.is_show_result
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
.add-question-card{
  background: #fff;
  width: 100%;
  position: relative;
}
</style>
