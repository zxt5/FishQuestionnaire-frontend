<template>
  <div class="el-main" >
    <div class="questionnaire" direction="vertical">
      <div>
        <h2 class="title" style="min-width: 800px">搜索结果</h2>
        <div class="not_found" v-if="!info.length">
          无搜索结果~ <i class="el-icon-cold-drink"></i>
        </div>
        <div class="a_block" v-for="(item, index) in info.slice(4 * (page-1), 4 * page)" :key="index" >
          <h1 @click="toCheck(item.id)">
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
                <li v-if="item.status === 'closed'" @click="Start(item)"><v-icon>mdi-motion-play-outline</v-icon>  发布</li>
                <li v-if="item.status === 'shared'" @click="Close(item.id)"><v-icon>mdi-stop-circle-outline</v-icon>  停止</li>
                <!--              <li><v-icon small>mdi-content-copy</v-icon>  复制</li>-->
                <li @click="toEdit(item)"><v-icon small>mdi-square-edit-outline</v-icon>  编辑</li>
                <li @click="showSharePage(item)"><v-icon small>mdi-share-variant-outline</v-icon>  分享</li>
                <li @click="toChart(item)"><v-icon small>mdi-list-status</v-icon>  统计</li>
                <li @click="Delete(item.id, item.status)"><v-icon small>mdi-delete-variant</v-icon>  删除</li>
              </ul>
              <!--            <el-dropdown style="margin-top: 5px" @command="handleCommand" >-->
              <!--              <span class="el-dropdown-link">-->
              <!--               更多<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
              <!--              </span>-->
              <!--              <el-dropdown-menu slot="dropdown">-->
              <!--                <el-dropdown-item command="a">编辑</el-dropdown-item>-->
              <!--                <el-dropdown-item command="item.id">分享</el-dropdown-item>-->
              <!--                <el-dropdown-item command="e" divided>统计</el-dropdown-item>-->
              <!--              </el-dropdown-menu>-->
              <!--            </el-dropdown>-->
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
        <el-dialog title="分享问卷" :visible.sync="is_show" :close-on-click-modal="true" class="share_window" @opened="makeQrcode" append-to-body>
          <el-form ref="form" :model="shareInfo" label-width="80px" >
            <el-form-item label="问卷链接" style="width: 100%;">
              <el-row>
                <el-col :span="16">
                  <el-input v-model="shareInfo.url" readonly></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button style="margin-left: 5px;" v-clipboard:copy="shareInfo.url" v-clipboard:success="copySuccess" v-clipboard:error="copyError">复制</el-button>
                  <el-button style="margin-left: 5px;" @click="openShareUrl">打开</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="二维码" style="width: 100%;">
              <canvas id="canvas" style="width: 150px;height: 150px;"></canvas>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import authorization from "../utils/authorization";
