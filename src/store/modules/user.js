// 状态

// 引入接口的方法
import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

const state = {
  userInfo: {},
  token: getToken()
}
// 修改状态
const mutations = {
//	修改用户信息
  setuserInfo(state, data) {
    state.userInfo = data
  },
  //	修改state里面的数据
  //	设置token
  //	1.vuex
  //	2.cookie
  setToken(state, token) {
    state.token = token
    setToken(token) // 本地存储的设置token的方法 >> auth.js中引入
  },
  // 移除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
// 执行异步
const actions = {
//	登录请求 >> 拿到数据 >> 在mutations里面修改
  async login(context, data) {
    //  调用登录的请求接口
    const res = await login(data)

    //  打印接口调用的结果

    //  res是经过响应拦截器处理的数据
    context.commit('setToken', res)
    setTimeStamp()
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    context.commit('setuserInfo', { ...res, ...baseInfo })
  },
  logOut(context) {
    context.commit('removeUserInfo')
    context.commit('removeToken')
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
