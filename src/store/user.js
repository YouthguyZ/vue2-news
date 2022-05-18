export default {
  namespaced: true,
  state: {
    token: ''
    // 下载包 vuex-persistedstate 可以不用localstorage 存储token
    // token: localStorage.getItem('token')
  },
  mutations: {
    updateToken(state, token) {
      state.token = token
      // localStorage.setItem('token', token)
    }
  }
}
