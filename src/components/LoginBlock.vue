<template>
  <el-card class="card">
    <div>
      <h2><figure></figure></h2>
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="0" class="demo-form">
        <el-form-item prop="user">
          <el-input type="text" v-model="form.user" placeholder="请输入用户名" clearable>
            <i slot="prefix" class="el-input__icon iconfont el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="form.pass" placeholder="请输入密码"
                    clearable @keypress.native.enter="submitForm('form')">
            <i slot="prefix" class="el-input__icon iconfont el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form>
    </div>
    <div class="msg">
      没有账号？<a @click="$router.push({path: '/register'})">立即注册></a>
    </div>
  </el-card>
</template>

<script>
import axios from "axios";
export default {
  name: "Login_Block",
  inject: ['reload'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    var validateUser = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('用户名不能为空'));
      }
      else{
        callback();
      }
    };
    return {
      form: {
        user: '',
        pass: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        user: [
          { validator: validateUser, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.signIn();
        } else {
          this.$alert('请再仔细看一下', '存在错误', {
            confirmButtonText: '确认',
          }).then(() => {
            this.$message({
              type: 'info',
              message: '重新尝试'
            });
          });
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    signIn() {
      const that = this;
      axios
          .post('/api/token/', {
            username: that.form.user,
            password: that.form.pass,
          })
          .then(function (response) {
            const storage = localStorage;
            // Token 被设置为100分钟，因此这里加上6000000毫秒
            const expiredTime = Date.parse(response.headers.date) + 6000000;
            // 设置 localStorage
            storage.setItem('access.myblog', response.data.access);
            storage.setItem('refresh.myblog', response.data.refresh);
            storage.setItem('expiredTime.myblog', expiredTime);
            storage.setItem('username.myblog', that.form.user);
            storage.setItem('identity.myblog', response.data.identity);
            // 路由跳转
            // 登录成功后回到首页
            that.$router.push({path: '/index'});
            location.reload();
          })
          .catch(function (error){
            console.log(error.response);
            that.$notify.error({
              title: '用户名不存在或密码错误！',
            })
          })
    },
  }
}
</script>

<style scoped>
h2{
  text-align: center;
  margin: 0 auto 10px;
}

h2>figure{
  background-image: url("../assets/logo1.png");
  height: 130px;
  background-size: 220px;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.1s ease background-size;
}

h2>figure:hover{
  background-size: 230px;
}
.card{
  position: absolute;
  height: auto;
  width: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
}

.demo-form{
  width:280px;
  margin:0 auto;
}

.iconfont{
  margin-left:2px;
}

.el-button{
  width: 100%;
  color: white;
  background-image: linear-gradient(to right, #0250c5, #3F87DA);
  text-align: center;
  margin: 10px auto;
  height: 40px;
  letter-spacing: 3em;
  text-indent: 2em;
}

.el-button:hover{
  background-color: #3F87DA;
}

.msg{
  display: block;
  cursor: pointer;
  text-align: center;
  width:auto;
  font-size: 14px;
  margin: 15px auto 0;
}

.msg a:hover{
  text-decoration: underline;
  color: #3F87DA;
}


</style>
