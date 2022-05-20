<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="UpdatePwd">修改密码</el-button>
        <el-button @click="$refs.pwdForm.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserPwd',
  data() {
    // 自定义校验
    // 新密码与旧密码是否一致
    const checkNewpsd = (rule, value, callback) => {
      if (value === this.pwdForm.old_pwd) {
        callback(new Error('两次输入的密码一致!'))
      } else {
        callback()
      }
    }
    const checkRepsd = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '请输入6-15非空密码', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '请输入6-15非空密码', trigger: 'blur' },
          { validator: checkNewpsd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '请输入6-15非空密码', trigger: 'blur' },
          { validator: checkRepsd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    UpdatePwd() {
      // 1.兜底校验
      this.$refs.pwdForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.patch('/my/updatepwd', this.pwdForm)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.$refs.pwdForm.resetFields()
      })
      // 2.发起请求
      // 3.提示用户
      // 4.清空表单
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
