const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,
  username: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  departmentName: state => state.user.userInfo.departmentName,
  companyName: state => state.user.userInfo.companyName,
  companyId: state => state.user.userInfo.companyId,
  menus: state => state.user.userInfo.roles.menus,
  routes: state => state.permission.routes,
  points: state => state.user.userInfo.roles.points
}
export default getters
