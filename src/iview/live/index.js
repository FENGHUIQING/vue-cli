export default {
  data(){
    return {
      live:'直播页面js'
    }
  },
  created(){
    this.$store.commit('set',{
      count:3
    })
  },
}
