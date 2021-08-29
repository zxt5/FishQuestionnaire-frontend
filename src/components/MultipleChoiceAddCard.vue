<template>
  <!--添加题目的对话框-->
    <div class="add-question-card">
    <el-divider></el-divider>
    <div>多选题</div>
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
      <el-form-item label="设置">

        <el-checkbox label="是否必填"
          v-model="questionForm.is_must_answer"></el-checkbox>

        <el-checkbox v-if="type === 'vote'" label="是否显示结果" v-model="questionForm.is_show_result"></el-checkbox>
        <el-checkbox v-if="type==='exam'" label="是否考试题" v-model="questionForm.is_scoring"></el-checkbox>
        <el-checkbox v-if="type==='signup'" label="是否设置限额" v-model="questionForm.is_limit_answer"></el-checkbox>
      </el-form-item>

<!--      <div style="display: flex;-->
<!--            margin-bottom: 20px;"> -->
<!--        <span style="margin-left:3%">选项</span> -->
<!--        <span style="margin-left:20%">选项内容</span>-->
<!--        <span style="margin-left:35%"><span v-show="questionForm.is_scoring"> 正确答案</span></span>-->
<!--        <span style="margin-left:12%">按钮</span>-->
<!--        </div>-->
      <el-divider></el-divider>

      <!-- <el-checkbox-group 
      @click.native="debugShow(questionForm.answer)"
       v-model="questionForm.answer" style="width:100%"> -->
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

        <el-checkbox 
        v-model="option.is_answer_choice"
        v-show="questionForm.is_scoring" :label="index">
          设为正确答案
        </el-checkbox>

        <el-button @click.prevent="removeChoice(option)" type="danger" style="margin-left: 20px">删除</el-button>
      </el-form-item>
      <!-- </el-checkbox-group> -->
      <el-form-item label="题目分数" v-show="questionForm.is_scoring">
        <el-input-number v-model="questionForm.question_score" :step="1"></el-input-number>
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
  props: {
    type: {
      type: String,
      default: 'normal'
    }
  },
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
    },
    editQuestion(question){
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
        if (this.questionForm.option_list.length === 0){
            this.editSuccess = false
          return this.$notify.error({
          title: '请至少添加一个选项噢~'})
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
    debugShow(item){
      console.log("item", item)
    }
  }
}
</script>
<style lang="less" scoped>
.el-button{
  color: #fff;
}
.choiceinput{
  width: 60%;
  margin-right: 3%;
}
.dialog-footer{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0;
}
</style>
