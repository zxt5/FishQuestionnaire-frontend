<template>
  <!--添加题目的对话框-->
  <el-dialog
      title="添加题目(单项填空题)"
      width="50%"
      :visible.sync="addDialogVisible"
      @close="cancelQuesiton">
    <el-form :model="questionForm"
             :rules="questionFormRules"
             ref="questionFormRef"
             label-width="80px">
      <el-form-item label="题目表述" prop="content">
        <el-input placeholder="请输入题目描述"
                  v-model="questionForm.content" :autosize="true"
                  type="textarea" :clearable="true" resize="none"> </el-input>
      </el-form-item>
      <el-form-item label="是否必选" prop="ismust">
        <el-switch v-model="questionForm.ismust"
                   active-color="#409eff"
                   inactive-color="#dcdfe6"></el-switch>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <span> </span>
      <div>
        <el-button icon="el-icon-check" @click="finishQuestion" type="success">完成</el-button>
        <el-button icon="el-icon-close" @click="cancelQuestion" type="danger"> 取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>

export default {
  name: "single-completion-add-card",
  data(){
    return{
      temp: '',
      addDialogVisible : false,
      questionForm: {
        content: '',
        ismust: false,
        groups: [
        ],
        answer: ''
      },
      questionFormRules:{
        content:[
          {
            required: true,
            message: '请填写题目描述',
            tragger: 'blur'
          }
        ]
      }
    }
  },
  methods:{
    resetForm(questionType){
      this.questionForm = {
        key: Date.now(),
        type: questionType,
        content: '',
        ismust: false,
        groups: [
        ],
        answer: ''
      }
    },
    addQuestion(questionType){
      this.resetForm(questionType)
      this.addDialogVisible = true
    },
    editQuestion(question){
      this.temp = question
      this.questionForm = JSON.parse(JSON.stringify(question))
      this.addDialogVisible = true
    },
    addChoice() {
      this.questionForm.groups.push({
        content: '',
        key: Date.now()
      })
    },
    finishQuestion(){
      this.$refs.questionFormRef.validate(valid => {
        if (!valid) return this.$notify.error("表单有错误");
        this.addDialogVisible = false
        var index = this.$parent.questionnair.questions.indexOf(this.questionForm)
        if (index === -1){
          this.$parent.questionnair.questions.push(this.questionForm)
        }
        else{
          this.$parent.questionnair.questions[index] = this.questionForm
          this.$parent.$forceUpdate()
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
  width: 90%;
  margin-right: 10%;
}
.dialog-footer{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0;
}
</style>
