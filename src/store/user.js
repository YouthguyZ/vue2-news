// 导入axios
import axios from 'axios'
export default {
  namespaced: true,
  state: {
    token: '',
    // 下载包 vuex-persistedstate 可以不用localstorage 存储token
    // token: localStorage.getItem('token')
    userinfo: {}
  },
  mutations: {
    updateToken(state, token) {
      state.token = token
      // localStorage.setItem('token', token)
    },
    updateUserInfo(state, user) {
      state.userinfo = user
    }
  },
  // 异步修改数据
  actions: {
    // 第一个参数context =>$store
    async getuserInfo(context) {
      // 发起axios请求获取用户数据 携带请求头header 不然报错 main.js设置拦截器后不用配置
      const { data: res } = await axios.get('/my/userinfo')
      // console.log(res)
      if (res.code !== 0) return
      context.commit('updateUserInfo', res.data)
    }
  }
}
