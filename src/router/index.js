import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import routes from './router'
import config from '../config'
import util from '../utils'
import http from '../http'

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
          localStorage.removeItem("xmtuserinfo");
          store.commit("set", {
            xmttoken: ""
          });
          store.commit("set", {
            userinfo: {}
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
            http.post('api/pupuser').then(({ data }) => {
              if(data.status == 1){
                var userinfo = {}
                if(!data.siteids[0] && data.privs.menu){
                  userinfo = {
                    id:data.userid,
                    operatortype: data.operatortype,
                    orgId: data.org_id,
                    username:data.username,
                    privs:data.privs,
                    publish:data.publish,
                    republish:data.republish
                  }
                  store.commit('set', { userinfo })
                  localStorage.setItem('xmtuserinfo', JSON.stringify(userinfo))
                  router.replace('/site/creatSite')
                  return;
                }else{
                  userinfo = {
                    id:data.userid,
                    operatortype: data.operatortype,
                    orgId: data.org_id,
                    username:data.username,
                    privs:data.privs,
                    publish:data.publish,
                    siteids:data.siteids[0],
                    rolecode:data.rolecode ? data.rolecode : [],
                    republish:data.republish
                  }
                }
                store.commit('set', { userinfo })
                localStorage.setItem('xmtuserinfo', JSON.stringify(userinfo))
                router.replace('/home');
                this.$Message.success('登录成功!')
              }else{
                console.log("准备退出！",data.status)
              }

            }).catch(() => {
              console.log("请求失败")
            })

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
  }else if (to.path === '/preview/publish') {
    let token = util.getParamURL('token');
    store.commit('set', {
      xmttoken: token
    })
  }
  util.title(to.meta.title);
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
