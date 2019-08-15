import Vue from 'vue'
import ElementUI from '../element-ui/index.js'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import App from './App'
import config from './config'
import router from './router'
import store from './store'
import http from './http'

import './assets/styles/index.scss'
Vue.prototype.$conf = config
window.axiosMock = window.axiosMock || new AxiosMockAdapter(axios, { delayResponse: 1000 })
Vue.prototype.$http = http

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

axiosMock.onAny().passThrough();
