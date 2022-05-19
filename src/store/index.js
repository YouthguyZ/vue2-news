import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/user'
// 引入一个小插件 自动保存token到store
import createPersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedstate()],
  modules: {
    user
  }
})
