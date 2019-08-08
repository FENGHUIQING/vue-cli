import Vue from 'vue'
import Router from 'vue-router'
import routers from './router'

Vue.use(Router)
const RouterConfig = {
  mode: 'hash', //history hash
  // base: config.root,
  routes: routers
}
const router = new Router(RouterConfig)
export default router
