<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addVisible=true">添加分类</el-button>
      </div>
      <el-table
        :data="catelist"
        stripe
        border
        style="width: 100%">
        <el-table-column
          style="width:50"
          type="index"
          label="序号"
         >
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="分类名称"
          >
        </el-table-column>
        <el-table-column
          prop="cate_alias"
          label="分类别名">
        </el-table-column>
        <el-table-column
          label="操作">
          <el-button size="mini" type="primary">修改</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  dialog 弹出框组件 -->
    <el-dialog
      title="添加文章分类"
      :close-on-click-modal='false'
      @closed='$refs.addForm.resetFields()'
      :visible.sync="addVisible"
      width="35%">
      <!-- 添加的表单 -->
        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="70px">
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addcatelist">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  data() {
    return {
      // 用来接ajax数据
      catelist: [],
      // 默认隐藏弹出框
      addVisible: false,
      // 添加表单的数据对象
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 添加表单的验证规则对象
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  // 进入组件 就发起 ajax 渲染数据
  created() {
    this.initCateList()
  },
  methods: {
    async initCateList() {
      const { data: res } = await this.$http.get('/my/cate/list')
      // console.log(res)
      if (res.code === 0) {
        this.catelist = res.data
      }
    },
    addcatelist() {
      // 0.绑定事件
      // 1.兜底校验
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/my/cate/add', this.addForm)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.addVisible = false
        this.initCateList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
