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
          <el-input type="password" v-model="form.pass" placeholder="请输入密码" clearable>
            <i slot="prefix" class="el-input__icon iconfont el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="form.checkPass" placeholder="请再次输入密码">
            <i slot="prefix" class="el-input__icon iconfont el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('form')">注册</el-button>
      </el-form>
    </div>
    <div class="msg">
      已有账号？<a @click="$router.push({path: '/login'})">立即登录></a>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios';
export default {
  name: "Register_Block",
  data() {
    var validateUser = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('你的用户名呢'));
      }
      else{
        callback();
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('你的密码呢'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('再输一次密码呗'));
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        user: '',
        pass: '',
        checkPass: ''
      },
      Response: null,
      rules: {
        user: [
          { validator: validateUser, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.signup();
        } else {
          this.$alert('宝批龙大不同，再仔细看一哈', '存在错误', {
            confirmButtonText: '我错了',
          }).then(() => {
            this.$message({
              type: 'info',
              message: '再给你一次机会'
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
    signup() {
      const that = this;
      axios
          .post('/api/user/', {
            username: this.form.user,
            password: this.form.pass,
          })
          .then(function (response) {
            that.Response = response.data;
            alert('用户注册成功，快去登录吧！');
            that.$router.push({path: '/login'});
          })
          .catch(function (error) {
            console.log(error.response);
            var msg = '';
            if(error.response.data.username !== undefined &&  error.response.data.username.length > 0 ) {
              var cnt = 1;
              msg = error.response.data.username[0];
              while(cnt < error.response.data.username.length) {
                msg = msg + '\r\n' + error.response.data.username[cnt];
                cnt ++;
              }
            }
            if(error.response.data.password !== undefined && error.response.data.password.length > 0) {
               var cnt = 1;
               msg = error.response.data.password[0];
               while(cnt < error.response.data.password.length) {
                 msg = msg + '\r\n' + error.response.data.password[cnt];
                 cnt ++;
               }
            }
            that.$notify.error({
              title: '好像发生了什么错误',
              message: msg,
            })
          });
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
