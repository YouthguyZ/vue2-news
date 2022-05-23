<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option :label="item.cate_name" :value="item.id" v-for="item in catelist" :key="item.id"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArtList">筛选</el-button>
            <el-button type="info" size="small" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="pubVisible=true">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
          <el-table
             stripe
             border
            :data="artList"
            style="width: 100%">
            <el-table-column
              prop="title"
              label="文章标题">
              <template v-slot="scope">
               <el-link type="primary" @click="showdetail(scope.row.id)"> {{scope.row.title}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="cate_name"
              label="文章分类">
            </el-table-column>
            <el-table-column
              label="发表时间">
              <template v-slot="scope">
                {{formatDate(scope.row.pub_date)}}
              </template>
            </el-table-column>
             <el-table-column
              prop="state"
              label="状态">
            </el-table-column>
             <el-table-column
              label="操作">
              <!--column方法 作用域插槽 向函数传值id -->
              <template v-slot="{row}">
              <el-button type="danger" size="mini" @click="removeDetail(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      <!-- 分页区域 -->
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[2, 3, 5, 20]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog
      fullscreen
      title="发布文章"
      :visible.sync="pubVisible"
      :before-close="handleClose">
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubForm" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item  label="文章分类" prop="cate_id">
          <el-select  v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for="item in catelist" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 插件方法富文本编辑器 -->
          <quill-editor v-model="pubForm.content" @blur="$refs.pubForm.validateField('content')">
          </quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img v-if="preview" :src="preview" alt="" class="cover-img" ref="imgRef" />
          <img v-else src="../../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none;" accept="image/*" ref="iptFile" @change="hChangeImg"/>
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="$refs.iptFile.click()">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="hPub('已发布')">发布</el-button>
          <el-button type="info" @click="hPub('草稿')">保存草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 展示详情页 -->
    <el-dialog
      title="文章预览"
      :visible.sync="detailVisible"
      width="70%">
       <h1 class="title">{{ artDetail.title }}</h1>

        <div class="info">
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ formatDate(artDetail.pub_date)  }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>

  <!-- 分割线 -->
  <el-divider></el-divider>

  <img :src="'http://www.liulongbin.top:3008' + artDetail.cover_img" alt="" />

  <div v-html="artDetail.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      pubVisible: false,
      // 表单的数据对象
      pubForm: {
        title: '',
        cate_id: '',
        content: '',
        cover_img: '',
        state: ''
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'blur' }]
      },
      catelist: [],
      preview: '',
      artList: [],
      currentPage4: 1,
      total: 0,
      artDetail: {},
      detailVisible: false
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('关闭会丢失数据确认关闭？', '提示', { type: 'warning' })
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 获取数据
    async initCateList() {
      const { data: res } = await this.$http.get('/my/cate/list')
      this.catelist = res.data
    },
    hChangeImg(e) {
      const file = e.target.files[0]
      if (file) {
        this.pubForm.cover_img = file
        // 将文件flie转为url 用到createObjURL方法
        this.preview = URL.createObjectURL(file)
        // console.log(this.preview)
        // 手动校验
      } else {
        this.pubForm.cover_img = ''
      }
      this.$refs.pubForm.validateField('cover_img')
    },
    hPub(state) {
      // 检查状态
      this.pubForm.state = state
      // 兜底校验
      this.$refs.pubForm.validate(async valid => {
        if (!valid) return
        console.log('通过校验')
        // 请求体为formdata格式
        // 将this.pubform 对像转为FormData格式
        const fd = new FormData()
        for (const key in this.pubForm) {
          fd.append(key, this.pubForm[key])
        }
        const { data: res } = await this.$http.post('/my/article/add', fd)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 关闭dialog
        this.pubVisible = false
        // 清空表单信息
        this.$refs.iptFile = ''
        this.$refs.pubForm.resetFields()
        this.initArtList()
        this.preview = ''
      })
    },
    async initArtList() {
      const { data: res } = await this.$http.get('/my/article/list', { params: this.q })
      this.artList = res.data
      this.total = res.total
    },
    formatDate(data) {
      return dayjs(data).format('YYYY-MM-DD HH:mm-ss')
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.q.pagesize = val
      this.q.pagenum = 1
      this.initArtList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.q.pagenum = val
      this.initArtList()
    },
    resetForm() {
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.initArtList()
    },
    async showdetail(id) {
      const { data: res } = await this.$http.get('/my/article/info', { params: { id } })
      if (res.code !== 0) return
      this.artDetail = res.data
      this.detailVisible = true
    },
    removeDetail(id) {
      this.$confirm('确认删除文章吗？？', '提示', { type: 'warning' })
        .then(async() => {
          const { data: res } = await this.$http.delete('/my/article/info', { params: { id } })
          // 提示用户信息
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          // 解决bug 优化文章列删除
          if (this.artList.length === 1 && this.q.pagenum > 1) {
            this.q.pagenum--
          }
          // 更新数据渲染页面
          this.initArtList()
        })
        .catch(() => {
        })
    }
  },
  created() {
    this.initCateList()
    this.initArtList()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
    //  scope 作用：可以让当前样式只对当前 template 中的样式生效
    /deep/ .ql-editor{
      height: 300px !important;
    }

    // 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
</style>