import QRCode from 'qrcode';
export default {
  inject: ['reload'],
  components:{QRCode},
  data(){
    return {
      search:null,
      info: [],
      page: 1,
      itemPerpage: 4,
      pageLength: 0,
      pageVisible: 7,
      is_show: false,
      shareInfo:{
        url:'',
      },
    }
  },
  methods: {
    toSearch(){
      if(this.search === ''){
        this.$notify.warning({
          title: '别搞',
          message: '搜索不能为空哦'
        })
      }
      else{
        this.$router.push({path: '/search/' + this.search})
      }
    },

    formatted_time: function (iso_date_string) {
      const date = new Date(iso_date_string);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },
    toEdit(item){
      if(item.answer_num === 0){
        this.$router.push({path: '/edit/' + item.id})
      }
      else{
        // this.$notify.warning({
        //   title: '此问卷暂无答卷',
        //   message: '请先回收问卷'
        // })
        const that = this;
        this.$confirm('请选择清空所有答卷或者复制这份问卷', '此问卷已存在答卷', {
          confirmButtonText: '清空答卷',
          cancelButtonText: '复制问卷',
          type: 'warning'
        }).then(() => {
          axios
              .put('/api/questionnaire/delete-all-answer/', {
                id: item.id,
              }, {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
              })
              .then(function (response){
                that.reload();
                that.$notify.success({
                  title: '芜湖',
                  message: '已清空答卷'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '清空失败'
                })
              })
        }).catch(() => {
          axios
              .post('/api/questionnaire/copy/', {
                id: item.id
              })
              .then(function (response){
                that.reload();
                that.$notify.success({
                  title: '芜湖',
                  message: '复制成功'
                })
              })
              .catch(function (error){
                that.$notify.error({
                  title: '出错啦',
                  message: '复制失败'
                })
              })
        });
      }
    },
    toChart(item){
      if(item.answer_num === 0){
        this.$notify.warning({
          title: '此问卷暂无答卷',
          message: '请先回收问卷'
        })
      }
      else{
        this.$router.push({path: '/charts/' + item.id});
      }
    },
    showSharePage(item) {
      if(item.status === 'shared'){
        this.is_show = true;
        this.shareInfo.url=window.location.origin+"/fill/" + item.id;//问卷链接
      }
      else{
        this.$notify.warning({
          title: '问卷关闭',
          message: '请先发布问卷'
        })
      }
    },
    makeQrcode(){
      const canvas = document.getElementById('canvas');
      QRCode.toCanvas(canvas,this.shareInfo.url);
    },
    copySuccess(){
      // console.log(e);
      this.$message({
        type: 'success',
        message: '已复制链接到剪切板'
      });
    },
    //复制分享链接失败
    copyError(){
      // console.log(e);
      this.$message({
        type: 'error',
        message: '复制失败'
      });
    },
    //打开分享链接
    openShareUrl(){
      window.open(this.shareInfo.url);
    },
    toCheck(id){
      this.$router.push({path: '/check/' + id});
    },
    // toCenter(username){
    //   this.$router.push({path: '/center/' + username});
    // },
    handleCommand(command) {
      if(command === 'b'){
        this.showSharePage()
      }
    },
    Start(item) {
      const that = this;
      axios
          .put('/api/questionnaire/' + item.id + '/status/', {
            status: "shared"
          })
          .then(function (response){
            that.$notify.success({
              title: '问卷成功发布!',
              message: '您可以进行分享'
            })
            // that.reload();
            item.status = 'shared';
            that.showSharePage(item);
            // that.$alert('这是链接和二维码', '分享', {
            //   confirmButtonText: '确定',
            // });
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
          .put('/api/questionnaire/' + id + '/status/', {
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
    Delete(id, status) {
      if(status === 'shared'){
        this.$notify.warning({
          title: '桥豆麻袋',
          message: '请先关闭问卷'
        })
      }
      else{
        const that = this;
        this.$confirm('您确定要删除该问卷吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          axios
              .put('/api/questionnaire/' + id + '/status/', {
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
    }
  },
  mounted() {
    const that = this;
    console.log(that.$route.query.type)
    if(that.$route.query.type) {
      that.search = JSON.parse(that.$route.query.type);
    }
    else {
      authorization()
          .then(function (response){
            if(response[0]){
              axios
                  .put('/api/questionnaire/search/',{
                    keyword: that.$route.params.text,
                  }, {
                    headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
                  })
                  .then(function(response){
                    console.log(response.data);
                    that.info = response.data;
                    that.pageLength = parseInt((that.info.length + that.itemPerpage - 1) / that.itemPerpage);
                    // console.log(that.pageLength);
                    // console.log(that.info);
                  })
                  .catch(function (error){
                    that.$notify.error({
                      title: '好像发生了什么错误',
                      // message: error.message
                    })
                  })
            }
            else {
              that.$notify.error({
                title: '请先登录！',
                // message: error.message
              })
            }
          })
    }
  }
}
</script>

<style scoped>
@import url("../assets/common.css");
.search{
  /*background-color: #333333;*/
  float: right;
  width: 300px;
  /*margin: 10px 20px !important;*/
  height: 40px;
}
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
.el-main {
  background-color: transparent;
  margin: 40px auto 0;
  border-radius: 15px;
  opacity: 1;
  color: #333;
  height: fit-content;
  padding-top: 0 !important;
  padding-bottom: 0;
  width: 77%;
  justify-content: center;
  /*text-align: center;*/
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
  margin-top: 15px;
  font-size: 15px;
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
.share_window {
  border-radius: 10px;
  color: #e67b79;
  /*background-color: #e67b79;*/
}
</style>

<style>
.v-application--wrap {
  min-height: 0 !important;
}
</style>
