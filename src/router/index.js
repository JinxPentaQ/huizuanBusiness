import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/collection',
    component: Layout,
    redirect: '/collection',
    name: 'Collection',
    meta: { title: '代收', icon: 'el-icon-folder-opened' },
    children: [
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/collection/index'),
        meta: { title: '全部订单', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: '/payment',
    component: Layout,
    redirect: '/payment',
    name: 'Payment',
    meta: { title: '出款订单', icon: 'el-icon-s-finance' },
    children: [
      {
        path: 'out',
        name: '代付',
        component: () => import('@/views/out/out-order'),
        meta: { title: '代付订单', icon: 'el-icon-bank-card' }
      },
      {
        path: 'businessOut',
        name: '提现',
        component: () => import('@/views/out/business-out-order'),
        meta: { title: '提现订单', icon: 'el-icon-money' }
      }
    ]
  },
  {
    path: '/record',
    component: Layout,
    redirect: '/record',
    name: 'Record',
    meta: { title: '对账记录', icon: 'el-icon-office-building' },
    children: [
      {
        path: 'record',
        name: 'All Record',
        component: () => import('@/views/record/index'),
        meta: { title: '记录', icon: 'el-icon-notebook-1' }
      }
    ]
  },
  // {
  //   path: '/report',
  //   component: Layout,
  //   redirect: '/report',
  //   name: 'Report',
  //   meta: {title: '报表管理', icon: 'el-icon-office-building'},
  //   children: [
  //     {
  //       path: 'report',
  //       name: 'All Report',
  //       component: () => import('@/views/report/index'),
  //       meta: {title: '总报表', icon: 'el-icon-notebook-1'}
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
