<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="preview" :src="preview" alt="" class="preview"/>
      <img v-else src="../../../assets/images/avatar.jpg" alt="" class="preview"/>

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input ref="fileinp" type="file" style="display:none" accept="image/*" @change='hPreviewChange'>
        <el-button type="primary" icon="el-icon-plus" @click="$refs.fileinp.click()">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled='!preview' @click="hUpload">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data() {
    return {
      preview: ''
    }
  },
  methods: {
    // 预览头像
    hPreviewChange(e) {
      // console.log(e)
      const file = e.target.files[0]
      if (file) {
        // 用户选择了文件
        // img的src只能设置为BASE64(DataURL)或URL
        // 需要将file文件对象转换为base64 字符串
        // fileReader
        // 1. 创建对象
        const fr = new FileReader()
        // console.log(fr)
        // 2. 读取文件
        fr.readAsDataURL(file)
        // 3.获取结果 监听时间
        fr.onload = (e) => {
          // 4.设置预览文件
          this.preview = e.target.result
        }
      } else {
        // 用户没选文件
        this.preview = ''
      }
    },
    async hUpload() {
      // 0.绑定事件
      // 1.发起请求
      const { data: res } = await this.$http.patch('/my/update/avatar', { avatar: this.preview })
      // console.log(res)
      // 2.提示用户
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 3.根据结果渲染数据
      this.$store.dispatch('user/getuserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
