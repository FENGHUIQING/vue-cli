import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
Vue.use(Vuex)
var xmttoken = localStorage.getItem('xmttoken') || ''
const store = new Vuex.Store({
  state: {
    count:1,
    barrageList:[],
    xmttoken:xmttoken
  },
  getters: {

  },
  mutations: {
    set(state, data) {
      Object.assign(state, data)
    },
    setMaterial(state, material) {
      state.material = material;
    }
  },
  actions: {
    setMaterial({commit}, argu) {
      commit('setMaterial', argu)
    }
  },
   articleBack: true
})

export default store
