<template>
  <div class="main" @touchmove.prevent>
    <div class="header">
      <div class="header_one">
        <div @click="back"><img src="static/images/dev/back_white@2x.png" ></div>
      </div>
      <div class="header_two" ref="header" >
        <div class="back_wrapper" @click="back"><img src="static/images/dev/back@2x.png"></div>
        <div class="gateway_wrapper">
          <li :class="{'selected':gateway==1}" @click="gatewayTo(1)">详情</li>
          <li :class="{'selected':gateway==2}" @click="gatewayTo(2)">卖点</li>
          <li :class="{'selected':gateway==3}" @click="gatewayTo(3)">搭配</li>
          <li :class="{'selected':gateway==4}" @click="gatewayTo(4)">推荐</li>
        </div>
      </div>
    </div>
    <div class="page" ref = "page">
      <div class="page_scroll_content">
        <div class="head_img" >
          <div id="video_wrapper" v-show="isVideo&&hasVideo"  class="good_video" ref="video">
          </div>
          <mslider v-show="!isVideo"  :loop="isLoop" ref="slider" :auto-play="false">
            <div class="img_wrapper" v-for="(item,index) in (styleInfo.styleImgList)" :key="index">
              <img :src="item">
            </div>
          </mslider>
          <div class="video_control" v-if="hasVideo">
            <div :class="{'video_select':isVideo}" @click="chooseModel(1)">视频</div>
            <div></div>
            <div :class="{'video_select':!isVideo}" @click="chooseModel(0)">图片</div>
          </div>
        </div>
        <div class="goods_container">
          <h4 class="goods_name">{{styleInfo.styleName}}</h4>
          <div class="goods_describe" @click="sellShow"><span>{{htmlToStr(styleInfo.wearSellingPoint)}}</span><img src="static/images/icon/right_blue@2x.png"></div>
          <div class="goods_wrap">
            <div class="goods_price">¥<strong>{{styleInfo.stylePrice}}</strong></div>
            <div>
              <span>推荐: </span>
              <span
                v-for="(item, key) in [1,2,3,4,5]"
                :key="key"
                class="star"
                :class="{highlighted:key<styleInfo.recommendationLevel}"
              ></span>
            </div>
          </div>
        </div>
        <div class="spacing"></div>
        <div class="title_wrap">
          <div>
            <div class="title">
              <img src="static/images/icon/right_white@2x.png"><div>商品基础信息</div>
            </div>
            <div class="subtitle">Commodity basic</div>
          </div>
          <div class="title_btn" @click="basicShow">详情</div>
        </div>
        <div class="spacing"></div>
        <div class="wrap">
          <div class="basic_info">
            <div class="row">
              <div class="left">
                <li>
                  <span class="name">款号</span>
                  <span class="value">{{styleInfo.styleNo}}</span>
                </li>
                <li>
                  <span class="name">波段</span>
                  <span class="value">{{styleInfo.bandName}}</span>
                </li>
                <li>
                  <span class="name">材质</span>
                  <span class="value">{{styleInfo.styleFabric}}</span>
                </li>
                <li>
                  <span class="name">廓形</span>
                  <span class="value">{{styleInfo.styleFlowerPattern}}</span>
                </li>
              </div>
              <div class="right">
                <li>
                  <span class="name">系列</span>
                  <span class="value">{{styleInfo.seriesName}}</span>
                </li>
                <li>
                  <span class="name">风格</span>
                  <span class="value">{{styleInfo.styleInfo}}</span>
                </li>
                <li>
                  <span class="name">颜色</span>
                  <span class="value">{{styleInfo.styleColor}}</span>
                </li>
                <li>
                  <span class="name">类别</span>
                  <span class="value">{{styleInfo.styleCategory}}</span>
                </li>
              </div>
            </div>
            <div class="row">
              <div class="center">
                <span class="name">洗涤</span>
                <span class="value">{{htmlToStr(styleInfo.washMaintenance)}}</span>
              </div>
            </div>
            <div class="row">
              <div class="center">
                <span class="name">标签</span>
                <span class="value">
                  <span class="style_label" v-for="(item,index) in styleInfo.styleLabel" :key="index">
                    {{item}}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="spacing"></div>
        <!-- 卖点 -->
        <div class="title_wrap" ref="sellpoint_title">
          <div>
            <div class="title">
              <img src="static/images/icon/right_white@2x.png"><div>商品核心卖点</div>
            </div>
            <div class="subtitle">Commodity core selling point</div>
          </div>
          <div class="title_btn" @click="sellShow">详情</div>
        </div>
        <div class="spacing"></div>
        <div class="wrap">
          <div class="basic_info">
            <div class="row" >
              <div class="center" style="margin:0">
                <span class="name">面料卖点</span>
                <span class="value" >{{htmlToStr(styleInfo.sellingPointFabric)}}</span>
              </div>
            </div>
            <div class="row">
              <div class="center">
                <span class="name">设计卖点</span>
                <span class="value">{{htmlToStr(styleInfo.designSellingPoint)}}</span>
              </div>
            </div>
            <div class="row">
              <div class="center">
                <span class="name">穿着卖点</span>
                <span class="value">{{htmlToStr(styleInfo.wearSellingPoint)}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="spacing"></div>
        <!-- 搭配 -->
        <div class="title_wrap" ref="coll_title">
          <div>
            <div class="title">
              <img src="static/images/icon/right_white@2x.png"><div>试试这样搭</div>
            </div>
            <div class="subtitle">Try this way</div>
          </div>
        </div>
        <div class="spacing"></div>
        <div class="wrap">
          <div class="scrollWrapper" ref="collsScroll">
            <div class="collocation">
              <div class="col_img_a" v-for="(item,index) in styleInfo.collList" :key="index">
                <img
                  height="100%"
                  :src="item.imgUrl"
                  alt=""
                  @click="toColl(item.id)" @load="loadedImg()"
                >
              </div>
              <!-- <div class="col_img_a" v-for="(item,index) in (1,3)" :key="index">
                <img
                  height="100%"
                  src="http://res.oitor.com:8099/upload/0/2018/11/45c6c5f3ac98460c9eed4ac3f60c6e90.jpg"
                  alt=""
                  @click="toColl(item.id)"
                >
              </div> -->
            </div>
          </div>
        </div>
        <div class="spacing"></div>
        <!-- 推荐 -->
        <div class="title_wrap" ref="match_title">
          <div>
            <div class="title">
              <img src="static/images/icon/right_white@2x.png"><div>搭配单品推荐</div>
            </div>
            <div class="subtitle">Matching single product recommendation</div>
          </div>
        </div>
        <div
          class="wrap"
          style="background:#F8F8F8"
        >
          <div>
            <ul class="recommended">
              <li
                v-for="(item, key) in styleInfo.styleList"
                :key="key"
              >
                <div class="rec_item" @click="toStyle(item.id)">
                  <img
                    width="100%"
                    :src="item.imgUrl"
                    alt="" @load="loadedImg()"
                  >
                  <p class="name">{{item.styleName}}</p>
                  <p class="rec_bottom"><span class="price"><i style="">¥</i> {{item.stylePrice}}</span></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <m-popup title="商品基础信息" ref="basic_pop">
      <ul>
        <li><span>款号</span><span>{{styleInfo.styleNo}}</span></li>
        <li><span>系列</span><span>{{styleInfo.seriesName}}</span></li>
        <li><span>波段</span><span>{{styleInfo.bandName}}</span></li>
        <li><span>风格</span><span>{{styleInfo.styleInfo}}</span></li>
        <li><span>材质</span><span>{{styleInfo.styleFabric}}</span></li>
        <li><span>颜色</span><span>{{styleInfo.styleColor}}</span></li>
        <li><span>廓形</span><span>{{styleInfo.styleFlowerPattern}}</span></li>
        <li><span>类别</span><span>{{styleInfo.styleCategory}}</span></li>
        <li><span>保养</span><span v-html="styleInfo.washMaintenance"></span></li>
      </ul>
    </m-popup>
    <m-popup title="商品核心卖点" ref="sell_pop">
      <ul>
        <li><span>面料卖点</span><span class="bs_prevent" v-html="styleInfo.sellingPointFabric"></span></li>
        <li><span>设计卖点</span><span class="bs_prevent" v-html="styleInfo.designSellingPoint"></span></li>
        <li><span>穿着卖点</span><span class="bs_prevent" v-html="styleInfo.wearSellingPoint"></span></li>
      </ul>
    </m-popup>
  </div>
</template>

<script>
import util from "@/assets/js/util.js"
import Slider from '../../comps/slider/slider.vue';
import popup from "../../comps/popup/popup.vue"
export default {
  name: "goodsDetail",
  data() {
    return {
      title:"商品",
      styleId:"",
      styleInfo:{
      },
      isLoop:true,
      gateway:1,
      hasVideo:false,
      isVideo:false,
      tempPath:"//vjs.zencdn.net/v/oceans.mp4"
    };
  },
  components:{
    'mslider': Slider,
    'mPopup':popup
  },
  methods:{
    chooseModel(val){
      let _this = this;
      if(val==1){
        _this.isVideo = true;
        _this.myPlayer.play();
      }else{
        _this.isVideo = false;
        _this.myPlayer.pause();
        _this.$refs.slider.update();
      }
    },
    gatewayTo(val){
      let _this = this;
      var x = 0;
      var y;
      var time = 500;
      if(val==1){
        y=0;
      }else if(val==2){
        y = -_this.$refs.sellpoint_title.offsetTop+_this.$refs.header.offsetHeight;
      }else if(val==3){
        y = -_this.$refs.coll_title.offsetTop+_this.$refs.header.offsetHeight;
      }else{
        y = -_this.$refs.match_title.offsetTop+_this.$refs.header.offsetHeight;
      }
      if(y<_this.pageScroll.maxScrollY){
        y=_this.pageScroll.maxScrollY;
      }
      _this.pageScroll.scrollTo(x,y,time);
    },
    sellShow(){
      this.$refs.sell_pop.show();
    },
    basicShow(){
      this.$refs.basic_pop.show();
    },
    loadedImg(){
      this.initOrLoadScrollView();
    },
    toColl(id){
      let _this = this;
      if(this.hasVideo) this.myPlayer.dispose();
      _this.$router.push({path:"/styleDetail",query:{"collId":id,stemp:new Date().getTime()}});
    },
    back(){
      if(this.hasVideo) this.myPlayer.dispose();
      this.$router.go(-1);
    },
    toStyle(val){
      let _this = this;
      if(this.hasVideo) this.myPlayer.dispose();
      let route = {
        path:"/goodsDetailEx",
        query:{
          styleId:val,
          stamp:new Date().getTime()
        }
      }
      _this.$router.push(route);
    },
    initOrLoadScrollView(){
      let _this = this;
      _this.$nextTick(()=>{
        if(!_this.pageScroll){
          _this.pageScroll = new _this.$BScroll(_this.$refs.page,{
            scrollX:false,
            scrollY:true,
            click:true,
            probeType:3,
            preventDefaultException:{className:/(^|\s)bs_prevent(\s|$)/}
          });
          _this.pageScroll.on("scroll",pos=>{
            // console.log(pos);
            // console.log(_this.$refs.sellpoint_title);
            // console.log(_this.$refs.sellpoint_title.offsetTop-_this.$refs.header.offsetHeight);
            var h1 = 0;
            var h2 = _this.$refs.sellpoint_title.offsetTop-_this.$refs.header.offsetHeight;
            var h3 = _this.$refs.coll_title.offsetTop-_this.$refs.header.offsetHeight;
            var h4 = _this.$refs.match_title.offsetTop-_this.$refs.header.offsetHeight;
            if(Math.abs(pos.y)>=h1 && Math.abs(pos.y)<h2){
              _this.gateway=1;
            }else if(Math.abs(pos.y)>=h2 && Math.abs(pos.y)<h3){
              _this.gateway=2;
            }else if(Math.abs(pos.y)>=h3 && Math.abs(pos.y)<h4){
              _this.gateway=3;
            }else{
              _this.gateway=4;
            }
            if(Math.abs(pos.y)-80 <= 0){
              _this.$refs.header.style.opacity=0;
            }
            else if(Math.abs(pos.y)-80 > 0){
              _this.$refs.header.style.opacity = (Math.abs(pos.y)-80)/180;
            }
          });
        }else{
          _this.pageScroll.refresh();
        }
        if(!_this.collsScroll){
          _this.collsScroll = new _this.$BScroll(_this.$refs.collsScroll,{
            scrollX:true,
            scrollY:false,
            // click:true
          });
        }else{
          _this.collsScroll.refresh();
        }
        // _this.pageScroll.scrollTo(0,0,0);
      })
    },
    getStyleInfo(id){
      let _this = this;
      _this.$axios.get("/api/style/"+id)
      .then(function(res){
        let data = res.data;
        if(data.code=="200"){
          data.data.styleImgList = data.data.imgUrls.split(",");
          if(data.data.styleLabel!=null){
            data.data.styleLabel = data.data.styleLabel.split(",");
          }
          _this.styleInfo = data.data;
          _this.hasVideo = !!_this.styleInfo.styleVideo;
          _this.isVideo = !!_this.styleInfo.styleVideo;
          _this.title = _this.styleInfo.styleNo;
          _this.isLoop = _this.styleInfo.styleImgList.length>1;

        }

        _this.$refs.slider.update();
        _this.initOrLoadScrollView();
      })
      .catch(function(error){
        console.log(error);
      });
    },
    initVideo() {
      let _this = this;
      let videoDom = '<video id="myVideo" class="video-js vjs-big-play-centered" controlslist="nodownload noremote noremoteplayback" oncontextmenu = "return false"></video>';
      document.getElementById("video_wrapper").innerHTML=videoDom;
      document.getElementById("myVideo").setAttribute("disablePictureInPicture","true");
      let options={
          //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          controls: true,
          //自动播放属性,muted:静音播放
          autoplay: "false",
          //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          preload: "metadata",
          //设置视频播放器的显示宽度（以像素为单位）
          width: _this.$refs.video.scrollHeight+"px",
          //设置视频播放器的显示高度（以像素为单位）
          height:  _this.$refs.video.scrollHeight+"px",
          // poster:"styleVideoPatch",
          // children: {
          controlBar: {
            fullscreenToggle: false,
            pictureInPictureToggle:false,
            textTrackSettings:false
          },
          // },
          sources: [{
            src: _this.styleInfo.styleVideo,
            type: 'video/mp4'
          }],
          nativeControlsForTouch:true
      }
        //初始化视频方法
      _this.myPlayer = this.$video("myVideo",options);
      _this.myPlayer.play();
      // _this.$nextTick(function(){

      // });
    },
    htmlToStr(val){
      return !val?"":val.split("<br>").join(" ");
    }
  },
  watch:{
    styleId:function(newV,oldV){
      let _this = this;
      util.loading();
      _this.getStyleInfo(newV);
    },
    hasVideo:function(newV){
      if(newV){
        let _this = this;
        _this.$nextTick(()=>{
          _this.isVideo = true;
          _this.initVideo();
        });
      }
    }
  },
  mounted(){
    let _this = this;
    _this.styleId = _this.$route.query.styleId;

  },
  activated(){
    let _this = this;
    console.log(_this.$rc)
    _this.$nextTick(function(){
      // _this.hasVideo = !!_this.styleInfo.styleVideo;
      if(!_this.$rc.isGo && _this.hasVideo){
        _this.isVideo = true;
        setTimeout(_this.initVideo(),300);
      }
    });

    // _this.styleId = _this.$route.query.styleId;
  },
  updated(){
    // this.initOrLoadScrollView();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.goods_container{
  padding: 14.5px 0px 10px 0px;
}

.goods_name{
  font-size: 18px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  padding: 0 0 6px 15px;
  /* line-height: 78px; */
}
.goods_describe{
  font-size: 14px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #FFFFFF;
  height:26.5px;
  background-color: #00A8C5;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods_describe span{
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goods_describe img{
  height: 18.5px;
  width: 18.5px;
}
.goods_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.goods_price {
  font-size: 14px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(184, 5, 2, 1);
}
.goods_price strong {
  font-size: 27px;
  font-family: KaiTi;
  font-weight: 400;
}
.star {
  display: inline-flex;
  vertical-align: text-top;
  width: 15.5px;
  height: 14px;
  margin-right: 1px;
  background: url("/static/images/goodDetail/star_no@2x.png") center / contain no-repeat;
}
.highlighted {
  background: url("/static/images/goodDetail/star@2x.png") center / contain no-repeat;
}
.basic_info {
  display: flex;
  flex-direction:column;
  font-size: 14px;
}

.spacing {
  height: 10px;
  background: #f8f8f8;
}
.wrap {
  padding: 14.5px 0;
}
.selling_point {
  font-size: 0.37333rem;
  padding: 0 15px 0;
}
.selling_point li {
  margin-bottom: 14px;
}
.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: rgba(201, 201, 201, 1);
  border-radius: 50%;
  margin-right: -2.5px;
  margin-bottom: 2px;
}
.collocation {
  display: inline-flex;
  justify-content: space-between;
  height: 146.5px;
  padding: 0 0 0 35px;
}
.col_img_a {
  height: 100%;
  /* width: 4.4rem; */
  text-align: center;
  margin-right: 15px;
  border:1px #F6F6F6 solid;
}
.col_img_b {
  height: 100%;
  width: 50%;
  text-align: center;
}
.recommended {
  display: flex;
  flex-wrap: wrap;
  padding: 0 2.5px 0 12.5px;
}
.recommended li {
  width: 50%;
  margin-bottom: 8px;
}
.rec_item {
  background: #fff;
  margin-right: 10px;
}
.rec_item .name {
  margin: 14.5px 11.5px 9.5px;
  font-size: 14px;
  font-family: ArialMT;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
}
.rec_item .rec_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 11.5px 16.5px;
}
.rec_item .rec_bottom .price {
  font-size: 18px;
  font-family: KaiTi;
  font-weight: 400;
  color: rgba(184, 5, 2, 1);
  line-height: 16px;
}
.rec_item .rec_bottom i {
  font-size: 14px;
  font-style: normal;
}
.rec_item .people_buy {
  font-size: 12px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  line-height: 16px;
}




.head_img{
  position: relative;
  width: 10rem;
  height:10rem;
  overflow: hidden;
}
.head_img_container{
  width: 10rem;
  overflow: hidden;
}
.head_img_content{
  display: inline-flex;
}
.img_wrapper{
  width: 10rem;
  height:10rem;
  text-align: center;
}
.img_wrapper img{
  max-height: 10rem;
  max-width: 10rem;
  height: 10rem;
}



.scrollWrapper{
  width: 100vw;
  overflow: hidden;
}


.header{
  height:1rem;
  width: 100%;
  position: absolute;
  z-index: 99;
}

.header_one{
  position: absolute;
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.header_one img{
  height: 0.4rem;

}
.header_one div{
  width:0.8rem;
  height:0.8rem;
  border-radius: 50%;
  background-color: #888888;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left:0.1rem;
}
.header_two {
  position: absolute;
  width: 100%;
  height: 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  opacity: 0;
  z-index: 100;
}
.header_two .back_wrapper{
  height: 1rem;
  width: 100%;
  display: flex;
  justify-self: center;
  align-items: center;
}
.header_two .back_wrapper img{
  height: 0.4rem;
  margin-left:0.4rem;
}
.header_two .gateway_wrapper{
  height: 0.8rem;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.header_two .gateway_wrapper li{
  width: 25%;
  text-align: center;
  height: 100%;
  line-height: 0.8rem;
}
.header_two .gateway_wrapper li.selected{
  color: #00A8C5;
}
.page{
  width: 100vw;
  flex: 1;
  overflow: hidden;
}

.main{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}



.title_wrap{
  height:48.5px;
  padding: 0 12.5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title_wrap>div{
  height:25px;
}

.title{
  color: #333333;
  font-size: 15px;
  display: flex;
  align-items: center;
}
.title img{
  height:15px;
  margin-right: 6.5px;
}
.subtitle{
  color: #C7C7C7;
  font-size: 6px;
  margin-left: 21.5px;
  line-height: 0.8;
}
.title_btn{
  width:45px;
  font-size: 14px;
  background-color: #00A8C5;
  border-radius: 2.5px;
  text-align: center;
  color: #fff;
  font-weight: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}


.basic_info .row{
  display: flex;
  justify-content: space-around;
}
.basic_info .row .left,.right{
  width: 50%;
}
.basic_info .row .left li:last-child{
  margin: 0;
}
.basic_info .row .right li:last-child{
  margin: 0;
}
.basic_info .row .left{
  border-right: 2px #CDCDCD dashed;
}
.basic_info .row li{
  margin-bottom: 15px;
  display: flex;
  flex: 1;
}
.basic_info .center{
  width: 100%;
  margin-top: 15px;
  display: flex;
}
.name{
  margin-left: 28.5px;
  color: #000000;
}
.value {
  color: #999;
  margin-left: 15px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.style_label{
  color: #00A8C5;
  margin-right: 12.5px;
}


.can_save_img{
  -webkit-touch-callout:default;
  display: none;
}
.good_video{
  width: 10rem;
  height: 10rem;
}


.video_control{
  width: 2.5rem;
  height: 0.8rem;
  position: absolute;
  bottom: 0.8rem;
  display: flex;
  left:50%;
  transform: translate(-50%, 0);
  border-radius: 0.4rem;
  overflow: hidden;
  text-align: center;
  line-height: 0.8rem;
  z-index: 2019;
}
.video_control>div{
  height:1rem;
  opacity: 0.7;
  background-color: #fff;
  color: #000;
}
.video_control>div:nth-child(1){
  width: 1.2rem;
  height:0.8rem;
}
.video_control>div:nth-child(2){
  width: 0.1rem;
  opacity: 0;
}
.video_control>div:nth-child(3){
  width: 1.2rem;
  height:0.8rem;
}
.video_control>div.video_select{
  background-color: #00A8C5;
  opacity: 1;
  color: #fff;
}
</style>

