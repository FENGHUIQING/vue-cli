(function(){
    // 配置
  var params = {
    client_id: '8723136989824972880b54c9c901f1b1',
    redirect_uri: encodeURIComponent(window.location.origin + '/#/home'),//回调地址
    response_type: 'code',
    status: ''
  }

  // 登出
  var paramsOut = {
    secret_key:'d83c1fa20598428fa01e52a80eb686e3',
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

  var host = 'http://mp.dev.hubpd.com/'
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
