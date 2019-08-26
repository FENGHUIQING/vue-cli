import { MESSAGE_TYPE } from 'vue-baberrage'
export default {
  name: 'TencentPlayer',
  data () {
    return {
      roomId:this.$route.query.roomId,
      player:null,
      msg: 'Hello vue-baberrage',
      barrageIsShow: true,
      currentId : 0,
      barrageLoop: false,
      barrageList: this.$store.state.barrageList,
      playInfo:{},

    }
  },
  created(){

  },
  mounted(){
    this.getUserinfo();
  },
  methods:{
    // 获取用户信息
    getUserinfo(){
      this.$http.get('/api/web/live/getInfoByRoomId/'+this.roomId).then(res=>{
        if(res.data.status == 200){
          this.playInfo = res.data.data;
          let playUrl = JSON.parse(this.playInfo.pullStreamUrl);
          let flv = playUrl.flv ? playUrl.flv : '';
          let hls = playUrl.hls ? playUrl.hls : '';
          this.$nextTick(()=>{
            this.init(flv,hls);
          })
          this.$emit('forbidChange',this.playInfo)
        }
      })
    },
    // 弹幕为空
    sayHi(){
      console.log('暂无评论！！')
    },
    getParams(name){
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
          return decodeURIComponent(r[2]);
      }
      return null;
    },
    init(flvUrl,hlsUrl){
      let rtmp = this.getParams('rtmp'),
          flv = this.getParams('flv'),
          m3u8 = this.getParams('m3u8'),
          mp4 = this.getParams('mp4'),
          live = (this.getParams('live') == 'true' ? true : false),
          coverpic = this.getParams('coverpic'),
          width = this.getParams('width'),
          height = this.getParams('height'),
          autoplay = (this.getParams('autoplay') == 'true' ? true : false);
          console.log(this.getParams('width'))
      let options = {
          flv: flvUrl,
          m3u8: hlsUrl,
          // rtmp: rtmp,
          // mp4: mp4 || '//1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4',
          coverpic: coverpic || {
              style: 'cover',
              src: this.playInfo.liveCover
          },
          autoplay:  true,
          live: live,
          Flash: false
      }
      this.player = new TcPlayer('video-container', options);
      console.log('this.player:',this.player)
      this.player.play();
      window.qcplayer = this.player;

    }

  }
}
