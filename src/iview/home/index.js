export default {
  data(){
    return {
      radio:1,
      search:''
    }
  },
  created(){
    this.getLivelist();
  },
  methods:{
    getLivelist(){
      this.$http.get('/api/web/live/getList',{
        params:{
          pageNum:1,
          pageSize:10,
          status:0
        }
      }).then(res=>{
        console.log(res)
      })
    }
  }
}
