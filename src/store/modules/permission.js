import { asyncRoutes, constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    routes: constantRoutes
  },
  mutations: {
    setRoutes(state, newRoutes) {
      // 对用户进行静态路由和动态路由的拼接
      state.routes = [...constantRoutes, ...newRoutes]
    }
  },
  actions: {
    filterRoutes({ commit }, menus) {
      // menus ['setting','department','employess']
      // 动态路由的对象
      const newRoutes = asyncRoutes.filter(route => menus.includes(route.name))
      commit('setRoutes', newRoutes)
      return newRoutes
      // 登录后 和 跳转到首页之前， 找到个人所拥有的动态路由
    }
  },
  getters: {}
}
