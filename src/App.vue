<template>
  <div id="app">
    <el-container class="elContain">
      <!--<el-aside width="200px">
        <div class="top-logo">互动运营平台</div>
      </el-aside>-->
      <el-container>
        <el-header>
          <div class="top-logo">互动运营平台</div>
          <el-menu
            :default-active="activeIndex"
            class="elMenuApp"
            mode="horizontal"
            @select="handleSelect"
            background-color="#505275"
            text-color="#fff"
            active-text-color="#46A9D4"
           >
            <el-submenu index="1">
              <template slot="title">直播秀</template>
              <el-menu-item index="2-1" >
                <router-link :to="{name:'home'}">
                  直播监控
                </router-link>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="2">拍客</el-menu-item>
            <el-menu-item index="3">圈子</el-menu-item>
          </el-menu>
          <div class="right-role">
            <span>管理员</span>
            <span class="logoOut">退出</span>
          </div>
        </el-header>
        <el-main class="main-con">
          <router-view/>
        </el-main>
        <el-footer class="mainFooter">© 2018 PDMI, Inc. All rights reserved. 京ICP备16032907号-2</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      activeIndex:'1',
    }
  },
  methods:{
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.main-con{
  /*min-height: calc(100vh-120px);*/
  min-height: 86vh;
}
.top-logo{
  height:60px;
  line-height: 60px;
  background: #46A9D4;
  text-align: center;
  color:#fff;
  /*去掉右侧*/
  position: absolute;
  left: 0;
  top:0;
  width:200px;
}
.right-role{
  position: absolute;
  right:20px;
  top:20px;
  color:#fff;
  cursor: pointer;
}
.right-role span{
  padding:0 6px;
}
.right-role span.logoOut{
  color:#46A9D4;
}
</style>
