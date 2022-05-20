<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="userForm" :rules="userFormRules" ref="userForm" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="hSubmit">提交修改</el-button>
        <el-button @click="$refs.userForm.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      // 此处为浅拷贝：只拷贝地址 修改数据会改变vue 上视图层
      // userForm: this.$store.state.user.userinfo,
      // 深拷贝方法
      // 0. 安装的vuex-persistedstate 会深拷贝
      // 1. 简单方法 展开运算符
      userForm: { ...this.$store.state.user.userinfo },
      // 2. lodash方法
      // 3. json方法
      // userForm: JSON.parse(JSON.stringify(this.$store.state.user.userinfo)),
      // 4. Es6 源拷贝  第一个为新对象，第二个为拷贝源
      // userForm: Object.assign({}, this.$store.state.user.userinfo),
      // 表单的验证规则对象
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    hSubmit() {
      // 0.绑定事件
      // 1. 兜底校验
      this.$refs.userForm.validate(async valid => {
        // 趁早返回
        if (!valid) return
        // 2. 通过后发起请求
        const { data: res } = await this.$http.put('/my/userinfo', this.userForm)
        // console.log(res)
        // 3. 提示用户
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 4. 根据结果重新获取数据
        this.$store.dispatch('user/getuserInfo')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
