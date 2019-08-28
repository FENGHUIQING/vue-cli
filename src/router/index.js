import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import routes from './router'
import config from '../config'
import util from '../utils'
import http from '../http'
import axios from 'axios'
import $ from 'jquery'

Vue.use(Router)
const router = new Router({
  mode: 'hash',
  base: config.root,
  routes
})
export const loginOut = function () {
      let path = `${config.codeToken}/logout`;
      const url = `${config.pupPath}/logout?${config.paramsOutStr}&t=`+new Date().getTime();
      if(store.xmttoken == undefined || !store.xmttoken){
        window.location.href = url;
        return;
      }
      $.ajax({
        url:path,
        headers:{
          'Authorization':store.state.xmttoken,
          'Access-Control-Allow-Methods':'GET,PUT,DELETE,POST'
        },
        beforeSend :function(xmlHttp){
            xmlHttp.setRequestHeader("If-Modified-Since","0");
            xmlHttp.setRequestHeader("Cache-Control","no-cache");
        },
        type: "PUT",
        xhrFields:{
          'Access-Control-Allow-Origin': '*'
        },
        async: true,
        success:(res)=>{
          localStorage.removeItem("xmttoken");
          store.commit("set", {
            xmttoken: ""
          });
          window.location.href = url;
          return
        },
        error:(res) => {
          console.log(res,"退出失败")
        }
      })
    }
router.beforeEach((to, from, next) => {
  if(to.path == '/login'){
    const url = `${config.pupPath}/authorize?${config.paramsStr}`
    window.location = url
    return
  } else if (to.path == '/home') {
      let url = document.URL
      let urlCode = to.query.code;
      if(urlCode){
        let path = `${config.codeToken}/accesstoken?code=`+urlCode
        $.ajax({
          url:path,
          type: "GET",
          dataType: 'json',
          xhrFields:{
            'Access-Control-Allow-Origin': '*'
          },
          async: false,
          success:(res)=>{
            let currenToken = res.data.token;
            store.commit('set', {
              xmttoken: currenToken
            })
            localStorage.setItem('xmttoken', currenToken)
            router.replace('/home');
          },
          error:(res) =>{
            console.log("请求失败")
            store.commit('set', {
                xmttoken: ''
              })
            router.replace('/login')

          }
        })
      }
  }
  // util.title(to.meta.title);
  if(store.state.xmttoken == '' && to.name != 'login'){
    next("/login");
  }else{
    next();
  }

})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
})

export default router;
