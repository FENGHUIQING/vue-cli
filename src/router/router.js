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
    name: 'HelloWorld',
    path: '/HelloWorld',
    meta: {
      title: '测试'
    },
    component:  r => require.ensure([], () => r(require('@/components/HelloWorld')), 'HelloWorld')
  }
]
