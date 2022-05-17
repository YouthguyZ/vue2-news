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

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
