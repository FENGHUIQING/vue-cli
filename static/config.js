(function(){
    // 配置
  var params = {
    client_id: 'd42e95b38af541a3b705b442c1c93b88',
    redirect_uri: encodeURIComponent(window.location.origin + '/#/home'),//回调地址
    response_type: 'code',
    status: ''
  }

  // 登出
  var paramsOut = {
    secret_key:'1ef7f236cf134a05908d691ac7e40c92',
    redirectUrl: encodeURIComponent(window.location.origin + '/#/login')
  }

  // pup路径
  var pupPath = 'http://fuxian.sxbctv.com/pup-asserver'

  // pup code换取token接口
  var codeToken = 'http://mp.dev.hubpd.com/gateway/USER-MANAGE/user'

  function paramsFun(params){
    var str = ''
    for(i in params){
      str += i+'='+params[i]+'&'
    }
    return str.slice(0,str.length-1)
  }
  var paramsStr = paramsFun(params)
  var paramsOutStr = paramsFun(paramsOut)
  // var paramsOutStr = Object.keys(paramsOut).map(k => `${k}=${paramsOut[k]}`).join('&')
  // var paramsOutStr = Object.keys(paramsOut).map(function(k){k = paramsOut[k]}).join('&')

  window.__DEV__ = true

  // var host = 'http://mp.dev.hubpd.com/gateway/LIVE/'
  // http://192.168.198.222:9001/live/api/web/live/getList?pageNum=1&pageSize=10&status=0
  var host = 'http://mp.dev.hubpd.com/gateway/LIVE/live/'
  var hostUeditor = 'http://mp.dev.hubpd.com/xmt/'

  var fileRouter = 'http://mp.dev.hubpd.com/'
  // 推送服务
  var servicePush = 'http://mp.dev.hubpd.com/gateway/U-MENG/xmtmedia/'
  // 腾讯视频
  var secretId = 'AKIDLcjeNxMuAEIG3eeRYSG7wc8ukS4HKM9u'
  var secretKey = 'thKl5EBGCzb1GJApIgstiLm2Tnwa5OUN'

  var root = '/'
  var appHost = 'http://mp.dev.hubpd.com/gateway/U-MENG/'
  var config = {
      env: '',
      host: host,
      root: root,
      serverRoot: 'xmtmedia/',
      // serverRoot: 'ynrbmedia/',
      paramsStr:paramsStr,
      paramsOutStr:paramsOutStr,
      hostUeditor:hostUeditor,
      pupPath:pupPath,
      codeToken:codeToken,
      servicePush:servicePush,
      secretId:secretId,
      secretKey:secretKey,
      appHost:appHost,
      Authorization:'Authorization',
      fileRouter:fileRouter
  }
  window.globalConfig = config;
})();
