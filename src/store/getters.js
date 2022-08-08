import permission from '@/store/modules/permission'

const getters = {
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	token: state => state.user.token,
	name: state => state.user.userInfo.username,
	userId: state => state.user.userInfo.userId,
	staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
	companyId: state => state.user.userInfo.companyId,   //公司id
	routes: state => state.permission.routes  //动态路由 和静态路由
	// avatar: state => state.user.avatar,
	// name: state => state.user.name
}
export default getters
