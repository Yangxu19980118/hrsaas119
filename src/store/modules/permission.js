import { asyncRoutes, constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    routes: constantRoutes
  },
  mutations: {
    setRoutes(state, newRoutes) {
      state.routes = [...constantRoutes, ...newRoutes]
    }
  },
  actions: {
    filterRoutes({ commit }, menus) {
      const newRoutes = asyncRoutes.filter(route => menus.includes(route.name))
      commit('setRoutes', newRoutes)
      return newRoutes
    }
  },
  getters: {}
}
