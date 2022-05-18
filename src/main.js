import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入element文件 引发css文件 axios文件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 全局引入样式
import '@/assets/global.less'

// 注册使用element
Vue.use(ElementUI)
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
Vue.prototype.$http = axios

// 注册全局拦截器 优化身份认证
// 在调用获取用户基本信息、**获取左侧菜单**接口时，不再单独提供 `headers`下的 `Authorization` 请求头
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  // this.$store 这里不能使用 $store 因为不在组件对象中
  // 携带请求的 token
  // console.log(config)
  // console.log(store)
  const token = store.state.user.token
  // 如果本地有 token 就携带 token
  if (token) {
    // 全局配置携带本地token 在请求头的权限
    config.headers.Authorization = token
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
