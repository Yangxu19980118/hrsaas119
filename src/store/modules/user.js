import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    if (token) {
      setToken(token)
    } else {
      removeToken()
    }
  },
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }
  }
}
const actions = {
  async userLogin({ commit }, data) {
    try {
      const token = await login(data)
      commit('setToken', token)
      setTime()
      return true
    } catch (error) {
      console.log(error)
      commit('setToken', null)
      return false
    }
  },
  async asyncGetUserInfo({ commit }) {
    const data = await getUserInfo()
    const baseInfo = await getUserDetailById(data.userId)
    console.log(data.userId)
    commit('setUserInfo', { ...data, ...baseInfo })
  },
  logout({ commit }) {
    commit('setToken', null)
    commit('setUserInfo', {})
    resetRouter()
    commit('permission/setRoutes', [], { root: true })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
