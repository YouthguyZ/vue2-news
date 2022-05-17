<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form :model="regForm" status-icon :rules="regRules" ref="regForm"  class="demo-regForm">
        <el-form-item  prop="username">
          <el-input v-model="regForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"  ></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input v-model="regForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"  ></el-input>
        </el-form-item>
        <el-form-item  prop="rePassword">
          <el-input v-model="regForm.rePassword" placeholder="请确认密码" prefix-icon="el-icon-lock"  ></el-input>
        </el-form-item>
        <el-button type="primary" style="width:100%" @click="hReg">注册</el-button>
        <el-link type="info">去登录</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // vue/multi-word-component-names
  name: 'Reg',
  data() {
    // 自定义校验函数 此处value为repassword
    const checkPass = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 注册表单的数据对象
      regForm: {
        username: '',
        password: '',
        rePassword: ''
      },
      // 注册表单的验证规则对象
      regRules: {
        // 定义**用户名**的校验规则：
        username: [
          // required 必须上传的值
          // message 提示信息
          // trigger 触发事件
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // pattern:定义正则表达式
          { pattern: /^[a-zA-Z][a-zA-Z0-9]{0,9}$/, message: '请输入1-10位的不以数字开头的用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // pattern:定义正则表达式
          // \S为非空符 非空判断
          { pattern: /^\S{6,10}$/, message: '请输入6-10位的非空字符密码', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请确认输入密码', trigger: 'blur' },
          // pattern:定义正则表达式
          { pattern: /^\S{6,10}$/, message: '请输入正确的密码', trigger: 'blur' },
          // 自定义校验
          { validator: checkPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    hReg() {
      // 0.点击按钮绑定点击事件
      // 1.兜底校验
      this.$refs.regForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 2.发起请求
        const { data: res } = await this.$http.post('/api/reg', { username: this.regForm.username, password: this.regForm.password, repassword: this.regForm.rePassword })
        console.log(res)
        // 3.根据结果提示用户
        if (res.code === 1) this.$message.error(res.message)
        // 4.跳转登录页面
        this.$router.push('/login')
      })
    }

  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 20px;
    //防撑大，还原盒子
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
  }
}
</style>
