// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'vuescroll/dist/vuescroll.css'
// import 'lib-flexible/flexible.js'
import axios from 'axios'
import { Indicator } from 'mint-ui';
import BScroll from 'better-scroll'
import vueLoading from 'vue-loading-template'
import './assets/css/my-mint-ui.css'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import routerStack from  './assets/js/routeStack.js'
import routerController from './assets/js/routerController.js'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
// import requestParams from './assets/js/requestParams'
// Vue.prototype.requestParams = requestParams;
import '@/components'
import '@/assets/icons'

import '@/plugins/Actions'

// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
// Vue.use(Viewer)

import store from './store/store.js'

import Scroll from 'vue-slim-better-scroll'
Vue.use(Scroll)

// 按需引入
import Vant from 'vant';
Vue.use(Vant);
import 'vant/lib/index.css';
import "./assets/css/my-vant.css";
import '@/styles/vant.scss'

import "./assets/css/my-mint.css";
import "./assets/css/my-common.css"

import './uno.css'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import globalVariable from './assets/js/globalFun'
Vue.prototype.GLOBAL = globalVariable

// import { ShareSheet } from 'vant';
// Vue.use(ShareSheet);

// import VConsole from 'vconsole/dist/vconsole.min.js'
// let vConsole = new VConsole() // 初始化

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.5,
  error: '../static/images/icon/goods-loading.png',       // 加载失败默认图片
  loading: '../static/images/icon/goods-loading.png',     // 加载中默认图片
  attempt: 2,
  listenEvents:['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'webkitAnimationend', 'webkitTransitionend', 'touchmove']
})


Vue.use(Element, { size: 'small', zIndex: 3000 });

Vue.use(MintUI)
Vue.use(vueLoading)

Vue.use(VueAwesomeSwiper)

Vue.prototype.$video = Video

Vue.prototype.$BScroll = BScroll
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$loading = Indicator
// Vue.prototype.routerStack = routerStack;

var rc = new routerController.routerController(Vue);
Vue.prototype.$rc = rc;


axios.defaults.baseURL = process.env.NODE_ENV === 'production'
                         ? './mta-api'
                         : "/api"
// axios.defaults.baseURL = "http://192.168.9.12:8132/mta-api/api/userInfo/login";     //内网 12服务器
// axios.defaults.baseURL = "http://192.168.9.52:9087/mta-api";     //内网
// axios.defaults.baseURL = "https://app.gaodanyi.com:9443/mta-api";    // 外网

// 本项目路由配置没有这样做，这个全局路由拦截就没啥作用了
router.beforeEach((to, from, next) => {
  // // 判断要去的路由有没有requiresAuth
  // // let userId = localStorage.getItem("userId")
  // if (to.meta.requiresAuth) {
  //   if (localStorage.userId) {
  //     next()
  //   } else {
  //     next({
  //       path: '/login',
  //       query: {
  //         redirect: to.fullPath
  //       } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
  //     })
  //   }
  // } else {
  //   if(from.path==='/limitToBuy' && to.path==='/productDetail'){
  //     from.meta.keepAlive = true;
  //   }
  //   next()
  // }


  //      /index    /myCircle   /newsDetail
  if(from.path==='/newsDetail' && to.path==='/myCircle'){
    localStorage.keepCircleFlag = true;
    next()
  }else{
    localStorage.keepCircleFlag = false;
    next()
  }
})


// 请求拦截器
axios.interceptors.request.use(
  config => {
    // console.log(config)
    // 自定义header信息（比如token，userId）

    if(!config.headers['userId']){
      config.headers['userId'] = localStorage.userId;
    }
    if(!config.headers['token']){
      config.headers['token'] = localStorage.accessToken;
    }

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器,针对所有的请求
axios.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  console.log('response',response)
  return response
}, function(error) {
  if (!error.response) {
    // console.log('网络超时，或者请求响应不成功，无返回状态')
    return Promise.resolve(error);
  }
  // console.log('error.response',error.response)

  // 处理状态码操作
  switch (error.response.status) {
    case 401:
      // console.log('token缺失，需要重新登录');
      if(error.response.data&&error.response.data.code=='3001'){
        Dialog.alert({
          title: '温馨提示',
          message: '版本有升级,请重新登录',
        }).then(() => {
          let osType = localStorage.osType;
          localStorage.clear();
          localStorage.clear();
          router.replace({
            path: '/login',
            query:{
              osType:osType
            }
          })
        })
      }else{
        //  未授权
        Dialog.alert({
          title: '温馨提示',
          message: '发现未认证的请求，拒绝访问',
        }).then(() => {
          // 点击确认但是不做任何操作
        })
      }
      return Promise.reject(error);
    case 403:
      // console.log('token过期，需要重新登录');
      Dialog.alert({
        title: '提示',
        message: 'token过期,请重新登录',
      }).then(() => {
        let osType = localStorage.osType;
        sessionStorage.clear();
        localStorage.clear();
        router.replace({
          path: '/login',
          query:{
            osType:osType
          }
        })
      })
      return Promise.reject(error);
    case 404:
  		// console.log('------404-----')
  		break;
  	case  500:
      // console.log('-------500--------');
  		break;
  	default :
    return Promise.reject(error);
  }
  // return error 返回错误
  return error;

})

// 重写clear方法，不删除用户数据
localStorage.clear = (function(clear) {
  return function() {
    const savedUsers = localStorage.savedUsers
    clear.call(this)
    if (savedUsers !== undefined) {
      localStorage.setItem('savedUsers', savedUsers)
    }
  }
})(localStorage.clear)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
