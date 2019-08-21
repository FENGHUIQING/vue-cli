export default {
  data(){
    return {
      loading:true,
      radio:1,
      search:'',
      totle:0,
      liveList:[],
      pageNum:0,
      pageSize:10,
      noList:false,
      type:'list'
    }
  },
  created(){
    this.getLivelist();
  },
  methods:{
    // 修改直播状态
    radioChange(data){
      this.getLivelist()
    },
    // 搜索
    searchBlur(){
      this.type = 'all';
      this.getLivelist();
    },
    getLivelist(){
      this.loading = true;
      this.noList = false;
      this.$http.get('/api/web/live/getRoomByCondition',{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          status:this.radio,
          type:this.type,
          condition : this.search
        }
      }).then(res=>{
        if(res.data.status == 200){
          let data = res.data
          this.liveList = data.data.list;
          this.noList = (this.liveList.length && this.liveList.length>0) ? false : true
        }
        this.loading = false;
      })
    }
  }
}
