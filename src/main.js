import Vue from 'vue'
import ElementUI from '../element-ui/index.js'
import App from './App'
import router from './router'
import store from './store'

import './assets/styles/index.scss'

Vue.use(ElementUI);
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router,
  components: { App },
  template: '<App/>'
})
