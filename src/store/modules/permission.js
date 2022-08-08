//引入静态路由
import { asyncRoutes, constantRoutes } from '@/router'

const state = {
	//存储当前的用户所有拥有的所有路由权限
	routes: constantRoutes
}

const mutations = {
	//newRoutes动态路由
	//请求到个人信息的时候，动态路由和静态路由进行合并
	setRoutes(state, newRoutes) {
		state.routes = [...constantRoutes, ...newRoutes]
	}
}

const actions = {
	filtersRouters(context, menus) {
		const resRoutes = asyncRoutes.filter(item => {
			return menus.includes(item.name)
		})
		context.commit('setRoutes', resRoutes)
		return resRoutes
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
