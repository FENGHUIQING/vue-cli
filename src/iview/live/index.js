const livebox = r => require.ensure([], () => r(require('../../components/liveel.vue')))
export default {
  components:{
    livebox
  },
  data(){
    return {
      live:'直播页面js'
    }
  },
  created(){
    this.$store.commit('set',{
      count:3
    })
    console.log(webim)
    // this.webimLogin()
  },
  methods:{
    webimLogin(){
      // 用户信息
      let loginInfo = {
        sdkAppID:1400240532,
        appIDAt3rd:1400240532,
        identifier:'',
        userSig:''
      }
      // 监听函数
      let listeners = {
        jsonpCallback:this.jsonpCallback,
        // 监听新消息事件
        onMsgNotify : (msgList) => {
          switch (msgList.ErrorCode) {
              case webim.CONNECTION_STATUS.ON:
                  webim.Log.warn('建立连接成功: ' + msgList.ErrorInfo);
                  break;
              case webim.CONNECTION_STATUS.OFF:
                  webim.Log.warn('连接已断开，无法收到新消息，请检查下您的网络是否正常'+msgList.ErrorInfo);
                  break;
              case webim.webim.CONNECTION_STATUS.RECONNECT:
                  webim.webim.Log.warn('连接状态恢复正常: ' + resp.ErrorInfo);
                  break;
              default:
                  webim.Log.error('未知连接状态,status=' + msgList.ErrorCode);
                  break;
          }
        },
        //监听（多终端同步）群系统消息事件，如果不需要监听，可不填
        onGroupSystemNotifys : (onGroupSystemNotifys) =>{
          console.log(onGroupSystemNotifys)
        },
        //监听新消息（直播聊天室）事件，直播场景下必填
        onBigGroupMsgNotify: (onBigGroupMsgNotify)=>{

        }
      }
      // 检查是否登录
      if(webim.checkLogin){ // 已登录
        this.initRecentContactList();
      }else{
        webim.login(loginInfo,listeners,{
          isLogOn:false
        },
        (resp)=>{
          console.log('登录成功',resp)
          this.initRecentContactList();
        },
        (err) =>{
          console.log(err.ErrorInfo)
        })
      }

    },
    jsonpCallback(rspData){
      webim.setJsonpLastRspData(rspData);
    },
    // 获取信息列表
    initRecentContactList(){
      webim.getRecentContactList({ //获取会话列表
        'Count':20 //最近的回话数，最大为100
      },(resp)=>{
        console.log('resp_;',resp);
        if (resp.SessionItem){
          let items = resp.SessionItem;
          console.log('items:',items);
          // 这里可以对数据进行相应的处理
          webim.webim.syncMsgs(that.initUnreadMsgCount); // 初始化最近会话的消息未读数
        }else{

        }
      },(resp)=>{
        //错误回调
      })
    }
  }
}
