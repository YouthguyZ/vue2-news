import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入文件
import Login from '@/views/Login/Login'
import Reg from '@/views/Reg/Reg'
import Main from '@/views/Main/Main'
import Home from '@/views/menus/Home/home.vue'
import UserInfo from '@/views/menus/User/UserInfo'
import UserAvatar from '@/views/menus/User/UserAvatar'
// 引入store文件
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/reg', component: Reg },
  {
    path: '/',
    component: Main,
    redirect: '/home',
    children: [{ path: 'home', component: Home },
      { path: 'user-info', component: UserInfo },
      { path: 'user-avatar', component: UserAvatar }]
  }
]

const router = new VueRouter({
  routes
})

// 控制后台主页的访问权限 没有 token 时，禁止访问后台主页
// 全局前置路由守卫
// 是否有 token 也就是是否登录过 没有 token 就无法去到默认首页
// 注意事项：next（）必须调用
// to 去到哪里
// from 来自哪里
// next（）放行通过 next（false）不通过 next（'/path'）强制跳转
// 如果去的不是reg页或者login页 则强制去login页
router.beforeEach((to, from, next) => {
  // token 放到守卫函数里
  const token = store.state.user.token
  // (!token && to.path !== '/login' && to.path !== '/reg')
  // 白名单的方法 实现逻辑跳转
  // 如果要去的页面不在白名单里则强制跳转到登录页
  const whiteList = ['/login', '/reg']
  if (!token && !whiteList.includes(to.path)) {
    // console.log(to.path)
    // Vue实例有element的方法 在这里给用户一个提示信息
    Vue.prototype.$message.error('您还没有登录！')
    next('/login')
  } else {
    next()
  }
})
export default router
