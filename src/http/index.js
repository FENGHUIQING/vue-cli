import config from '../config'
import store from '../store'
import axios from 'axios'
import whitelist from './api-whitelist'
import Vue from 'vue'
import router, {loginOut} from '../router'
// import { Modal }  from 'iview';
var ajax = axios.create({
  // baseURL: config.host + config.serverRoot,
  baseURL: config.host,
  timeout: 30000,
})
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.withCredentials = true
// Add a request interceptor
ajax.interceptors.request.use(function (config) {
  var path = config.url.replace(config.baseURL, '')
  var method = config.method
  var isWhite = false
  for (var i in whitelist) {
    var n = whitelist[i];
    if (path.startsWith(n.path)) {
      // console.log("路径："+n.path)
        if (n.method&&n.method.indexOf(method) == -1) {
          isWhite = false
        }else{
          isWhite = true
          break;
        }
      }
  }
  if (!isWhite) {
      // if (!store.state.xmttoken) {
      //   // router.replace('/login')
      //   return config
      // }
      // config.headers['xmttoken'] = store.state.xmttoken || ''
      // config.headers['Authorization'] = store.state.xmttoken || ''
      // config.headers['Authorization'] = store.state.xmttoken || ''
      // config.headers['SiteID'] = store.state.userinfo.siteids || ''
      // config.headers['Access-Control-Allow-Origin'] = '*'
      // config.headers['origin'] = 'http://localhost:8080'
      // config.headers['Accept'] = 'application/json, text/javascript, */*; q=0.01'
  }
  return config
}, function (error) {
return Promise.reject(error)
})
  // Add a response interceptor
ajax.interceptors.response.use(function (response) {
  // console.log(response,'请求结果')
  if (response.data && response.data.status && (response.data.status === 100 || response.data.status === 1500)) {
    // Modal.confirm({
    //     title: '退出',
    //       content: '暂无权限或token过期，请确认权限或重新登录！',
    //       closable: false,
    //       onOk: () => {
    //         loginOut();
    //       },
    //       onCancel: () => {
    //         loginOut();
    //       },
    //   })
    return false;
  }
  return response
}, function (error) {
   console.log(error,'请求错误结果')
  if(error.response.status == 401){
    const url = `${config.pupPath}/logout?${config.paramsOutStr}&t=`+new Date().getTime()
    localStorage.removeItem("xmttoken");
    localStorage.removeItem("xmtuserinfo");
    store.commit("set", {
      xmttoken: ""
    });
    store.commit("set", {
      userinfo: {}
    });
    window.location.href = url;
  }
  return Promise.reject(error)
})
export default ajax
