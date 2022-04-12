<template>
  <div class="goodDetailMain" @touchmove.prevent>
    <div class="header">
      <div class="header_one">
        <div class="head_one_back" @click="back"><img src="static/images/dev/back_white@2x.png" ></div>
      </div>
      <div ref="header" class="header_two" >
        <div class="back_wrapper" @click="back"><img src="static/images/dev/back@2x.png"></div>
        <div class="gateway_wrapper">
          <li :class="{'selected':gateway==1}" @click="gatewayTo(1)">详情</li>
          <li :class="{'selected':gateway==2}" @click="gatewayTo(2)">卖点</li>
          <li :class="{'selected':gateway==3}" @click="gatewayTo(3)">搭配</li>
          <!-- <li :class="{'selected':gateway==4}" @click="gatewayTo(4)">推荐</li> -->
        </div>
      </div>
    </div>
    <div ref = "page" class="page">
      <div class="page_scroll_content">
        <div class="head_img" >
          <!-- <div id="maskBox"></div> -->
          <div v-show="isVideo&&hasVideo" ref="video"  id="video_wrapper" class="good_video" @click="clickVideo" @dblclick="dblclickVideo">
          </div>
          <mslider v-show="!isVideo"  ref="slider" :loop="isLoop" :auto-play="false">
            <div v-for="(item,index) in (styleInfo.styleImgList)" :key="index" class="img_wrapper" >
              <!-- <img :src="item" alt="" @click="getImg(index)" @touchstart="touchStart" @touchend="touchEnd"> -->
              <img :src="item" alt="" @click="getImg(index)">
            </div>
          </mslider>

          <div v-if="hasVideo" class="video_control">
            <div :class="{'video_select':isVideo}" @click="chooseModel(1)">视频</div>
            <div></div>
            <div :class="{'video_select':!isVideo}" @click="chooseModel(0)">图片</div>
          </div>
        </div>

        <div class="baseInfoBox"  @click="basicShow(1)">
          <div class="titbox">
            <div class="inner">商品信息</div>
            <img src="static/images/icon/rightArrowGrey.png" alt="">
          </div>
          <div class="titbox">
            <div class="title-name">{{styleInfo.styleName}}</div>
          </div>
          <div class="titbox baseBox">
            <div class="goods-num">{{styleInfo.styleNo}}</div>
            <div class="price">￥{{styleInfo.stylePrice}}</div>
          </div>

          <div v-if='sizeList&&sizeList.length>0' class="baseItemBox">
            <div class="item" @click.stop="basicShow(1)">
              <img src="static/images/icon/base.png" alt="">
              <span>基础信息</span>
            </div>
            <!-- <div class="item" @click.stop="basicShow(2)">
              <img src="static/images/icon/point.png" alt="">
              <span>商品指数</span>
            </div> -->
            <div class="item" @click.stop="basicShow(3)">
              <img src="static/images/icon/sizeIcon.png" alt="">
              <span>商品尺码</span>
            </div>
          </div>
        </div>

        <div ref="sellpoint_title" class="sellPointBox">
          <div class="titbox" @click="sellShow(1)">
            <div class="inner">核心卖点</div>
            <img src="static/images/icon/rightArrowGrey.png" alt="">
          </div>

          <div class="sellList">
            <div class="pointItem" @click="sellShow(1)">
              <div class="tit"><img src="static/images/icon/sellPoint1.png" alt=""><span>面料卖点</span></div>
              <!-- <div class="inner">{{htmlToStr(styleInfo.sellingPointFabric)}}</div> -->
              <div v-if="!styleInfo.sellingPointFabric || styleInfo.sellingPointFabric=='<br>'" class="inner" >暂无</div>
              <div v-else class="inner" >{{htmlToStr(styleInfo.sellingPointFabric)}}</div>
              <!-- <div class="inner" v-else v-html='styleInfo.sellingPointFabric'></div> -->

            </div>
            <div class="pointItem designPoint" @click="sellShow(2)">
              <div class="tit"><img src="static/images/icon/sellPoint2.png" alt=""><span>设计卖点</span></div>
              <!-- <div  class="inner">{{htmlToStr(styleInfo.designSellingPoint)}}</div> -->
              <div v-if="!styleInfo.designSellingPoint || styleInfo.designSellingPoint=='<br>'" class="inner" >暂无</div>
              <div v-else class="inner" >{{htmlToStr(styleInfo.designSellingPoint)}}</div>
              <!-- <div class="inner" v-else v-html='styleInfo.designSellingPoint'></div> -->

            </div>
            <div class="pointItem" @click="sellShow(3)">

              <div class="tit"><img src="static/images/icon/sellPoint3.png" alt=""><span>穿着卖点</span></div>
              <!-- <div  class="inner">{{htmlToStr(styleInfo.wearSellingPoint)}}</div> -->
              <div v-if="!styleInfo.wearSellingPoint || styleInfo.wearSellingPoint=='<br>'" class="inner" >暂无</div>
              <div v-else class="inner" >{{htmlToStr(styleInfo.wearSellingPoint)}}</div>
              <!-- <div class="inner" v-else v-html="styleInfo.wearSellingPoint"></div> -->

            </div>
          </div>
        </div>

        <!-- <div class="shopRecBox" ref="coll_title"  v-if="shopCollList.length>0">
          <div class="titbox" @click="tryColl(2)">
            <div class="inner">店铺搭配</div>
            <img src="static/images/icon/rightArrowGrey.png" alt="">
          </div>

          <Scroll
            class="shopRecScroll"
            ref="shopRecScroll"
            :listenScroll='true'
            :probeType='3'
            :scrollX='true'
            :scrollY='false'
            :autoUpdate="true"
            :pullDown="false"
            :pullUp="false">
            <div class="recList">
              <div class="item" @click.stop="toCollDetail(item.id)" v-for="(item,index) in shopCollList" :key="index">
                <img :src="item.imgUrl" alt="">
              </div>
            </div>
          </Scroll>
        </div> -->

        <div v-show="shopCollList.length>0" ref="coll_title"  class="shopRecBox">
          <div class="titbox"  @click="tryColl(2)">
            <div class="inner">店铺搭配</div>
            <img src="static/images/icon/rightArrowGrey.png" alt="">
          </div>

          <div ref="collItemScroll" class="coll-item">
            <div class="inner-list">
              <div v-for="(item,index) in shopCollList"
                :key="index"
                class="inner-item"
                @click="toShopCollDetail(item.id)">
                <img  :src="item.imgUrl" alt="">
              </div>
            </div>
          </div>

        </div>

        <div ref="coll_title" class="tryCollectBox" >
          <div class="titbox" @click="tryColl(1)">
            <div class="inner">试试这样搭</div>
            <img  src="static/images/icon/rightArrowGrey.png" alt="">
          </div>
          <div v-if="styleInfo.collList && styleInfo.collList.length>0" class="collList">
            <div v-for="(item, key) in styleInfo.collList" :key="key" class="item">
              <div class="" @click="toCollDetail(item.id)">
                <img
                  width="100%"
                  :src="item.imgUrl"
                  alt="" @load="loadedImg()">
              </div>
            </div>
          </div>
          <div v-else class="noColl">
            <div class="desc">暂无搭配</div>
          </div>
        </div>
        <loadAll></loadAll>
      </div>
    </div>

    <!-- 图片预览组件 -->
    <imgPreview
      v-if="showPreview"
      :imgList="previewList"
      :curIndex.sync="curImgIndex"
      :isShowPreview=showPreview
      @func="changePreview"
    >
      <template v-if="styleInfo.imgDetailsUrls.length > 0" slot="action">
        <div class="preview-switch">
          <span :class="{'active': active === 0}" @click.stop="previewSwitch(0)">商品图</span>
          <span :class="{'active': active === 1}" @click.stop="previewSwitch(1)">细节图</span>
        </div>
      </template>
    </imgPreview>

    <m-popup ref="basic_pop" title="商品基础信息">
      <div slot="popupTop" class="basicTop" >
        <slot>
          <span :class='baseInfoType == 1?"active":""' @click="baseInfoType=1;">基础信息</span>
          <!-- <span @click="baseInfoType=2;" :class='baseInfoType == 2?"active":""'>商品指数</span> -->
          <span v-if='sizeList&&sizeList.length>0' :class='baseInfoType == 3?"active":""' @click="baseInfoType=3;">商品尺码</span>
        </slot>
      </div>

      <div slot="popupBody">
        <slot>
          <div v-if="baseInfoType==1" class="baseone">
            <div v-if="styleInfo.styleNo"><span class="tit">款号</span><span class="inner">{{styleInfo.styleNo}}</span></div>
            <div v-if="styleInfo.seriesName"><span class="tit">系列</span><span class="inner">{{styleInfo.seriesName}}</span></div>
            <div v-if="styleInfo.bandName"><span class="tit">波段</span><span class="inner">{{styleInfo.bandName}}</span></div>
            <div v-if="styleInfo.styleLabel">
              <span  class="tit">标签</span>
              <div class="inner">
                <span v-for="(item,index) in styleInfo.styleLabel" :key="index" style="color:#1978FE">{{item}}&nbsp;</span>
              </div>
            </div>
            <div v-if="styleInfo.styleInfo"><span class="tit">场合</span><span class="inner">{{styleInfo.styleInfo}}</span></div>
            <div v-if="styleInfo.styleFabric"><span class="tit">材质</span><span class="inner">{{styleInfo.styleFabric}}</span></div>
            <div v-if="styleInfo.styleColor"><span class="tit">颜色</span><span class="inner">{{styleInfo.styleColor}}</span></div>
            <div v-if="styleInfo.styleFlowerPattern"><span class="tit">廓形</span><span class="inner">{{styleInfo.styleFlowerPattern}}</span></div>
            <div v-if="styleInfo.styleCategory"><span class="tit">类别</span><span class="inner">{{styleInfo.styleCategory}}</span></div>
            <div v-if="styleInfo.washMaintenance"><span class="tit">保养</span><span  v-html="styleInfo.washMaintenance" class="inner maintain"></span></div>
          </div>

          <!-- <div v-if="baseInfoType==2" class="baseone">
            <div>商品指数</div>
          </div> -->

          <div v-if="baseInfoType==3" class="baseone">
            <Scroll
              class="sizeBox"
              :probeType='3'
              :scrollX='true'
              :scrollY='false'
              :autoUpdate="true"
              :pullDown="false"
              :pullUp="false">
              <!-- 滚动的内容 -->
              <div class="sizeInfo">
                <el-table
                  v-if='sizeList&&sizeList.length>0'
                  style="min-width: 100%;"
                  :data="sizeList">
                  <el-table-column label="尺码" fixed="left">
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.SIZE_NAME }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column v-for="(item, index) in upTitle"
                    :key="index" :label="item.value">
                    <template slot-scope="scope">
                      <span>{{ scope.row[item.key] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-else style="color:#999;font-size:7px;text-align:center;">
                  该商品暂未设置尺码信息，敬请期待
                </div>
              </div>
            </Scroll>
          </div>


        </slot>
      </div>

    </m-popup>
    <m-popup ref="sell_pop" title="商品核心卖点">
      <!-- <div slot="popupTit">
        <div class="tit">核心卖点</div>
      </div> -->
      <div slot="popupTop" class="basicTop" >
        <slot>
          <span :class='sellPointType == 1?"active":""' @click="sellPointType=1;">面料卖点</span>
          <span :class='sellPointType == 2?"active":""' @click="sellPointType=2;">设计卖点</span>
          <span :class='sellPointType == 3?"active":""' @click="sellPointType=3;">穿着卖点</span>
        </slot>
      </div>

      <div slot="popupBody">
        <slot>
          <div class="sell-list" >
            <div v-if="sellPointType==1" class="sell-item">
              <div v-if="!styleInfo.sellingPointFabric || styleInfo.sellingPointFabric=='<br>'" class="sell-item-inner" >暂无</div>
              <div v-else v-html="styleInfo.sellingPointFabric" class="sell-item-inner"></div>
            </div>
            <div v-if="sellPointType==2" class="sell-item">
              <div v-if="!styleInfo.designSellingPoint || styleInfo.designSellingPoint=='<br>'" class="sell-item-inner" >暂无</div>
              <div v-else v-html="styleInfo.designSellingPoint" class="sell-item-inner"></div>
            </div>
            <div v-if="sellPointType==3" class="sell-item">
              <div v-if="!styleInfo.wearSellingPoint || styleInfo.wearSellingPoint=='<br>'" class="sell-item-inner" >暂无</div>
              <div v-else v-html="styleInfo.wearSellingPoint" class="sell-item-inner">暂无</div>
            </div>
          </div>
        </slot>
      </div>

    </m-popup>

    <van-popup v-model="sellPointFlag" :style="{ height: '60%' }" closeable round position="bottom">
      <div class="sellPointBody">
        <div class="sellTit">核心卖点</div>
        <Scroll
          ref="popUpScroll"
          class="sellPointScroll"
          :probeType = '3'
          :bounceTime = "0"
          :listenScroll = 'true'
          :pullDown="false"
          :pullUp="false">
          <div class="sell-list">

            <div class="sell-item">
              <div class="sell-item-tit"><img src="../../../../static/images/icon/sell-point-icon.png" alt="">面料卖点</div>
              <div v-html="styleInfo.sellingPointFabric" class="sell-item-inner"></div>
            </div>
            <div class="sell-item">
              <div class="sell-item-tit"><img src="../../../../static/images/icon/sell-point-icon.png" alt="">设计卖点</div>
              <div v-html="styleInfo.designSellingPoint" class="sell-item-inner"></div>
            </div>
            <div class="sell-item">
              <div class="sell-item-tit"><img src="../../../../static/images/icon/sell-point-icon.png" alt="">穿着卖点</div>
              <div v-html="styleInfo.wearSellingPoint" class="sell-item-inner"></div>
            </div>

          </div>
        </Scroll>

      </div>

    </van-popup>

  </div>
</template>

<script>
import util from "@/assets/js/util.js";
import Slider from '../../comps/slider/slider.vue';
import popup from "../../comps/popup/popup.vue";
import loadAll from '../../comps/common/loadAll';
import imgPreview from "../../comps/common/imgPreview";

import { Dialog } from 'vant';
import { Toast } from 'vant';
//ImagePreview和其他组件不同，不是通过HTML结构的方式来使用，而是通过函数调用的方式。使用前需要先引入它。
// import { ImagePreview } from 'vant';
export default {
  name: "goodsDetail2",
  components:{
    'mslider': Slider,
    'mPopup':popup,
    'loadAll':loadAll,
    'imgPreview':imgPreview,
  },
  data() {
    return {
      title:"商品",
      styleId:"",
      styleInfo:{},
      isLoop:true,
      gateway:1,
      hasVideo:false,
      isVideo:false,
      tempPath:"//vjs.zencdn.net/v/oceans.mp4",
      videoDefaultImg:'',
      mobileType:'android',
      videoPlayFlag:false,

      collDefaultImg:'',

      showPreview:false, // 图片预览组件标志符
      basicShowFlag:false, // 基础信息显示标志
      baseInfoType:'',  // 基础信息类型
      sellPointFlag:false,
      sellPointType:'',
      shopCollList:[],
      curImgIndex:1,

      sizeList:null,
      sizeInfo:null,
      upTitle:null,
      active: 0,
    };
  },
  computed: {
    previewList() {
      return [this.styleInfo.styleImgList, this.styleInfo.imgDetailsUrls][this.active]
    }
  },
  created(){
    let ua = navigator.userAgent.toLowerCase();
    //Android终端
    let isAndroid = ua.indexOf('android') > -1 || ua.indexOf('adr') > -1;
　　   //Ios终端
    let isiOS = !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/);
    if(isAndroid){
      this.mobileType = 'android'
    }
    if(isiOS){
      this.mobileType = 'ios'
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
    // console.log("query",this.$route.query)
    let _this = this;
    _this.styleId =parseInt(_this.$route.query.styleId) ;
  },
  activated(){
    let _this = this;
    _this.$nextTick(function(){
      if(_this.hasVideo){
        _this.isVideo = true;
        setTimeout(_this.initVideo(),300);
      }
    });

    // _this.styleId = _this.$route.query.styleId;
  },
  deactivated(){
    // console.log("----------deactivated---------")
    // 不能重复调用video作用于同一个video，否则报错: VIDEOJS: WARN: Player "myVideo" is already initialised. Options will not be applied.
    // 需调用实例的dispose()方法销毁实例后再创建实例,这里页面被缓存,所以在deactivated里执行销毁操作
    // debugger
    if(this.hasVideo) this.myPlayer.dispose();
    this.showPreview = false
  },
  updated(){
    // this.initOrLoadScrollView();
  },
  destroyed(){
    // console.log("----------destoryed---------")
    // if(this.hasVideo) this.myPlayer.dispose();
    this.showPreview = false
  },

  methods:{
    previewSwitch(active) {
      this.active = active
      this.curImgIndex = 0
    },
    changePreview(val){
      // console.log(val);
      this.showPreview = val
    },

    // vant的ImagePreview图片预览组件
    getImg(index){
      // 这里多传一个参数item,就可以获取到对应点击的图片的src
      // console.log("点击图片预览进行",index);
      this.showPreview = true;
      this.curImgIndex = index;
      // console.log(this.showPreview)
    },

    tryColl(typeId){
      if(this.hasVideo) this.myPlayer.dispose();
      this.$router.push({
        path:"/tryCollacation",
        query:{
          styleId:this.styleId,
          typeId:typeId
        }
      })
    },
    clickVideo(){

    },
    dblclickVideo(){
      var player = document.getElementById("myVideo_html5_api");
      if(player.paused){
        player.play();
      }else{
        player.pause();
      }
    },
    chooseModel(val){
      let _this = this;
      if(val==1){
        _this.isVideo = true;
        // _this.myPlayer.play();
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
      }
      // else{
      //   y = -_this.$refs.match_title.offsetTop+_this.$refs.header.offsetHeight;
      // }
      if(y<_this.pageScroll.maxScrollY){
        y=_this.pageScroll.maxScrollY;
      }
      _this.pageScroll.scrollTo(x,y,time);
    },
    sellShow(val){
      this.sellPointType = val;
      this.$refs.sell_pop.show();
    },
    basicShow(val){
      this.baseInfoType=val;
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
      // console.log("this.myPlayer===",this.myPlayer)
      if(this.hasVideo) this.myPlayer.dispose();
      this.$router.go(-1);
    },
    toCollDetail(val){
      let _this = this;
      _this.$router.push({path:"/styleDetail",query:{"collId":val,stemp:new Date().getTime()}});
    },
    // 去店铺搭配详情页面
    toShopCollDetail(id){
      // console.log("去店铺搭配详情页面");
      this.$router.push({path:'/shopCollDetail',query:{ collId:id,collStatus:3,stemp:new Date().getTime()}})
    },
    toStyle(val){
      let _this = this;
      if(this.hasVideo) this.myPlayer.dispose();
      let route = {
        path:"/goodsDetail2",
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
            dblclick:true,
            probeType:3,
            useTransition:false,
            preventDefaultException:{className:/(^|\s)bs_prevent(\s|$)/}
          });
          _this.pageScroll.on("scroll",pos=>{
            var h1 = 0;
            var h2 = _this.$refs.sellpoint_title.offsetTop-_this.$refs.header.offsetHeight;
            var h3 = _this.$refs.coll_title.offsetTop-_this.$refs.header.offsetHeight;
            // 包含搭配的头部导航判断
            // var h4 = _this.$refs.match_title.offsetTop-_this.$refs.header.offsetHeight;
            // if(Math.abs(pos.y)>=h1 && Math.abs(pos.y)<h2){
            //   _this.gateway=1;
            // }else if(Math.abs(pos.y)>=h2 && Math.abs(pos.y)<h3){
            //   _this.gateway=2;
            // }else if(Math.abs(pos.y)>=h3 && Math.abs(pos.y)<h4){
            //   _this.gateway=3;
            // }else{
            //   _this.gateway=4;
            // }
            // 不包含搭配的头部导航判断
            if(Math.abs(pos.y)>=h1 && Math.abs(pos.y)<h2){
              _this.gateway=1;
            }else if(Math.abs(pos.y)>=h2 && Math.abs(pos.y)<h3){
              _this.gateway=2;
            }else{
              _this.gateway=3;
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
        if(!_this.collItemScroll){
          _this.collItemScroll = new _this.$BScroll(_this.$refs.collItemScroll,{
            scrollX:true,
            scrollY:false,
            useTransition:false,
            // click:true
          });
        }else{
          _this.collItemScroll.refresh();
        }
        // _this.pageScroll.scrollTo(0,0,0);

      })
    },
    getStyleInfo(id){

      let _this = this;
      let param={
        id:id,
        userId:localStorage.userId
      }
      _this.$axios.post("/api/style/info",param).then(res=>{
        // console.log("商品详情页数据为",res.data)
        let data = res.data;
        if(data.code=="200"){
          data.data.styleImgList = data.data.imgUrls.split(",");
          data.data.imgDetailsUrls = data.data.imgDetailsUrls.split(",").filter(item => item)
          _this.collDefaultImg = data.data.styleImgList[0];

          if(data.data.styleLabel!=null){
            data.data.styleLabel = data.data.styleLabel.split(",");
          }

          _this.styleInfo = data.data;
          // console.log("商品详情_this.styleInfo=====",_this.styleInfo)

          _this.shopCollList = _this.styleInfo.dpCollList;
          _this.videoDefaultImg = data.data.styleVideoPatch;
          _this.hasVideo = !!_this.styleInfo.styleVideo;
          // console.log(_this.hasVideo)
          _this.isVideo = !!_this.styleInfo.styleVideo;
          _this.title = _this.styleInfo.styleNo;
          _this.isLoop = _this.styleInfo.styleImgList.length>1;
          _this.getSizeInfo(_this.styleInfo.styleCategory)
        }

        _this.$refs.slider.update();
        _this.initOrLoadScrollView();
      }).catch(function(error){
        console.log(error);
      });
    },

    initVideo() {
      let _this = this;
      let videoDom = '<video id="myVideo" class="video-js vjs-big-play-centered" poster=" '+_this.videoDefaultImg+' " controlslist="nodownload noremote noremoteplayback" style="width:10rem;height:10rem;" oncontextmenu = "return false"></video>';
      document.getElementById("video_wrapper").innerHTML=videoDom;
      // document.getElementById("myVideo").setAttribute("disablePictureInPicture","true");
      let options={
          //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          controls: true,
          //自动播放属性,muted:静音播放
          autoplay: false,
          //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          // preload: "metadata",
          preload: "auto",

          //设置视频播放器的显示宽度（以像素为单位）
          width: _this.$refs.video.scrollHeight+"px",
          //设置视频播放器的显示高度（以像素为单位）
          height:  _this.$refs.video.scrollHeight+"px",
          // poster:"styleVideoPatch",
          // children: {
          controlBar: {
            fullscreenToggle: false,
            pictureInPictureToggle:true,
            textTrackSettings:false
          },
          // },
          sources: [{
            src: _this.styleInfo.styleVideo,
            type: 'video/mp4'
          }],
          nativeControlsForTouch:true,
          reportTouchActivity:true,
      }
        //初始化视频方法
      _this.myPlayer = this.$video("myVideo",options);
      // console.log("如果有视频就初始化播放器",_this.myPlayer)
      // _this.myPlayer.play();
      // _this.$nextTick(function(){

      // });
    },
    htmlToStr(val){
      // return !val?"":val.split("<br>").join(" ");
      if(val){
        let content = val.replace(/<\/?.+?\/?>/g, '');
        return content;
      }else{
        return ''
      }
    },
    // 获取商品尺码信息
    getSizeInfo(cate){
      let _this = this;
      let params = {
        brandId: localStorage.brandId,
        catergre:cate,
        styleId:_this.styleId,
      };
      let jsonParam = this.GLOBAL.g_paramJson(params);
      _this.$axios.post("/goods/size/clothingSizeInfo", jsonParam).then(function (res) {
        if (res.data.head.status == 0) {  // 设置了尺码且有信息
          // console.log("获取商品尺码成功：",res.data.body);
          _this.sizeList = res.data.body.resultMap;
          _this.sizeInfo = res.data.body.sizeInfoVO;
          _this.upTitle = _this.sizeInfo.upTitle;

        }else if (res.data.head.status == -3)  {   // 未设置尺码且
          _this.sizeList = res.data.body.resultMap;
          _this.sizeInfo = res.data.body.sizeInfoVO;
           _this.upTitle = null;
          // _this.$toast(res.data.head.msg);
        }else{
          _this.$toast(res.data.head.msg);
        }
        // console.log('_this.sizeList',_this.sizeList,'_this.sizeInfo',_this.sizeInfo)
      }).catch(function (error) {
        console.log(error);
        // _this.$toast("接口调用失败");
      });
    }
  },

};

function callWebViewScript(){

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../../assets/pageCss/goodsDetail";

.preview-switch {
  padding-bottom: 15px;
  display: flex;
  justify-content: center;

  > span {
    padding: 5px 10px;
    border: 1px solid #232323;
    color: rgba(255, 255, 255, 0.8);
    border-radius: 2px;

    &.active {
      background: #e8e8e8;
      border-color: #e8e8e8;
      color: rgba(0, 0, 0, 0.8);
    }
  }
}

.preview-index {
  text-align: right;
  padding-right: 10px;
}

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
  background-color: #00a2ea;
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
.wrap{
  padding: 14.5px;
}
.sell-point{
  padding: 5px 14.5px 10px 29px;
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
  // padding: 0 0 0 35px;
}
.col_img_a {
  height: 100%;
  /* width: 4.4rem; */
  text-align: center;
  margin-right: 15px;
  border:1px #F6F6F6 solid;
}
.col_img_a:last-child{
  margin-right: 0px;
}

.col_img_b {
  height: 100%;
  width: 50%;
  text-align: center;
}
.coll-wrap-bg{
  background:#FFF;
}
.coll_ul{
  display: flex;
  flex-wrap: wrap;
  // border:0.5px solid red;
}
.coll_ul li{
  width: 48%;
  margin-right:4%;
  margin-bottom: 8px;
}
.coll_ul li:nth-child(even){
  margin-right:0;
}
.coll_item{
  width:100%;
  border:0.5px solid #f3f3f3;
  padding:0.5px;
  box-sizing:border-box;
}
.coll_item .name{
  margin: 14.5px 11.5px 9.5px;
  font-size: 14px;
  font-family: ArialMT;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  height:36px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //行数
  -webkit-box-orient: vertical;

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
  // border:5px solid red;
  box-sizing:border-box;
}
.maskBox{
  position: absolute;
  top:0;
  left:0;
  width:10rem;
  height:4rem;
  border:1.5px solid green;
  box-sizing:border-box;
  z-index: 100;
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


.scrollWrapper-box{
  position:relative;
  margin:0px 14.5px 0px 14.5px;
  padding:14.5px 0px 14.5px 14.5px;
  box-sizing:border-box;
  overflow: hidden;
}
.scrollWrapper{
  box-sizing:border-box;
  width: 100%;
  overflow: hidden;
}
.num-tip{
  position: absolute;
  top:0;
  left:0;
  width:25px;
  height:25px;
  line-height: 25px;
  border-radius:50%;
  text-align: center;
  color:#fff;
  background-color: #00a2ea;
}


.header{
  height:1rem;
  width: 100%;
  // background-color: pink;
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
.header_one .head_one_back{
  user-select: none;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
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
  // background-color: red;
}
.header_two .back_wrapper{
  height: 1rem;
  width: 100%;
  display: flex;
  justify-self: center;
  align-items: center;
  user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
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
  font-size:14px;
}
.header_two .gateway_wrapper li{
  // width: 25%;
  width:33.3%;
  text-align: center;
  height: 100%;
  line-height: 0.8rem;
  font-size:14px;
  user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
}
.header_two .gateway_wrapper li.selected{
  // color: #00a2ea;
  color:#1978FE;
}
.page{
  width: 100vw;
  flex: 1;
  overflow: hidden;
}

.goodDetailMain{
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
  margin-bottom:10px;
  border-top:0.5px dotted #ccc;
  border-bottom:0.5px dotted #ccc;
}
.try-tit{
  margin-bottom:0px;
}
.tit-dot{
  width: 8px;
  height: 8px;
  background: #00A2EA;
  border-radius: 50%;
  margin-right:10px;
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
  font-size: 10px;
  margin-left: 16px;
  line-height: 0.8;
}
.title_btn{
  padding:0px 10px;
  font-size: 14px;
  background-color: #00A2EA;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  font-weight: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.more-btn{
  width:15px;
  height:14px;
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
  // margin-left: 28.5px;
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
  color: #00a2ea;
  margin-right: 12.5px;
  border:0.5px solid #000;
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
  background-color: #1978FE;
  opacity: 1;
  color: #fff;

}


</style>

