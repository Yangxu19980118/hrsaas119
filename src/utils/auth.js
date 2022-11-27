import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const timeKey = 'hrsaas-timestamp-key'

export function setTime() {
  Cookies.set(timeKey, +new Date())
}

export function getTime() {
  return Cookies.get(timeKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// export function getTimeStamp() {
//   return Cookies.get(timeKey)
// }
// export function setTimeStamp() {
//   Cookies.set(timeKey, Date.now())
// }
