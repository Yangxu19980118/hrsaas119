import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTime } from '@/utils/auth'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
  // timeout: 5000
})

service.interceptors.request.use(async config => {
  const token = store.getters.token
  if (token) {
    if (isTimeout()) {
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token 失效'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
})

service.interceptors.response.use(res => {
  const { data, success, message } = res.data
  if (success) {
    return data
  } else {
    Message.errror(message)
    return Promise.reject(new Error(message))
  }
}, async erro => {
  if (erro?.response?.data?.code === 10002) {
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(new Error('token 失效'))
  } else {
    Message.error(erro.message)
  }
  return Promise.reject(erro)
})

const expirsTime = 1 * 60 * 60 * 8 * 1000
// const expirsTime = 3 * 1000
function isTimeout() {
  const prevTime = getTime()
  const currTime = Date.now()
  return currTime - prevTime > expirsTime
}

export default service
