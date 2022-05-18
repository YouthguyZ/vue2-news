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

export default router
