<template>
  <div id="video-container">

  </div>
</template>

<script>
export default {
  name: 'TencentPlayer',
  data () {
    return {
      player:null,
      vwidth:800,
      vheight:450
    }
  },
  created(){
    console.log(TcPlayer)
    this.vwidth = parseInt(document.body.offsetWidth *.9*.65);
    console.log(this.vwidth)
  },
  mounted(){
    this.init();
  },
  methods:{
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
          flv: 'http://11547.liveplay.myqcloud.com/live/feng.flv',
          m3u8: 'http://11547.liveplay.myqcloud.com/live/feng.m3u8',
          // rtmp: rtmp,
          // flv: flv,
          // m3u8: m3u8 ,
          // mp4: mp4 || '//1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4',
          coverpic: coverpic || {
              style: 'cover',
              src: '//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg'
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
      window.qcplayer = player;
    }

  }
}
</script>

<style lang="scss" scoped>
#video-container{
  width:65%;
  height:35vw;
}
</style>
