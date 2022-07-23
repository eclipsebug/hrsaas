const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto // 建立用户头像的映射
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
}
export default getters
