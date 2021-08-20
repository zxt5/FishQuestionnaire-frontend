<template>
  <div class="header">
    <el-menu
        default-active="1"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#fff"
        text-color="#333"
        active-text-color="purple">
      <h1>
        <a class="logo" @click="$router.push({path:'/index'})"></a>
      </h1>
      <el-menu-item index="1" @click="toIndex">首页</el-menu-item>
      <el-menu-item index="2" @click="$router.push({path:'/book'})">我的问卷</el-menu-item>
      <el-menu-item index="3" @click="$router.push({path:'/questionnairs'})">创建问卷</el-menu-item>
      <div class="user">
        <span class="el-dropdown-link" @click="goLogin" v-if="!hasLogin">
          <el-avatar>登录</el-avatar>
        </span>
        <el-dropdown @command="handleCommand"  v-else>
          <span class="el-dropdown-link" @click="">
            <el-avatar :src="avatar">{{username}}</el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
<!--            <el-dropdown-item command="toCenter">个人空间</el-dropdown-item>-->
<!--            <el-dropdown-item command="messageList">消息中心</el-dropdown-item>-->
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
<!--      <div class="search">-->
<!--        <div>-->
<!--          <el-input v-model="search" placeholder="搜索图书" maxLength="100" @keyup.native.enter="toSearch">-->
<!--            <el-button slot="append" icon="el-icon-search" @click="toSearch"></el-button>-->
<!--          </el-input>-->
<!--        </div>-->
<!--      </div>-->
    </el-menu>
  </div>
</template>

<script>
import axios from "axios";
import authorization from "../utils/authorization";
export default {
  name: "Header",
  data() {
    return {
      activeIndex: 1,
      hasLogin: false,
      search: '',
      avatar: '',
      username: '',
      id:'',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(command) {
      if(command === 'logout'){
        this.logout();
      }
      else if(command === 'createBlog'){
        this.$router.push({path: '/edit/blog'});
      }
      else if(command === 'toCenter'){
        // console.log('/center/' + this.username);
        this.$router.push({path: '/center/' + this.username});
      }
      else if(command === 'messageList'){
        this.$router.push({path: '/messageList'})
      }
      else
        this.$message('click on item ' + command);
    },
    goLogin(){
      this.$router.push({path: '/login', query: {from: this.$route.path}});
    },
    logout() {
      localStorage.clear();
      // window.location.reload(false);
      this.$router.push({path: '/login'});
      this.$notify.success({
        title: '登出成功',
        message: '欢迎下次光临'
      })
    },
    toIndex(){
      this.$router.push({path: '/index'});
    },
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
    myPre() {
      const that = this;
      authorization()
          .then(function (response){
            that.hasLogin = response[0];
            if(response[0]){
              axios
                  .get('/api/user/' + response[1] + '/')
                  .then(function (response) {
                    const data = response.data;
                    that.avatar = data.profile.avatar;
                    that.username = data.username;
                    that.id = data.profile.id;
                    // console.log('header ' + that.username);
                  })
                  .catch(function (error){
                    this.$notify.error({
                      title: '好像发生了什么错误',
                      message: error.message
                    })
                  })
            }
          })
    }
  },
  mounted() {
    this.myPre();
  },
  watch: {
    '$route'(to, from) {
      if (to.name === 'Home' || to.name === 'Index' || to.name === 'Login' || to.name === 'index') {
        this.myPre();
      }
    }
  },
}
</script>

<style scoped>
@import url("../assets/common.css");
.header{
  z-index: 5;
  opacity: 0.95;
  /*font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif !important;*/
}

.header li{
  font-size: medium;
}

.header .el-menu-item.is-active{
  font-weight: bolder;
}

.header .el-menu-item:hover{
  background: whitesmoke !important;
}

.el-menu-item{
  margin:0 10px !important;
}



h1{
  float: left;
  height: 61px;
  margin: 0;
  width: 150px;
  cursor: pointer;
}

h1 a{
  color: black;
  text-decoration: none;
  display: inline-block;
  width: 100%;
  height: 100%;
}

h1 a:hover{
  opacity: 0.8;
}

.logo{
  background-image: url("../assets/logo2.png");
  background-size: 130px;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.1s linear opacity;
}

.user{
  float: right;
  margin: 10px 40px 10px 20px;
  height: 40px;
  overflow: hidden;
}

.el-dropdown-link{
  cursor: pointer;
  display: inline-block;
  width: 50px;
}

.header .el-button{
  padding: 0;
  width: 40px;
  height: 40px;
}

.search{
  float: right;
  width: 300px;
  margin: 10px 20px !important;
  height: 40px;
}

</style>
