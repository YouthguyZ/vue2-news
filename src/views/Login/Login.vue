<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="demo-loginForm">
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" style="width:100%" @click="hLogin">登录</el-button>
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    hLogin() {
      // 0.绑定事件
      // 1.兜底校验
      this.$refs.loginForm.validate(async valid => {
        // 趁早返回
        if (!valid) return
        // 2.发起请求
        const { data: res } = await this.$http.post('/api/login', this.loginForm)
        // console.log(res)
        // 3.提示用户
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // console.log(res)
        // 4.todo/跳转页面 存储token  token
        this.$store.commit('user/updateToken', res.token)
        // 5.跳转页面
        await this.$router.push('/')
        /* this.$http.post('/api/login', this.loginForm).then(
          ({ data: res }) => {
            if (res.code !== 0) return
            this.$message.success(res.message)
            this.$store.commit('user/updateToken', res.token)
            this.$router.push('/')
          }
        ) */
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 20px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
