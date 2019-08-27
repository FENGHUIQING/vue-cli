export default[
  {
    path: '/',
    redirect: '/home'
  },
   {
    name: 'home',
    path: '/home',
    meta: {
      title: '首页'
    },
    component:  r => require.ensure([], () => r(require('@/iview/home/index.vue')), 'home')
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component:  r => require.ensure([], () => r(require('@/iview/login/index.vue')), 'login')
  },
  {
    name: 'live',
    path: '/live',
    meta: {
      title: '直播'
    },
    component:  r => require.ensure([], () => r(require('@/iview/live/index.vue')), 'live')
  },
  {
    name: 'tanmu',
    path: '/tanmu',
    meta: {
      title: '弹幕'
    },
    component:  r => require.ensure([], () => r(require('@/components/tanmu.vue')), 'tanmu')
  }
]
