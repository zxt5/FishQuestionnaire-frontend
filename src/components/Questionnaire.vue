<template>
  <div class="questionnaire" direction="vertical">
    <div>
      <h2 class="title" style="min-width: 800px">问卷列表</h2>
      <div class="not_found" v-if="!info.length">
        别看啦 这里啥也没有 <i class="el-icon-cold-drink"></i>
      </div>
      <div class="a_block" v-for="item in info" :key="item" >
        <h1 @click="toDiscuss(item.id)">
<!--          <el-tag class="label" type="success">讨论</el-tag>-->
          <el-tag v-for="tag in item.tags" key="tag" class="label">{{tag}}</el-tag>
          <span style="display: inline-block; width: 3px"></span>
          <a>{{item.title}}</a>
        </h1>
        <div class="intro">{{item.body}}</div>
        <div class="footer">
<!--          <div class="author" @click="toCenter(item.author.username)">-->
<!--            <span style="line-height: 28px; vertical-align: middle;display: inline-block;height: 28px; margin-right:3px">{{item.author.username}}</span>-->
<!--            <el-avatar :src="item.author.avatar ? item.author.avatar : ''" size="small" style="vertical-align: middle; opacity: 0.9"></el-avatar>-->
<!--          </div>-->
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
      is_final: true,
      cur_page: 0,
      max_num: 8,
      total: 0,
      loading: false,
      info: [
        {
          id: 1,
          title: '测试问卷',
          tags: ['未发布'],
          body: '测试内容',
        },
      ],
      avatar: '',
    }
  },
  methods: {
    toDiscuss(id){
      this.$router.push({path: '/discuss/' + id});
    },
    toCenter(username){
      this.$router.push({path: '/center/' + username});
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

.footer{
  line-height: 18px;
}

.op{
  margin-top:15px;
  font-size:15px;
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
</style>
