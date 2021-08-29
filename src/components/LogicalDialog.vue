<template>
    <div>
        <el-dialog  :visible.sync="dialogVisible" title="逻辑跳转设置">
            <div class="logical-dialog-false" v-if="questionForm.type!='single-choice' && questionForm.type != 'multiple-choice'">
                暂且没有关联问题设置
            </div>
            <div class="logical-dialog" v-if="questionForm.type=='single-choice' || questionForm.type == 'multiple-choice'">

            <div class="logical-dialog-left">
                <ul>
                    <div v-for="(item, index) in questionForm.option_list" :key="item.id? item.id: item.key" >
                        选项名称
                    <a>
                    <li 
                    class="item-li"

                     @click="setLeft(item.id, index)"
                     :class="{'item-li-active': item.id == selectOptionID}"
                     >
                       {{item.title}}
                    </li>
                    </a>
                    </div>
                </ul>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="logical-dialog-right">
                <ul>
                    <div v-for="(item, index) in questionList" :key="item.id? item.id: item.key"
                    >
                    题目名称
                    <li 
                    class="item-li"
                    @click="setRight(item)"
                    :class="{'item-li-active':
                    questionForm.option_list? 
                    checkQuestion(item):false,
                    'item-li-self': index <= _index}"
                    >
                       <span v-show="isShowNum"> {{index+1}}.</span> {{item.title}}
                    </li>
                    </div>
                </ul>
                </div>
                
            </div>
        <div class="dialog-footer">
            <span></span>
      <div v-if="questionForm.type=='single-choice' || questionForm.type == 'multiple-choice'">
        <!-- <el-button icon="el-icon-check" @click="finishQuestion()" type="success">完成</el-button> -->
        <el-button icon="el-icon-check" type="primary" @click="finish"> 提交</el-button>
        <el-button icon="el-icon-close" @click="cancel" type="danger"> 取消</el-button>
      </div>
    </div>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return {
            dialogVisible: false,
            questionForm: {

            },
            _index: 0,
            questionList: {

            },
            selectOptionID: 0,
            selectOptionIndex: 0,
            isShowNum: true
        }
    },
    methods: {
        edit(questionList, index, isShowNum){
            this.questionList =  questionList
            this.questionForm = questionList[index]
            this.selectOptionID = this.questionForm.option_list[0].id
            this.dialogVisible = true
            this._index = index
            this.isShowNum = isShowNum
        },
        checkQuestion(item){
            var temp = this.questionForm.option_list[this.selectOptionIndex].related_logic_question
            for (var question of temp){
                if (item.id == question.id) return true
            }
            return false
        },
        setLeft(optionID, index){
            this.selectOptionID = optionID
            this.selectOptionIndex = index
            this.$forceUpdate()
        },
        setRight(question){
            console.log("option",this.questionForm.option_list[this.selectOptionIndex]) 
            // 选择当前选择的option
            var relQuestion = this.questionForm.option_list[this.selectOptionIndex].related_logic_question
            for (var index in relQuestion){
                if (question.id == relQuestion[index].id){
                    relQuestion.splice(index, 1)
                    return 
                }
            }
            relQuestion.push(question)
        },
        finish(){
           var params = {
               question_id : this.questionForm.id,
               relation_list: []
           }
           for (var option of this.questionForm.option_list){
               console.log("option", option.related_logic_question)
               for (var question of option.related_logic_question){
                   params.relation_list.push({
                       option: option.id,
                       question: question.id,
                   })
               }
           }
           axios
              .put('/api/question_option_logic_relation/edit/', params)
              .then(function (response){
                that.$notify.success({
                  title: '保存成功'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '编辑失败'
                })
                this.dialogVisible = true
              })
            this.dialogVisible = false
        },
        cancel(){
            this.dialogVisible = false
        }
    },
}
</script>
<style scoped>
.logical-dialog{
    display: flex;
    height: 400px;
}
.logical-dialog-false{
    text-align: center;
    font-size: 18pt;
}
.logical-dialog-left{
    width: 40%;
    background-color: #f7f7f7;
}
.logical-dialog-right{
    width: 60%;
}
.dialog-footer{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0;
}
.item-li{
    list-style-type:none;
    margin: 10px;
    font-size: 15px;
    cursor: pointer;
}
.item-li-active{
    background-color: #409eff;;
    color: #fff;
}
.item-li-self{
   pointer-events: none;
   background-color: #f7f7f7;
}
</style>
