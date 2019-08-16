const livebox = r => require.ensure([], () => r(require('../../components/liveel/liveel.vue')))
export default {
  components:{
    livebox
  },
  data(){
    return {
      value:true,
      plvalue:true,
      live:'直播页面js',
      listeners:{},
    }
  },
  mounted(){
     this.webimLogin()
  },
  created(){
    this.logout()
    this.$store.commit('set',{
      count:3
    })
    console.log(webim)
    // this.webimLogin()
  },
  methods:{
    liveChild(){
      this.$refs.livebox.addToList()
    },
    webimLogin(){
      // 用户信息
      let loginInfo = {
        sdkAppID:1400237068,
        appIDAt3rd:1400237068,
        identifier:'admin',
        userSig:'eAEtzE0LgjAYB-DvsmshT26uJXQIpDyoYbPAbquteqjJcCJB9N0T7fr7v3xIlcnA66dyDjWJFwwgpEvgYj4mHVozaMSjFRMh5ZN6vJOYFAe5o6K4bvf57KJolsoyyftH*TpDm1jR2Ao3vj6l2B-XZBqat8N2OOTABMBkvWmHszCAfwe1aTq84chKW2zI9wep-jDL'
      }
      // 监听函数
      this.listeners = {
        jsonpCallback:this.jsonpCallback,
        // 监听新消息事件
        onMsgNotify : (msgList) => {
          debugger;
          console.log(msgList,'-----------')
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
      // 登录
       webim.login(loginInfo,this.listeners,{
          isLogOn:false
        },
        (resp)=>{
          console.log('登录成功',resp)
          this.joinGroup();
          this.initRecentContactList();
          // this.listeners.onMsgNotify
        },
        (err) =>{
          console.log(err.ErrorInfo)
        })
      // console.log("登录信息：",webim.checkLogin)
      // if(webim.checkLogin){ // 已登录
      //   this.joinGroup()
      //   // this.initRecentContactList();
      // }else{
      //   webim.login(loginInfo,listeners,{
      //     isLogOn:false
      //   },
      //   (resp)=>{
      //     console.log('登录成功',resp)
      //     this.joinGroup();
      //     // this.initRecentContactList();
      //   },
      //   (err) =>{
      //     console.log(err.ErrorInfo)
      //   })
      // }

    },
    jsonpCallback(rspData){
      webim.setJsonpLastRspData(rspData);
    },
    // 登出
    logout(){
      webim.logout((resp)=>{
        webim.Log.info('登出成功');
        let indexUrl = window.location.href;
        let pos = indexUrl.indexOf('?');
        if (pos >= 0) {
            indexUrl = indexUrl.substring(0, pos);
        }
        window.location.href = indexUrl;
      })
    },
    // 加入群
    joinGroup(){
      let option={
        'GroupId':1014,
        'ApplyMsg':'',
        'UserDefinedField': ''
      }
      console.log()
      webim.applyJoinGroup(option,(resp)=>{
        let joinedStatus = resp.JoinedStatus; //JoinedSuccess--成功加入，WaitAdminApproval--等待管理员审核
        if (joinedStatus == "JoinedSuccess") {
            //刷新我的群组列表
            //getJoinedGroupListHigh(getGroupsCallbackOK);
            alert('成功加入该群');
            // setInterval(()=>{this.initRecentContactList()},2000)
            // this.initRecentContactList();
        } else {
            alert('申请成功，请等待群主审核');
        }
      },(err)=>{
        console.log(err.ErrorInfo)
      })
    },
    // 获取信息列表
    initRecentContactList(){
      console.log('获取回话消息：')
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
