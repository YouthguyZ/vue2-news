import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入文件
import Login from '@/views/Login/Login'
import Reg from '@/views/Reg/Reg'
import Main from '@/views/Main/Main'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/reg', component: Reg },
  { path: '/', component: Main }
]

const router = new VueRouter({
  routes
})

// 路由前置守卫
// 如果去的不是reg页或者login页 则强制去login页
// router.beforeEach((to,from,next)={
//   // if()

// })
export default router
