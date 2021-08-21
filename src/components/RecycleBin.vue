<template>
  <div class="questionnaire" direction="vertical">
    <div>
      <h2 class="title" style="min-width: 800px">回收站</h2>
      <div class="not_found" v-if="!info.length">
        别看啦 这里啥也没有 <i class="el-icon-cold-drink"></i>
      </div>
      <div class="a_block" v-for="item in info" :key="item" >
        <h1 @click="toDiscuss(item.id)">
          <el-tag class="label" v-if="item.mode === 'closed'">未发布</el-tag>
          <el-tag class="label" type="success" v-if="item.mode === 'shared'">已发布</el-tag>
          <el-tag class="label" type="danger" v-if="item.mode === 'deleted'">已删除</el-tag>
          <!--          <el-tag v-for="tag in item.tags" key="tag" class="label">{{tag}}</el-tag>-->
          <span style="display: inline-block; width: 3px"></span>
          <a>{{item.title}}</a>
        </h1>
        <div style="float:right !important;">
          <v-icon small style="vertical-align: center">mdi-file-document-multiple-outline</v-icon>  {{ item.answer_num }}
        </div>
        <div class="intro">{{item.content}}</div>

        <div class="footer">
          <div class="op cur_def">
            <ul>
              <li><v-icon small>mdi-autorenew</v-icon>  恢复</li>
              <li><v-icon small>mdi-delete-off-outline</v-icon>  彻底删除</li>
            </ul>
            <div class="created">
              {{ formatted_time(item.create_date) }}
            </div>
          </div>

        </div>
        <div class="clear_both"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data(){
    return {
      info: [
        {
          id: 1,
          title: '测试问卷',
          content: '求求各位姥爷填一下小的问卷吧',
          create_date : '2021-08-21 16:00',
          mode : 'deleted',
          answer_num: 123,
        },
        {
          id: 2,
          title: '测试问卷',
          content: '求求各位姥爷填一下小的问卷吧',
          create_date : '2021-08-21 16:00',
          mode : 'deleted',
          answer_num: 456,
        },
      ],
      avatar: '',
      is_final: true,
      cur_page: 0,
      max_num: 8,
      total: 0,
      loading: false,
    }
  },
  methods: {
    formatted_time: function (iso_date_string) {
      const date = new Date(iso_date_string);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },
    toDiscuss(id){
      this.$router.push({path: '/discuss/' + id});
    },
    toCenter(username){
      this.$router.push({path: '/center/' + username});
    },
    handleCommand(command) {
      this.$message('click on item ' + command);
    }
  },
  // mounted() {
  //   const that = this;
  //   axios
  //       .get('/api/forum/',{
  //         headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
  //       })
  //       .then(function (response){
  //         that.info = response.data;
  //         console.log(that.info);
  //       })
  //       .catch(function (error){
  //         that.$notify.error({
  //           title: '好像发生了什么错误',
  //           message: error.message
  //         })
  //       })
  //       .catch(function (error) {
  //         that.$notify.error({
  //           title: '好像发生了什么错误',
  //           message: error.message
  //         })
  //       });
  // }
}
</script>

<style scoped>
@import url("../assets/common.css");
.a_block{
  background-color: #fff;
  width: 100%;
  /*border-bottom: 2px solid purple;*/
  border-radius: 15px;
  margin: 0 0 10px;
  padding: 10px 15px 6px;
  position: relative;
  box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
}
.a_block>h1{
  margin:0 0 5px 0;
  padding-right:.5em;
  /* height:40px; */
  line-height: 40px;
  font-size:20px;
  width: fit-content;
  cursor: pointer;
  display: inline-block;
}

h1:hover{
  color: #d43f8d;
}

.a_block>.intro{
  padding: 0 2em;
  margin:10px 0;
  font-size:15px;
  color:#888;
  line-height: 1.5em;
}


.op{
  margin-top:15px;
  font-size:15px;
  vertical-align: text-top;
}

.op ul{
  padding-left:15px;
  line-height: 28px;
}

.op li{
  list-style: none;
  float:left;
  margin-right:25px;
  font-size: 13px;
}

.questionnaire {
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  opacity: 0.9;
}

.op>>>.el-input__icon{
  line-height:18px;
}

.author{
  float: right;
  font-size:15px;
  cursor: pointer;
}

.a_block>h1>.label{
  font-size:13px;
  height:23px;
  margin:0 3px 5px 3px;
  font-weight: normal;
  cursor: default;
  vertical-align: middle;
  line-height: 23px;
}

.intro{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-align: left;
  max-height: 80px;
}
.title {
  border-bottom: 2px solid purple;
  padding-bottom: 20px;
  margin-bottom: 10px;
}
.created {
  line-height: 28px;
  color: darkblue;
  font-size: small;
  float: right;
  display: flex;
  justify-content: space-between;
}
.footer{
  line-height: 18px;
}
.op{
  margin-top:15px;
  font-size:15px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
