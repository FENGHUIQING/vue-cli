import { MESSAGE_TYPE } from 'vue-baberrage'
export default {
  name: 'TencentPlayer',
  data () {
    return {
      player:null,
      msg: 'Hello vue-baberrage',
      barrageIsShow: true,
      currentId : 0,
      barrageLoop: false,
      barrageList: []
    }
  },
  created(){
    console.log(TcPlayer)
    // this.addToList();
  },
  mounted(){
    this.init();
  },
  methods:{
    // 弹幕为空
    sayHi(){
      console.log('暂无评论！！')
    },
    // 有新的数据就加入到弹幕中
    addToList(){
      this.$store.state.barrageList.push({
        id: ++this.currentId,
        avatar: "https://apic.douyucdn.cn/upload/avatar_v3/201908/2a902a500c41473790e51583ed988ac9_middle.jpg",
        msg: this.msg,
        time: 5,
        type: MESSAGE_TYPE.NORMAL,
      })
      // this.barrageList.push()
      //  console.log('点击',this.barrageList)
    },
    getParams(name){
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
          return decodeURIComponent(r[2]);
      }
      return null;
    },
    init(){
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
          flv: 'http://11547.liveplay.myqcloud.com/live/1014.flv',
          m3u8: 'http://11547.liveplay.myqcloud.com/live/1014.m3u8',
          // rtmp: rtmp,
          // flv: flv,
          // m3u8: m3u8 ,
          // mp4: mp4 || '//1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4',
          coverpic: coverpic || {
              style: 'cover',
              // src: '//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg'
          },
          // autoplay: autoplay ? true : false,
          autoplay:  true,
          live: live,
          // width: this.vwidth,
          // height: height || '450',
          Flash: false
      }
      this.player = new TcPlayer('video-container', options);
      this.player.play();
      window.qcplayer = this.player;
    }

  }
}
