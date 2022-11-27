import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  name: 'employees',
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    meta: {
      title: '员工管理',
      icon: 'people'
    }
  },
  {
    path: 'detail/:userId',
    hidden: true,
    component: () => import('@/views/employees/components/detail'),
    props: true
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/components/print'),
    hidden: true
  }
  ]
}
