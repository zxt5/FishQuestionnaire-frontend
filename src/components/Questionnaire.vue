<template>
  <div class="questionnaire" direction="vertical">
    <div>
      <h2 class="title" style="min-width: 800px">问卷列表</h2>
      <div class="not_found" v-if="!info.length">
        别看啦 这里啥也没有 <i class="el-icon-cold-drink"></i>
      </div>
      <div class="a_block" v-for="(item, index) in info.slice(4 * (page-1), 4 * page)" :key="index" >
        <h1 @click="toDiscuss(item.id)">
          <el-tag class="label" v-if="item.status === 'closed'">未发布</el-tag>
          <el-tag class="label" type="success" v-if="item.status === 'shared'">已发布</el-tag>
<!--          <el-tag class="label" type="danger" v-if="item.status === 'deleted'">已删除</el-tag>-->
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
              <li v-if="item.status === 'closed'" @click="Start(item.id)"><v-icon small>mdi-motion-play-outline</v-icon>  发布</li>
              <li v-if="item.status === 'shared'" @click="Close(item.id)"><v-icon small>mdi-stop-circle-outline</v-icon>  停止</li>
              <li><v-icon small>mdi-content-copy</v-icon>  复制</li>
              <li @click="Delete(item.id)"><v-icon small>mdi-delete-variant</v-icon>  删除</li>
            </ul>
            <el-dropdown style="margin-top: 5px" @command="handleCommand" >
              <span class="el-dropdown-link">
               更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">编辑</el-dropdown-item>
                <el-dropdown-item command="b">分享</el-dropdown-item>
                <el-dropdown-item command="e" divided>统计</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="created">
              {{ formatted_time(item.create_date) }}
            </div>
          </div>

        </div>
        <div class="clear_both"></div>
      </div>
      <div v-if="pageLength !== 0" class="text-center">
        <v-app>
          <v-container>
            <v-row justify="center" style="justify-content: center">
              <v-col cols="8">
                <v-container class="max-width">
                  <v-pagination
                      v-model="page"
                      :length="pageLength"
                      :total-visible="pageVisible"
                  ></v-pagination>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-app>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import authorization from "../utils/authorization";
export default {
  inject: ['reload'],
  data(){
    return {
      info: [],
      page: 1,
      itemPerpage: 4,
      pageLength: 0,
      pageVisible: 7,
    }
  },
  methods: {
    formatted_time: function (iso_date_string) {
      const date = new Date(iso_date_string);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },
    // toDiscuss(id){
    //   this.$router.push({path: '/discuss/' + id});
    // },
    // toCenter(username){
    //   this.$router.push({path: '/center/' + username});
    // },
    handleCommand(command) {
      this.$message('click on item ' + command);
    },
    Start(id) {
      const that = this;
      axios
          .put('api/questionnaire/' + id + '/status/', {
            status: "shared"
          })
          .then(function (response){
            that.$notify.success({
              title: '问卷成功发布!',
              message: '您可以进行分享'
            })
            that.reload();
            that.$alert('这是链接和二维码', '分享', {
              confirmButtonText: '确定',
            });
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '发布问卷失败'
            })
          })
    },
    Close(id) {
      const that = this;
      axios
          .put('api/questionnaire/' + id + '/status/', {
            status: "closed"
          })
          .then(function (response){
            that.$notify.success({
              title: '问卷已关闭!',
              message: ''
            })
            that.reload();
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '关闭问卷失败'
            })
          })
    },
    Delete(id) {
      const that = this;
      this.$confirm('您确定要删除该问卷吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        axios
          .put('api/questionnaire/' + id + '/status/', {
            status: "deleted"
          })
          .then(function (response){
            that.$notify.success({
              title: '问卷成功删除!',
              message: '您可以到回收站中恢复问卷'
            })
            that.reload();
          })
          .catch(function (error){
            that.$notify.error({
              title: '出错啦',
              message: '删除问卷失败'
            })
          })
      })
    }
  },
  mounted() {
    const that = this;
    authorization()
      .then(function (response){
        if(response[0]){
          axios
            .get('/api/user/' + response[1] + '/questionnaire/')
            .then(function(response){
              that.info = response.data;
              that.pageLength = parseInt((that.info.length + that.itemPerpage - 1) / that.itemPerpage);
              // console.log(that.pageLength);
              // console.log(that.info);
            })
            .catch(function (error){
              that.$notify.error({
                title: '好像发生了什么错误',
                message: error.message
              })
            })
        }
      })
  }
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
li{
  cursor: pointer;
}
.container{
  padding-bottom: 0;
  padding-top: 0;
}
</style>

<style>
.v-application--wrap {
  min-height: 0 !important;
}
</style>
