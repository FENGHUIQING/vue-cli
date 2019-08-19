const livebox = r => require.ensure([], () => r(require('../../components/liveel/liveel.vue')))
export default {
  components:{
    livebox
  },
  data(){
    return {
      // infoMsg:[],
      value:true,
      plvalue:true,
      loginInfo:{},
      listeners:{},
      newGroup:'',
    }
  },
  mounted(){
    this.webimLogin()
  },
  created(){
    // this.logout()
    // this.$store.commit('set',{
    //   count:3
    // })
    // console.log(webim)
    // this.webimLogin()
  },
  computed:{
  },
  watch:{

  },
  methods:{
    liveChild(){
      this.$refs.livebox.addToList()
    },
    webimLogin(){
      // 用户信息
      this.loginInfo = {
        sdkAppID:1400237068,
        appIDAt3rd:1400237068,
        identifier:'admin',
        userSig:'eAEtzE0LgjAYB-DvsmshT26uJXQIpDyoYbPAbquteqjJcCJB9N0T7fr7v3xIlcnA66dyDjWJFwwgpEvgYj4mHVozaMSjFRMh5ZN6vJOYFAe5o6K4bvf57KJolsoyyftH*TpDm1jR2Ao3vj6l2B-XZBqat8N2OOTABMBkvWmHszCAfwe1aTq84chKW2zI9wep-jDL'
      }
      //监听连接状态回调变化事件
      var onConnNotify = function (resp) {
        var info;
        switch (resp.ErrorCode) {
          case webim.CONNECTION_STATUS.ON:
            webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
            break;
          case webim.CONNECTION_STATUS.OFF:
            info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
            // alert(info);
            webim.Log.warn(info);
            break;
          case webim.CONNECTION_STATUS.RECONNECT:
            info = '连接状态恢复正常: ' + resp.ErrorInfo;
            // alert(info);
            webim.Log.warn(info);
            break;
          default:
            webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
            break;
        }
      };
       var onC2cEventNotifys = {
        "92": this.onMsgReadedNotify, //消息已读通知,
        "96": this.onMultipleDeviceKickedOut
      };

      // 监听函数
      this.listeners = {
        "onConnNotify": onConnNotify //监听连接状态回调变化事件,必填
          ,
        "jsonpCallback": this.jsonpCallback //IE9(含)以下浏览器用到的jsonp回调函数，
          ,
        "onMsgNotify": this.onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
          ,
        "onBigGroupMsgNotify": this.onBigGroupMsgNotify //监听新消息(直播聊天室)事件，直播场景下必填
          ,
        // "onGroupSystemNotifys": onGroupSystemNotifys //监听（多终端同步）群系统消息事件，如果不需要监听，可不填
          // ,
        // "onGroupInfoChangeNotify": onGroupInfoChangeNotify //监听群资料变化事件，选填
        //   ,
        // "onFriendSystemNotifys": onFriendSystemNotifys //监听好友系统通知事件，选填
        //   ,
        // "onProfileSystemNotifys": onProfileSystemNotifys //监听资料系统（自己或好友）通知事件，选填
        //   ,
        // "onKickedEventCall": onKickedEventCall //被其他登录实例踢下线
        //   ,
        "onC2cEventNotifys": onC2cEventNotifys //监听C2C系统消息通道
          ,
        "onAppliedDownloadUrl": (data)=>{
          console.debug(data);
        } //申请文件/音频下载地址的回调
          ,
        "onLongPullingNotify": (data) => {
          console.debug('onLongPullingNotify', data)
        }
      };
      this.sdkLogin();
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
    // 消息已读通知
    onMsgReadedNotify(notify) {
        var sessMap = webim.MsgStore.sessMap()[webim.SESSION_TYPE.C2C + notify.From_Account];
        if (sessMap) {
            var msgs = _.clone(sessMap.msgs());
            var rm_msgs = _.remove(msgs, function (m) {
                return m.time <= notify.LastReadTime
            });
            var unread = sessMap.unread() - rm_msgs.length;
            unread = unread > 0 ? unread : 0;
            //更新sess的未读数
            sessMap.unread(unread);
            // console.debug('更新C2C未读数:',notify.From_Account,unread);
            //更新页面的未读数角标

            if (unread > 0) {
                $("#badgeDiv_" + notify.From_Account).text(unread).show();
            } else {
                $("#badgeDiv_" + notify.From_Account).val("").hide();
            }
        }
    },
    // 多端登录被T
    onMultipleDeviceKickedOut() {
        webim.Log.error("多终端登录，被T了");
    },
    //监听大群新消息（普通，点赞，提示，红包）
    onBigGroupMsgNotify(msgList) {
      console.log("msgList直播中：",msgList)
      if (msgList && msgList.length){
        for (var i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
            var msg = msgList[i];
            //console.warn(msg);
            webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
            //显示收到的消息
            // showMsg(msg);
        }
      }
    },
    onMsgNotify(newMsgList) {
        let newMsg;
        for (let j in newMsgList) { //遍历新消息
            newMsg = newMsgList[j];
            handlderMsg(newMsg); //处理新消息
        }
    },
    //sdk登录
    sdkLogin() {
       webim.login(this.loginInfo,this.listeners,{
          isLogOn:false
        },
        (resp)=>{
          console.log('登录成功',resp)
          // this.createGroup();
          this.joinGroup();
          this.initRecentContactList();
        },
        (err) =>{
          console.log(err.ErrorInfo)
        })
    },
    //处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）
    handlderMsg(msg) {
        var fromAccount, fromAccountNick, sessType, subType, contentHtml;

        fromAccount = msg.getFromAccount();
        if (!fromAccount) {
            fromAccount = '';
        }
        fromAccountNick = msg.getFromAccountNick();
        if (!fromAccountNick) {
            fromAccountNick = fromAccount;
        }

        //解析消息
        //获取会话类型
        //webim.SESSION_TYPE.GROUP-群聊，
        //webim.SESSION_TYPE.C2C-私聊，
        sessType = msg.getSession().type();
        //获取消息子类型
        //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
        //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
        subType = msg.getSubType();

        switch (sessType) {
            case webim.SESSION_TYPE.C2C: //私聊消息
                switch (subType) {
                    case webim.C2C_MSG_SUB_TYPE.COMMON: //c2c普通消息
                        //业务可以根据发送者帐号fromAccount是否为app管理员帐号，来判断c2c消息是否为全员推送消息，还是普通好友消息
                        //或者业务在发送全员推送消息时，发送自定义类型(webim.MSG_ELEMENT_TYPE.CUSTOM,即TIMCustomElem)的消息，在里面增加一个字段来标识消息是否为推送消息
                        contentHtml = convertMsgtoHtml(msg);
                        webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick + ", content=" + contentHtml);
                        //c2c消息一定要调用已读上报接口
                        var opts = {
                            'To_Account': fromAccount, //好友帐号
                            'LastedMsgTime': msg.getTime() //消息时间戳
                        };
                        webim.c2CMsgReaded(opts);
                        alert('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick + ", 内容=" + contentHtml);
                        break;
                }
                break;
            case webim.SESSION_TYPE.GROUP: //普通群消息，对于直播聊天室场景，不需要作处理
                break;
        }
    },
    jsonpCallback(rspData){
      console.log("rspData:",rspData)
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
        // 'GroupId':this.newGroup,
        'ApplyMsg':'',
        'UserDefinedField':''
      }
      webim.applyJoinBigGroup(option,(resp)=>{ //applyJoinBigGroup、applyJoinGroup
        let joinedStatus = resp.JoinedStatus; //JoinedSuccess--成功加入，WaitAdminApproval--等待管理员审核
        if (resp.JoinedStatus && joinedStatus == "JoinedSuccess") {
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
    // 创建群
    createGroup(){
      let option={
        'Type':'Public',
        'Name':'qingqing',
        'MemberList':[]
      }
      webim.createGroup(option,(resp)=>{
        this.newGroup = resp.GroupId
        // 加入群
        this.joinGroup();
        console.log('群组创建成功',resp);
      },(err)=>{
        console.log(err.ErrorInfo);
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
          webim.syncMsgs(this.initUnreadMsgCount); // 初始化最近会话的消息未读数
        }else{

        }
      },(resp)=>{
        console.log('消息获取失败！',resp)
        //错误回调
      })
    },
    //初始化最近会话的消息未读数
    initUnreadMsgCount() {
        let sess;
        let sessMap = webim.MsgStore.sessMap();
        // console.error(sessMap)
        for (let i in sessMap) {
            sess = sessMap[i];
            // if (selToID && selToID != sess.id()) { //更新其他聊天对象的未读消息数
                console.info('sess.unread()', sess.unread())
                // updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
            // }
        }
    }
  }
}
