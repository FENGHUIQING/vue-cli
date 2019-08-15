export default[
   {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component:  r => require.ensure([], () => r(require('@/iview/home/index.vue')), 'home')
  },
  {
    name: 'live',
    path: '/live',
    meta: {
      title: '直播'
    },
    component:  r => require.ensure([], () => r(require('@/iview/live/index.vue')), 'live')
  }
]
