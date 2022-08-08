// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach(async function(to, from, next) {
	NProgress.start() // 开启进度条
	//  首先判断有无token
	const token = store.getters.token
	
	// 只要有token
	// 没有用户信息的时候
	if (token) {
		//   如果有token 继续判断是不是去登录页
		
		//  获取用户信息
		if (!store.getters.userId) {
			const res = await store.dispatch(('user/getUserInfo'))
			//    获取用户资料的action 把 得到的用心里面的路由参数赋值给vuex里面的
			//res.roles.menus是
			console.log(res.roles.menus)
			//routes 筛选之后的结果>>用户拥有权限的动态路由列表
			const routes = await store.dispatch('permission/filtersRouters', res.roles.menus)
			//利用路由的addRoutes方法添加筛选后的路由表
			router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])  	// 404 page must be placed at the end !!!
			//从新进行跳转
			next(to.path)
		}
		if (to.path === '/login') {
			//  表示去的是登录页
			next('/') // 跳到主页
		} else {
			// 白名单的界面(不需要权限)
			// 需要权限的界面
			next() // 直接放行
		}
	} else {
		// 如果没有token
		if (whiteList.indexOf(to.path) > -1) {
			// 如果找到了 表示在在名单里面
			next()
		} else {
			next('/login') // 跳到登录页
		}
	}
	NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function() {
	NProgress.done() // 关闭进度条
})
