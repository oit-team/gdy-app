<template>
  <!-- 图片预览 -->
  <div id="imgPreview" >

    <!-- 图片预览模块 -->
    <div v-if="flag" @touchstart="touchStart" @touchend="touchEnd">
    <!-- <div v-if="flag"> -->
      <!-- :start-position="curIndex"  指定起始位置 :showIndex="false"  是否显示页码 -->
      <van-image-preview v-model="flag" :images="innerImgList" :start-position="curIndex" @change="onChange">
        <!-- <template v-slot:index>第{{ index }}页</template> -->
        <template slot="index">
          <slot :index="index"></slot>
        </template>
        <template slot="cover"></template>
      </van-image-preview>
    </div>

    <div v-if="!isRaw && raw" class="preview-origin">
      <van-button size="small" @click.stop="previewRaw()">查看原图</van-button>
    </div>
    <div class="image-preview__action">
      <slot name="action"></slot>
    </div>

    <!-- 分享模块 -->
    <van-share-sheet
      v-model="showShare"
      :options="options"
      :duration="0.1"
      @select="onSelect"
    />

  </div>
</template>
<script>
import { Toast } from 'vant';
import { ImagePreview } from 'vant';

let timer = null
const cache = []

export default {
  name:'',
  //
  props:{
    imgList: null,
    isShowPreview: null,
    fromPage: null,
    curIndex: null,
    ImagePreview: null,
    goodsId: null,
    raw: Boolean,
  },
  data(){
    return {
      flag:this.isShowPreview,
      // index:2,  // 自定义内容不生效，index没有任何用处
      showShare:false,
      options: [
        { name: '微信', icon: 'http://res.oitor.com:8099/upload/15000985612/2021/2/3db93b5eee414d62a400d18bb622a049.png' },
        { name: '朋友圈', icon: 'http://res.oitor.com:8099/upload/15000985612/2021/2/0695fe7d5b9a452fb3c2818a0fab8099.png' },
        { name: '保存图片', icon: require("../../../../static/images/icon/download.png") },
      ],

      touchStartX:null,
      touchStartY:null,
      touchEndX:null,
      touchEndY:null,
      touchstartTime:null,
      touchendTime:null,
      duration:0,

      curImgSrc:null,
      osType:null,
      // curIndex:1,
      index: 0,
      innerImgList: [],
    }
  },
  computed: {
    isRaw() {
      return /^((?!_x).)*\.[A-z]+$/.test(this.innerImgList[this.index])
    },
  },
  created(){
    this.innerImgList = this.imgList.map(img => {
      if (cache.includes(img)) return img
      return img.replace(/(.*)(\.[A-z]+)$/, '$1_x$2')
    })
    // console.log("goodsId====",this.goodsId)
    this.index = this.curIndex;
    // this.curIndex = 2
    // console.log("this.index======",this.index)
    this.curImgSrc = this.innerImgList[this.curIndex];  // 获取当前图片src并进行赋值
    // console.log("this.curImgSrc>>>>>",this.curImgSrc);

    // let u = navigator.userAgent;
    // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    // let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // // console.log("isAndroid>>>>",isAndroid,"------","isIOS>>>>>>",isIOS)
    // if(isAndroid){
    //   this.osType = 'ANDROID';
    // }
    // if(isIOS){
    //   this.osType = 'IOS';
    // }
    // console.log("this.osType---65-----",this.osType);

    this.osType = localStorage.osType;
  },
  mounted(){
    // console.log("this.fromPage===",this.fromPage,this.curIndex);
    // this.index = this.curIndex;

    // window.callCodeJsFunction = this.getCode;

  },
  methods:{
    getCode(code){
      // console.log("code=============",code)
    },
    getImgs(){
      ImagePreview({
      images: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
      ],
      startPosition: 1,
    });
    },
    onChange(index) {
      // console.log("change>>>>>>>>>>>>>",index)
      clearTimeout(timer)
      this.index = index;
      timer = setTimeout(() => {
        this.$emit('update:curIndex', index)
      }, 300)
      // 要根据当前的index值获取到对应图片的src,长按保存图片时将该src当作参数传过去
      // console.log("当前选中的图片的src",this.imgList[index])   // src
      this.curImgSrc = this.innerImgList[index];
      // console.log("this.imgList[index]>>>>>>",this.imgList[index])
    },

    // ImgUrl：//分享图片或视频的地址，必填
    // shareType：//1:分享文本给好友2：分享图片给好友3：分享图片给朋友圈4: 分享视频给朋友圈5: 分享视频给好友6: 分享文本给朋友圈、7: 分享链接给朋友圈，必填
    // title：//分享链接tile，分享链接时必填
    // linkUrl：//分享链接地址，分享链接时必填
    // 微信：wechat
    // 朋友圈：moments

    onSelect(option) {
      // Toast(option.name);
      // console.log("this.osType-----85------",this.osType)
      if (this.osType == 'ANDROID') {
        // Android   安卓机
        // jsObj.jump(JSON.stringify(obj)); // 调用原生app的函数
        // console.log("安卓机")
        if(option.name == '保存图片'){
          // console.log("安卓机下载图片")
          // 安卓保存图片
          window.JsCallObjectC.postMessage('{"methodName":"saveImageLocal","ImgUrl":"'+this.curImgSrc+'"}')

          // 测试获取设备code调取原生方法
          // window.JsCallObjectC.postMessage('{"methodName":"getDeviceCode"}')
        }else if(option.name == '微信'){
          // console.log("分享到微信");
          window.JsCallObjectC.postMessage('{"methodName":"ShareImage","ImgUrl":"'+this.curImgSrc+'","shareType":"2","title":"夏日温柔休闲装(测试标题)","detailDesc":"夏日小香风休闲装,舒适温柔又百搭,为你带来清凉舒适(测试描述)"}');
          this.shareRecord('wechat')
        }else if(option.name == '朋友圈'){
          window.JsCallObjectC.postMessage('{"methodName":"ShareImage","ImgUrl":"'+this.curImgSrc+'","shareType":"3","title":"夏日温柔休闲装(测试标题)","detailDesc":"夏日小香风休闲装,舒适温柔又百搭,为你带来清凉舒适(测试描述)"}');
          this.shareRecord('moments')
        }
      }
      if (this.osType == 'IOS'){
        // ios  苹果机
        if(option.name == '保存图片'){
          // console.log("下载图片")
          // console.log("this.curImgSrc>>>>>下载",this.curImgSrc)
          // console.log("苹果机");
          // console.log(window)
          // console.log(window.webkit)
          // window.webkit.messageHandlers.JsCallObjectC.postMessage('{"methodName":"SaveImage","ImgUrl":"https://www.wuyoumaicai.com/image/logo.png"}');

          window.webkit.messageHandlers.JsCallObjectC.postMessage('{"methodName":"SaveImage","ImgUrl":"'+this.curImgSrc+'"}');
          // window.webkit.messageHandlers.JsCallObjectC.postMessage('{"methodName":"getDeviceCode"}')
        }else if(option.name == '微信'){
          // console.log("分享到微信");
          // console.log("this.curImgSrc>>>>>分享到微信",this.curImgSrc);
          window.webkit.messageHandlers.JsCallObjectC.postMessage('{"methodName":"ShareImage","ImgUrl":"'+this.curImgSrc+'","shareType":"2","title":"夏日温柔休闲装(测试标题)","detailDesc":"夏日小香风休闲装,舒适温柔又百搭,为你带来清凉舒适(测试描述)"}');
          this.shareRecord('wechat');
        }else if(option.name == '朋友圈'){
          window.webkit.messageHandlers.JsCallObjectC.postMessage('{"methodName":"ShareImage","ImgUrl":"'+this.curImgSrc+'","shareType":"3","title":"夏日温柔休闲装(测试标题)","detailDesc":"夏日小香风休闲装,舒适温柔又百搭,为你带来清凉舒适(测试描述)"}');
          this.shareRecord('moments');
        }
      }

      this.showShare = false;
    },
    touchStart(event) {
      this.touchstartTime = new Date().getTime();
      this.touchStartX = event.changedTouches[0].clientX // this.touchStartX按下时的横轴坐标
      this.touchStartY = event.changedTouches[0].clientY // this.touchStartY按下时的纵轴坐标
    },
    touchEnd() {
      this.touchEndX = event.changedTouches[0].clientX // this.touchEndX释放时的横轴坐标
      this.touchEndY = event.changedTouches[0].clientY // this.touchEndY释放时的纵轴坐标
      this.touchendTime = new Date().getTime()
      this.duration = this.touchendTime - this.touchstartTime
      // console.log("间隔时间为",this.duration)

      // 非左右滑动
      if (Math.abs(this.touchEndX - this.touchStartX) < 10 && Math.abs(this.touchEndY - this.touchStartY) < 10) {
        // 长按时间设定为大于500毫秒了
        if(this.duration >= 500){
          // 时间大于800毫秒,长按
          // console.log("非左右滑动时间大于800毫秒,长按")
          // this.showShare = true;   // 还未实现下载功能，要把这一行注释掉
          if(this.fromPage == 'shopCollDetail' || this.fromPage == 'brandCollDetail'){
            this.showShare = true;
          }else{
            this.showShare = false;
          }
        }else{
          // 时间小于800毫秒,单纯的点击事件
          // console.log("非左右滑动时间小于800毫秒,单纯的点击事件")
          this.flag = false;
          this.showShare = false;
          // this.$emit('func',false)
          this.$emit('func',false)
        }
      }else{
        // 左右滑动
        if(this.duration >= 800){
          // 时间大于800毫秒,单纯的点击事件
          // console.log("左右滑动时间大于800毫秒,单纯的点击事件")
          this.flag = true;
          this.showShare = false;
        }else{
          // 时间小于800毫秒
          // console.log("左右滑动时间小于800毫秒,隐藏分享/下载按钮")
          this.flag = true;
          this.showShare = false;
          // this.$emit('func',false)
        }

      }
    },
    // 插入分享记录
    shareRecord(fwPlatform){
      let _this = this;
      let data = {
        "userId": localStorage.userId,
        "fwPlatform": fwPlatform,    // 微信：wechat  朋友圈：moments
        "fwType": 1,    // 1：搭配转发    2：商品转发(预留，现在先不考虑)
        "sId":this.goodsId,
        "fwDevice":this.osType   // IOS   ANDROID
      }
      // console.log("data=====",data);
      _this.$axios.post("/api/userInfo/insertFwRecord",data).then(function (res){
        let data = res.data;
        // console.log("插入分享记录成功返回数据======",data.data);      // 1
        if(data.code=="200"){

        }else{
          // console.log("插入分享记录失败")
        }
      }).catch(function (error) {
        // console.log('插入分享记录失败',error);
      });
    },
    previewRaw() {
      this.$set(this.innerImgList, this.index, this.innerImgList[this.index].replace('_x', ''))
      const current = this.innerImgList[this.index]
      if (!cache.includes(current)) cache.push(current)
    }
  }

}
</script>
<style lang="less" scoped>
  #imgPreview{
    width:100%;

  }

  .image-preview__action {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .preview-origin {
    padding: 16px;
    position: relative;
    z-index: 9999;
  }
</style>
