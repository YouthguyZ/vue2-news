<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <!-- <img src="../../assets/logo.png" alt="" class="avatar" /> -->
            <img v-if="userinfo.user_pic" :src="userinfo.user_pic" alt="" class="avatar"/>
            <img v-else src="../../assets/logo.png" alt="" class="avatar"/>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="hLogout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- @open="handleOpen"
      @close="handleClose" -->
      <el-aside width="200px">
        <div class="user-box">
          <!-- 头像处理 v-if v-else ：src -->
          <img v-if="userinfo.user_pic" :src="userinfo.user_pic" alt="" />
          <img v-else src="../../assets/logo.png" alt="" />
          <!-- 数据请求返回的data 解决用户名 昵称问题 -->
          <span>欢迎 {{userinfo.nickname||userinfo.username}}</span>
        </div>
        <!-- 导航栏组件
          这两个方法用不到
          @open="handleOpen"
          @close="handleClose"
          el-submenu 菜单项有子菜单项
          index 菜单项唯一标识
          default-active 默认关联 index项使之选中高亮
          disabled 🈲用的
          组件里提供 router方法 默认false 激活路由导航
          router为ture ：router=‘true’
          :default-active="$route.path" 动态高亮 当路径到哪里 哪里就高亮
        -->
          <el-menu
            router
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#23262E"
            text-color="#fff"
            active-text-color="#409EFF">
            <!-- template 是一个虚拟标签，不会虚渲染成真实拟dom 只是简单包裹的作用
            key 必须是唯一的
            key 不能设置在 template 上必须设置在真实元素上

             -->
             <!-- 循环后注意
             1；替换所有内容 索引index，图标 icon 动态绑定替换
             2；注意v-if v-else 判断是否有children项 如果有就放上面 用v-if 里面嵌套的子项循环再次用v-for遍历循环
             3；：key值放到真是元素里面
              -->
            <template v-for="item in menus">
            <el-submenu v-if="item.children" :index="item.indexPath" :key="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
                <el-menu-item :index="child.indexPath" v-for="child in item.children" :key="child.indexPath"><i :class="child.icon"></i>{{child.title}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.indexPath" :key="item.indexPath"><i :class="item.icon">
              </i><span slot="title">{{item.title}}</span>
            </el-menu-item>
            </template>

          </el-menu>
      </el-aside>

      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
         <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Main',
  data() {
    return {
      // 定义一个空数据存放数据
      // 左侧菜单项页面循环遍历使用
      menus: []
    }
  },
  methods: {
    // 弹出框组件
    hLogout() {
      // 1.点击事件跳转
      this.$confirm('xhd确定退出嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击跳转到登录页
        // 1.清空token
        this.$store.commit('user/updateToken', '')
        this.$router.push('/login')
      }).catch(() => {
        console.log('取消操作')
      })
    },
    // 获取左侧菜单请求
    async getMenus() {
      const { data: res } = await this.$http.get('/my/menus')
      // console.log(res)
      this.menus = res.data
    }
  },
  created() {
    // 左侧菜单栏数据获取
    // 在 methods 里面写方法 在 created 里面调用
    this.getMenus()
    // 使用ajax user模块里的getuserinfo
    this.$store.dispatch('user/getuserInfo')
  },
  computed: {
    ...mapState('user', ['userinfo'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
