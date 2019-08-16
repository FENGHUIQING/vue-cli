import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    count:1,
    barrageList:[]
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
