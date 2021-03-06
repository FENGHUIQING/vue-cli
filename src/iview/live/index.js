const livebox = r => require.ensure([], () => r(require('../../components/liveel/liveel.vue')))
import { MESSAGE_TYPE } from 'vue-baberrage'
export default {
  components:{
    livebox
  },
  data(){
    return {
      roomId:this.$route.query.roomId,
      currentId:0,
      value:true,
      plvalue:true,
      loginInfo:{},
      listeners:{},
      newGroup:'',
      barrageList:this.$store.state.barrageList,
      barrageList1:[],
      nickName:'主播',
      isLogin:false,
      sendInput:'',
      userData:{},
    }
  },
  mounted(){
    this.getuserInfo();
  },
  created(){

  },
  computed:{
  },
  watch:{

  },
  methods:{
    // 初始化直播状态
    forbidChange(data){
      this.userData = data;
      this.value = data.forbid == 1 ? false :true;
      this.plvalue = data.shutup == 'Off' ? true : false;
    },
    // 修改直播状态
    liveChange(state){
      if(!state){
        this.cutLive(state);
      }else{
        this.concatLive(state);
      }
    },
    // 切断直播
    cutLive(state){
      this.$http.post('/api/web/liveMange/forbidLiveStream',{
        roomid:this.roomId,
        forbidday:0
      }).then(res =>{
        if(res.data.status == 200){
          this.$notify({
            title: '',
            message: '直播流已切断！',
            type: 'success'
          });
        }else{
          this.value = !state
          this.$notify.error({
            title: '',
            message: res.data.message ? res.data.message :'操作失败',
          });
        }
      })
    },
    // 回复直播
    concatLive(state){
      this.$http.post('/api/web/liveMange/resumeLiveStream',{
        roomid:this.roomId
      }).then(res=>{
        if(res.data.status == 200){
          this.$notify({
            title: '',
            message: '直播流已恢复！',
            type: 'success'
          });
        }else{
          this.value = !state
          this.$notify.error({
            title: '',
            message: res.data.message ? res.data.message :'操作失败',
          });
        }
      })
    },
    // 改变禁言
    changeShutup(data){
      let shutup = data == true ? 'Off' : 'On';
      let infoType = data == true ? '7' : '6'
      this.$http.put('/api/web/im/?id='+this.roomId+'&shutUp='+shutup).then(res=>{
        if(res.data.status == 200){
          // 发送消息
          this.sendGroupLoveMsg(infoType);
        }else{
          this.plvalue = !data
          this.$notify.error({
            title: '',
            message: res.data.message ? res.data.message :'操作失败',
          });
        }
      })
    },
    // 获取用户信息
    getuserInfo(){
      this.$http.get('/api/web/imAdminInfo').then(res=>{
        if(res.data.status == 200){
          let data = res.data.data;
          this.loginInfo.sdkAppID = data.sdkappid;
          this.loginInfo.appIDAt3rd = data.sdkappid;
          this.loginInfo.identifier = data.admin;
          this.loginInfo.userSig = data.usersig;
          this.webimLogin()
        }
      })
    },
    webimLogin(){
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
          // console.debug(data);
        } //申请文件/音频下载地址的回调
          ,
        "onLongPullingNotify": (data) => {
          // console.debug('onLongPullingNotify', data)
        }
      };
      this.sdkLogin();
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

            // if (unread > 0) {
            //     // $("#badgeDiv_" + notify.From_Account).text(unread).show();
            // } else {
            //     // $("#badgeDiv_" + notify.From_Account).val("").hide();
            // }
        }
    },
    // 多端登录被T
    onMultipleDeviceKickedOut() {
        webim.Log.error("多终端登录，被T了");
    },
    //监听大群新消息（普通，点赞，提示，红包）
    onBigGroupMsgNotify(msgList) {
      // console.log("msgList直播中：",msgList)
      if (msgList && msgList.length){
        for (var i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
            var msg = msgList[i];
            //显示收到的消息
            this.convertMsgtoText(msg);
        }
      }
    },
    convertMsgtoText(msg){
      let elems = msg.getElems();
      let type = 0;
      let content = "";
      let mesgText = "";
      let elm = 0;
      for(let i in elems){
        elm = elems[i];
        type = elm.getType(); //获取元素类型
        content = elm.getContent(); //获取元素对象
        // console.log('webim.MSG_ELEMENT_TYPE.TEXT',content)
        switch (type){
          case webim.MSG_ELEMENT_TYPE.TEXT:
            mesgText = this.convertTextMsgToHtml(content);
            break;
          case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
            mesgText = this.convertGroupTipMsgToHtml(content);
            break;
          case webim.MSG_ELEMENT_TYPE.CUSTOM: //自定义消息
            mesgText = this.convertCustomMsgToHtml(content);
          default:
            webim.Log.error('未知消息元素类型: elemType=' + type);
            break;
        }
      }
      if(mesgText && mesgText != ''){
        let obj = {
          id: ++this.currentId,
          avatar: "",//头图
          msg: mesgText,
          time: 5,
          type: MESSAGE_TYPE.NORMAL,
          nickName:this.nickName
        }
        this.$store.state.barrageList.push(obj);
        this.barrageList1.push(obj);
        this.$nextTick(()=>{
          let div = document.getElementById('barList');
          div.scrollTop = div.scrollHeight
        })
      }
    },
    //解析文本消息元素
    convertTextMsgToHtml(content) {
        return content.getText();
    },
    //解析自定义消息元素
    convertCustomMsgToHtml(content) {
      let data = JSON.parse(content.getData());
      if(!data.data){
        return false;
      }
      let cmdType = data.data.cmd;
      let text = ""
      let userType = data.data.userType;
      switch(cmdType){
        case '1':
          text = data.data.msg;
          break;
        case '6': //开启禁言
          this.plvalue = false;
          text = '关闭了聊天'
          break;
        case '7':
          this.plvalue = true;
          text = "恢复了聊天";
          break;
        default:
          console.log("cmdType：",cmdType);
          break;
      }
       switch(userType){
        case '1':
          this.nickName = '管理员';
          break;
        case '2':
          this.nickName = '主播';
          break;
        default:
           this.nickName = data.data.userName;
          break;
      }
      return text;
    },
    // 解析群提示消息
    convertGroupTipMsgToHtml(content) {
        var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
        var text = "";
        var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
        var opType, opUserId, userIdList;
        var memberCount;
        opType = content.getOpType(); //群提示消息类型（操作类型）
        opUserId = content.getOpUserId(); //操作人id
        userIdList = content.getUserInfo();
        switch (opType) {
            case webim.GROUP_TIP_TYPE.JOIN: //加入群
                //text += opUserId + "邀请了";
                for (var m in userIdList) {
                    if (userIdList[m].NickName != undefined) {
                        text += userIdList[m].NickName + ",";
                        this.nickName = userIdList[m].NickName
                    } else {
                        text += userIdList[m].UserId + ",";
                        this.nickName = userIdList[m].UserId
                    }
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text = text.substring(0, text.length - 1);
                // text += "进入房间";
                text = "进入房间";
                break;
            case webim.GROUP_TIP_TYPE.QUIT: //退出群
                text +=  "离开房间";
                break;
            case webim.GROUP_TIP_TYPE.KICK: //踢出群
                text += opUserId + "将";
                for (var m in userIdList) {
                    if (userIdList[m].NickName != undefined) {
                        text += userIdList[m].NickName + ",";
                    } else {
                        text += userIdList[m].UserId + ",";
                    }
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text += "踢出该群";
                break;
            case webim.GROUP_TIP_TYPE.SET_ADMIN: //设置管理员
                text += opUserId + "将";
                for (var m in userIdList) {
                    if (userIdList[m].NickName != undefined) {
                        text += userIdList[m].NickName + ",";
                    } else {
                        text += userIdList[m].UserId + ",";
                    }
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text += "设为管理员";
                break;
            case webim.GROUP_TIP_TYPE.CANCEL_ADMIN: //取消管理员
                text += opUserId + "取消";
                for (var m in userIdList) {
                    if (userIdList[m].NickName != undefined) {
                        text += userIdList[m].NickName + ",";
                    } else {
                        text += userIdList[m].UserId + ",";
                    }
                    if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + userIdList.length + "人";
                        break;
                    }
                }
                text += "的管理员资格";
                break;

            case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO: //群资料变更
                text += opUserId + "修改了群资料：";
                var groupInfoList = content.getGroupInfoList();
                var type, value;
                for (var m in groupInfoList) {
                    type = groupInfoList[m].getType();
                    value = groupInfoList[m].getValue();
                    switch (type) {
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
                            text += "群头像为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
                            text += "群名称为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
                            text += "群主为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
                            text += "群公告为" + value + "; ";
                            break;
                        case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
                            text += "群简介为" + value + "; ";
                            break;
                        default:
                            text += "未知信息为:type=" + type + ",value=" + value + "; ";
                            break;
                    }
                }
                break;

            case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO: //群成员资料变更(禁言时间)
                text += opUserId + "修改了群成员资料:";
                var memberInfoList = content.getMemberInfoList();
                var userId, shutupTime;
                for (var m in memberInfoList) {
                    userId = memberInfoList[m].getUserId();
                    shutupTime = memberInfoList[m].getShutupTime();
                    text += userId + ": ";
                    if (shutupTime != null && shutupTime !== undefined) {
                        if (shutupTime == 0) {
                            text += "取消禁言; ";
                        } else {
                            text += "禁言" + shutupTime + "秒; ";
                        }
                    } else {
                        text += " shutupTime为空";
                    }
                    if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                        text += "等" + memberInfoList.length + "人";
                        break;
                    }
                }
                break;
            default:
                text += "未知群提示消息类型：type=" + opType;
                break;
        }
        return text;
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
      if(!webim.checkLogin()){
       webim.login(this.loginInfo,this.listeners,{
          isLogOn:false
        },
        (resp)=>{
          console.log('登录成功',resp)
          this.joinGroup();
        },
        (err) =>{
          console.log(err.ErrorInfo)
        })
      }
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
        'GroupId':this.roomId,
        'ApplyMsg':'',
        'UserDefinedField':''
      }
      webim.applyJoinBigGroup(option,(resp)=>{ //applyJoinBigGroup、applyJoinGroup
        let joinedStatus = resp.JoinedStatus; //JoinedSuccess--成功加入，WaitAdminApproval--等待管理员审核
        if (resp.JoinedStatus && joinedStatus == "JoinedSuccess") {
            console.log('成功加入该群');
            this.isLogin = true;
        } else {
          console.log('申请成功，请等待群主审核');
        }
      },(err)=>{
        console.log(err.ErrorInfo)
      })
    },
    // 获取信息列表
    initRecentContactList(){
      webim.getRecentContactList({ //获取会话列表
        'Count':20 //最近的回话数，最大为100
      },(resp)=>{
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
        for (let i in sessMap) {
            sess = sessMap[i];
            // if (selToID && selToID != sess.id()) { //更新其他聊天对象的未读消息数
                console.info('sess.unread()', sess.unread())
                // updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
            // }
        }
    },
// 发送普通消息
    sendGroupLoveMsg(infoType) {
      if(!this.plvalue){
        this.$notify.error({
          title: '',
          message: '禁言状态开启！',
        });
        return;
      }
        if (!this.loginInfo.identifier) { //未登录
            if (accountMode == 1) { //托管模式
                //将account_type保存到cookie中,有效期是1天
                webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
                //调用tls登录服务
                // this.getuserInfo();
            } else { //独立模式
                alert('请填写帐号和票据');
            }
            return;
        }

        // if (!selToID) {
        //     alert("您还没有进入房间，暂不能聊天");
        //     return;
        // }
        //获取消息内容
        let msgtosend = infoType == '1' ? this.sendInput : '修改评论状态！';
        let msgLen = webim.Tool.getStrBytes(msgtosend);
        let selType = webim.SESSION_TYPE.GROUP;
        let selToID = this.roomId;
        let selSessHeadUrl = ''
        if (msgtosend.length < 1) {
          this.$notify.error({
            title: '',
            message: '消息不能为空!',
          });
          return;
        }

        let maxLen, errInfo;
        // if (selType == webim.SESSION_TYPE.GROUP) {
        //     maxLen = webim.MSG_MAX_LENGTH.GROUP;
        //     errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
        // } else {
        //     maxLen = webim.MSG_MAX_LENGTH.C2C;
        //     errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
        // }
        if (msgLen > maxLen) {
            console.log('长度错误',errInfo);
            return;
        }

        // if (!selSess) {
            let selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
        // }
        let isSend = true; //是否为自己发送
        let seq = -1; //消息序列，-1表示sdk自动生成，用于去重
        let random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
        let msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
        let subType = webim.GROUP_MSG_SUB_TYPE.COMMON; //消息子类型
        // if (selType == webim.SESSION_TYPE.GROUP) {
        //     //群消息子类型如下：
        //     //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
        //     //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
        //     //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
        //     //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
        //     subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

        // } else {
        //     //C2C消息子类型如下：
        //     //webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
        //     subType = webim.C2C_MSG_SUB_TYPE.COMMON;
        // }
        let msg = new webim.Msg(selSess, isSend, seq, random, msgTime,this.loginInfo.identifier, subType);

        //解析文本和表情
        let expr = /\[[^[\]]{1,3}\]/mg;
        let emotions = this.sendInput.match(expr);
        let text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
        let msgInfo = {
            "cmd" : "CustomCmdMsg",
            "data" : {
                "cmd" : infoType,
                "msg" : infoType == '1' ?this.sendInput : '修改评论状态！',
                "userAvatar" : "",
                "userName" : this.userData.streamerName,
                "userType" : "1"
            },
            "userAvatar" : "",
            "userName" : this.userData.streamerName
        }
        let data = JSON.stringify(msgInfo)
        let desc= 'pc_Info';
        let ext = '1'

        if (!emotions || emotions.length < 1) {
            text_obj = new webim.Msg.Elem.Custom(data,desc,ext);
            msg.addCustom(text_obj);
        }
        // else { //有表情

        //     for (var i = 0; i < emotions.length; i++) {
        //         tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
        //         if (tmsg) {
        //             text_obj = new webim.Msg.Elem.Text(tmsg);
        //             msg.addText(text_obj);
        //         }
        //         emotionIndex = webim.EmotionDataIndexs[emotions[i]];
        //         emotion = webim.Emotions[emotionIndex];
        //         if (emotion) {
        //             face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
        //             msg.addFace(face_obj);
        //         } else {
        //             text_obj = new webim.Msg.Elem.Text(emotions[i]);
        //             msg.addText(text_obj);
        //         }
        //         restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
        //         msgtosend = msgtosend.substring(restMsgIndex);
        //     }
        //     if (msgtosend) {
        //         text_obj = new webim.Msg.Elem.Text(msgtosend);
        //         msg.addText(text_obj);
        //     }
        // }
        webim.sendMsg(msg, (resp) => {
            // if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            //     showMsg(msg);
            // }
          this.sendInput = '';

        }, (err)=> {
          if(!this.plvalue){
            this.$notify.error({
              title: '',
              message: '禁言状态开启！',
            });
          }else{
            this.$notify.error({
              title: '',
              message: '发送失败！',
            });
          }

        });
    }
  }
}
