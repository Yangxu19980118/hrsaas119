import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}
export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export const getUserDetailById = userId => {
  return request({
    method: 'GET',
    url: `/sys/user/${userId}`
  })
}
// export function getUserDetaliById(id) {
//   return request({
//     url: `/sys/user/${id}`
//   })
// }
export function logout() { }
