<template>
    <!--添加题目的对话框-->
    <el-dialog
        title="添加题目(单选题)"
        width="50%"
        :visible.sync="addDialogVisible">
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

            <el-form-item
                v-for="(choice, index) in questionForm.groups"
                :label="'选项 ' + (index+1) "
                :key="choice.key"
                :prop="'groups.' + index + '.content'"
                :rules="{
                    required: true,  message: '内容不能为空', trigger: 'blur'
                }"
            >
             <el-input v-model="choice.content" class="choiceinput">
             </el-input >
             <el-button @click.prevent="removeChoice(choice)" type="danger">删除</el-button>
            </el-form-item>
        </el-form>
        <el-button icon="el-icon-edit" @click="addChoice" type="primary">新增选项</el-button>
        <el-button icon="el-icon-check" @click="finishQuestion" type="success">完成</el-button>
        <el-button icon="el-icon-close" @click="cancelQuestion" type="danger"> 取消</el-button>
    </el-dialog>
</template>
<script>

export default {
    name: "single-choice-addcard",
    data(){
        return{
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
          console.log(question)
          this.questionForm = question
          this.addDialogVisible = true
      },
      addChoice() {
        this.questionForm.groups.push({
          content: '',
          key: Date.now()
        })
      },
    removeChoice(item) {
        var index = this.questionForm.groups.indexOf(item)
        if (index !== -1) {
          this.questionForm.groups.splice(index, 1)
        }
      },
    finishQuestion(){
        this.$refs.questionFormRef.validate(valid => {
            if (!valid) return this.$notify.error("表单有错误");
            if (this.questionForm.groups.length === 0) return this.$notify.error("请至少添加一个选项哦")
            this.addDialogVisible = false
            var index = this.$parent.questionnair.questions.indexOf(this.questionForm)
            if (index === -1){
                this.$parent.questionnair.questions.push(this.questionForm)
            }
        })
    },
    cancelQuestion(){
        console.log(111)
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
</style>
