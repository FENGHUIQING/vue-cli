export default {
  data(){
    return {
      loading:true,
      radio:1,
      search:'',
      total:0,
      liveList:[],
      pageNum:1,
      pageSize:12,
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
      this.pageNum = 1;
      this.getLivelist()
    },
    // 搜索
    searchBlur(){
      this.type = 'all';
      this.pageNum = 1;
      this.getLivelist();
    },
    changePage(page){
      console.log('当前页：',page);
      this.pageNum = page;
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
        if(res.status == 200){
          let data = res.data
          this.liveList = data.data.list;
          this.noList = (this.liveList.length && this.liveList.length>0) ? false : true;
          this.total = data.data.total;
        }
        this.loading = false;
      }).catch(err=>{
        this.$notify.error({
          title: '',
          message: '请求失败！',
        });
        this.loading = false;
      })
    }
  }
}
