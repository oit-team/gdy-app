<template>
  <div id="app" class="text-base">
    <BetterView></BetterView>
  </div>
</template>

<script>
import { BetterView } from '@oit/vue-components'

export default {
  name: 'App',
  components: {
    BetterView,
  },
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
  }
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
html {
  font-size: 32px;
}
#app {
  font-family: PingFang-SC-Medium, sans-serif;
  position: absolute;
  top:0;
  left:0;
  overflow: scroll;
  overscroll-behavior: none;
  width: 100%;
  height: 100%;
  background: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;
}
.vc-better-view {
  height: 100vh;
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
