import router from './router'
import store from './store'
import 'nprogress/nprogress.css' // 引入进度条样式
import nprogress from 'nprogress'
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        // 获取用户的基本信息
        await store.dispatch('user/asyncGetUserInfo')
        // 从getters 里面取了权限点
        const menus = store.getters.menus
        // 拿着权限点换取真实的路由
        const newRoutes = await store.dispatch('permission/filterRoutes', menus)
        // 已经取到用户本身拥有的权限（用router对象身上的 addRoutes 方法将路由合并起来
        router.addRoutes([...newRoutes, { path: '*', redirect: '/404', hidden: true }])
        // 添加完成后，固定写法
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
    nprogress.done()
  }
})

router.afterEach(() => {
  nprogress.done()
})
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
