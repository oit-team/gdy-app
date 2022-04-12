<template>
  <div id="app">
    <transition :name="transitionName">
      <!-- 貌似不行,页面结构错乱了 -->
      <!-- <div>
        <keep-alive>
          <router-view  :key="$route.fullPath" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view :key="$route.fullPath" v-if="!$route.meta.keepAlive"></router-view>
      </div> -->

      <keep-alive exclude="login">
        <router-view :key="$route.fullPath" class="router-view"/>
      </keep-alive>

    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      transitionName:'',
      keepalivelist:[]
    }
  },
  watch:{
    $route(to,from){
      // console.log(this.$rc.isGo);
      if(this.$rc.isGo){
        this.transitionName = 'slide-left';
      }else{
        this.transitionName = 'slide-right';
      }
    }
  },
  destroyed() {
    console.log(1)
  },
}
</script>

<style>
:root {
  --gray: #F6F6F6;
  --primary: #1978FE;
}
* {
  user-select: none;
}
html,body{
  position: relative;
  width: 100%;
  height: 100%;
}
#app {
  font-family: PingFang-SC-Medium, sans-serif;
  font-size: 16px;
  position: absolute;
  top:0;
  left:0;
  overflow: scroll;
  width: 100%;
  height: 100%;
  background: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  position: absolute;
  transition: all 500ms;
  will-change: transform;
}
.slide-right-enter {
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
}
.slide-right-leave-active {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}
.slide-left-enter {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}
.slide-left-leave-active {
  transform: translate3d(-100%, 0, 0);
  opacity: 0;
}
.main{
  width: 100%;
  height:100%;
}

[v-cloak] {
  display: none;
}

.router-view {
  width:100%;
  height:100%;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
