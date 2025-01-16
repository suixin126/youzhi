import { createWebHashHistory, createRouter } from 'vue-router'
const Layout = () => import('@/layout/Layout.vue');
const routes = [
  // 日程管理
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/Home.vue'),
        name: 'Home',
        meta: { title: '首页' }
      }
    ]
  },
  // 登录
  { path: '/login', component: () => import('@/views/login/Login.vue') },
  // 注册
  { path: '/register', component: () => import('@/views/register/Register.vue') },
  // 任务列表
  {
    path: '/taskList',
    redirect: '/taskList/index',
    component: Layout,
    children: [
      {
        path: '/taskList/index',
        component: () => import('@/views/taskList/taskList.vue'),
        name: 'taskList',
        meta: { title: '任务列表' }
      }
    ]
  },
  // 健康数据
  {
    path: '/healthData',
    redirect: '/healthData/index',
    component: Layout,
    children: [
      {
        path: '/healthData/index',
        component: () => import('@/views/healthData/HealthData.vue'),
        name: 'healthData',
        meta: { title: '健康数据' }
      }
    ]
  },
  // 数据分析
  {
    path: '/dataAnalyse',
    redirect: '/dataAnalyse/index',
    component: Layout,
    children: [
      {
        path: '/dataAnalyse/index',
        component: () => import('@/views/dataAnalyse/DataAnalyse.vue'),
        name: 'dataAnalyse',
        meta: { title: '健康数据' }
      }
    ]
  },
  // 个人设置
  {
    path: '/personalInformation',
    redirect: '/personalInformation/index',
    component: Layout,
    children: [
      {
        path: '/personalInformation/index',
        component: () => import('@/views/personalInformation/PersonalInformation.vue'),
        name: 'personalInformation',
        meta: { title: '个人设置' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    if (token) {
      next();
    } else {
      next('/login');
    }
  }
})

export default router;