<template>
  <!--添加题目的对话框-->
    <div class="add-question-card">
    <el-divider></el-divider>
    <div>单选题</div>
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
          
        <el-checkbox v-if="type === 'vote'" label="是否显示结果" v-model="questionForm.is_show_result"></el-checkbox>
        <el-checkbox v-if="type ==='exam'" label="是否考试题" v-model="questionForm.is_scoring"></el-checkbox>
        <el-checkbox v-if="type==='signup'" label="是否设置限额" v-model="questionForm.is_limit_answer"></el-checkbox>
      </el-form-item>

<!--      <div style="display: flex;-->
<!--            margin-bottom: 20px;"> -->
<!--        <span style="margin-left:3%">选项</span> -->
<!--        <span style="margin-left:20%">选项内容</span>-->
<!--        <span style="margin-left:33%">-->
<!--          <span v-if="type==='signup'">选项限额</span>-->
<!--          <span v-if="type==='exam'">选项限额</span>-->
<!--        </span>-->
<!--        <span style="margin-left:6.5%">按钮</span>-->
<!--        </div>-->
<el-divider></el-divider>

      <el-radio-group style="width:100%" @click.native="debugShow" v-model="questionForm.answer">
      <el-form-item
          v-for="(option, index) in questionForm.option_list"
          :label="'选项 ' + (index + 1) "
          :key="index"
          :prop="'option_list.' + index + '.title'"
          :rules="{
                    required: true,  message: '内容不能为空', trigger: 'blur'
                }"
      >
        <el-input v-model="option.title" class="choiceinput">
        </el-input >
        <el-radio  v-show="questionForm.is_scoring" :label="index">设为正确答案</el-radio>
        <span v-if="type==='signup'">限额数量：</span>
        <el-input  v-if="type==='signup'" :disabled="!questionForm.is_limit_answer" :label="index" v-model="option.limit_answer_number" style="width: 10%; margin-right: 20px; margin-left: 10px">
          <span></span></el-input>
        <el-button @click.prevent="removeChoice(option)" type="danger">删除</el-button>
      </el-form-item>
      </el-radio-group>
      <el-form-item label="题目分数"  prop="question_score"  v-show="questionForm.is_scoring">
        <el-input-number v-model="questionForm.question_score" :step="1"></el-input-number>
      </el-form-item>

    </el-form>
    <div class="dialog-footer">
      <el-button icon="el-icon-edit" @click="addChoice" type="primary">新增选项</el-button>
      <div>
        <span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>

import axios from "axios";

export default {
  // inject: ['reload'],
  name: "single-choice-addcard",
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
        is_limit_answer: false,
        option_list: [
        ],
        answer: '',
        is_show_result: false,
        is_scoring: false
      },
      questionFormRules:{
        title:[
          {
            required: true,
            message: '你的题目呢',
            trigger: 'blur'
          }
        ],
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
        key: Date.now(),
        is_answer_choice: false,
        related_logic_question: [],
        key: Date.now()
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
        if (that.questionForm.is_scoring){
          for (var option in that.questionForm.option_list){
              that.questionForm.option_list[option].is_answer_choice = false
          }
          var index = that.questionForm.answer
          that.questionForm.option_list[index].is_answer_choice = true
        }

        let numFlag = true;
        if (that.questionForm.is_limit_answer){

          let numReg = /^[0-9]*$/;
          let numRe = new RegExp(numReg);
          for (var option in that.questionForm.option_list){
            that.questionForm.option_list[option].is_limit_answer = true;
            if(numRe.test(that.questionForm.option_list[option].limit_answer_number)) {
              let num = parseInt(that.questionForm.option_list[option].limit_answer_number);
              if(num < 0) numFlag = false;
            }
            else numFlag = false;
          }
        }
        else {
          for (var option in that.questionForm.option_list){
            that.questionForm.option_list[option].is_limit_answer = false;
          }
        }

        if(numFlag === false) {
          that.$notify.error({
            title: '限额必须为非负整数！',
            message: '编辑失败'
          })
          that.questionForm.isShow = true
          console.log(error)
          return;
        }

        if(!this.flag){
          axios
              .post('/api/question/', {
                option_list: that.questionForm.option_list,
                title: that.questionForm.title,
                content: that.questionForm.content,
                type: that.questionForm.type,
                questionnaire: that.$route.params.id,
                is_must_answer: that.questionForm.is_must_answer,
                is_show_result: that.questionForm.is_show_result,
                is_scoring: that.questionForm.is_scoring,
                is_limit_answer: that.questionForm.is_limit_answer,
                question_score: that.questionForm.question_score
              }, {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
              })
              .then(function (response){
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
                for (let i = 0; i < question.option_list.length; i++){
                    if (question.option_list[i].is_answer_choice){
                        question.answer = i
                    }
                }

              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '编辑失败'
                })
                that.questionForm.isShow = true
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
                is_show_result: that.questionForm.is_show_result,
                is_scoring: that.questionForm.is_scoring,
                is_limit_answer: that.questionForm.is_limit_answer,
                question_score: that.questionForm.question_score
              }, {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
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
    debugShow(){
      console.log("debug", this.questionForm)
    }
  }
}
</script>
<style lang="less" scoped>
.add-question-card{
  background: #fff;
  width: 100%;
  position: relative;
}
.el-button{
  color: #fff;
}
.choiceinput{
  width: 60%;
  margin-right: 3%;
}

</style>
<style>
.dialog-footer{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin-bottom: 20px;
}

</style>