// 状态

// 引入接口的方法
import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

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
		//返回用户的信息
		//将请求到的用户信息（里面的包含路由信息的）返回出去
		return {
			...baseInfo,
			...res
		}
	},
	logOut(context) {
		context.commit('removeUserInfo')
		context.commit('removeToken')
		
		// 重置路由
		resetRouter()
		// 还有一步  vuex中的数据是不是还在
		// 要清空permission模块下的state数据
		// vuex中 user子模块  permission子模块
		// 子模块调用子模块的action  默认情况下 子模块的context是子模块的
		// 父模块 调用 子模块的action
		context.commit('permission/setRoutes', [], { root: true })
		// 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
		
	}
	
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
