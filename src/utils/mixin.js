//可以复用的组件选项
import store from '@/store'

export const mixins = {
	// created() {
	// 	console.log('我是混入的creted')
	// 	//	加载组件的时候进行逻辑判断
	// 	//	多个组件的created钩子里面执行一个相同的逻辑
	// },
	methods: {
		chexkPermission(key) {
			return !store.state.user.userInfo.roles.points.includes(key)
		}
	}
}
