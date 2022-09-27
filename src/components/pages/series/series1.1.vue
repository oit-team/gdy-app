<template>
  <div class="seriesMain" @touchmove.prevent >
    <div class='header'>
      <div class="head_back" @click="back"><img src="static/images/dev/back@2x.png" loaded @load="imgLoad"></div>
      <span class="head_span">{{seasonName}}-{{seasonLabel}}</span>
      <div></div>
    </div>

    <!-- 主题详解有时候为空需要单独做判断 -->
    <!-- <div class="hd_container" v-if="showTheme"> -->
    <div class="hd_container">
      <ul class="hd_tab_wrap" >
        <!-- <li
          v-for="(item, index) in headTabs1" :key="index" :id="item.id"
          class="hd_tab_item"
          :class="{active: item.id == selectedTabs}"
          @click="changeTab(item.id)">
          {{item.seriesName}}
        </li> -->

        <li
          v-if="showTheme"
          class="hd_tab_item"
          :class="{active:selectedTabs  == 0}"
          @click="changeTab(0)">
          <span class="tabName">主题解读</span>
        </li>
        <li
          class="hd_tab_item"
          :class="{active:selectedTabs  == 1}"
          @click="changeTab(1)">
          <span class="tabName">单款详解</span>
        </li>
        <li
          class="hd_tab_item"
          :class="{active:selectedTabs  == 2}"
          @click="changeTab(2)">
          <span class="tabName">品牌搭配</span>
        </li>
        <li
          class="hd_tab_item"
          :class="{active:selectedTabs  == 3}"
          @click="changeTab(3)">
          <span class="tabName">店铺搭配</span>
        </li>
      </ul>
    </div>


    <!-- 主题详解 -->
    <!-- ref多写了个冒号导致报错：themeScroll变量未定义，警惕 -->
    <Scroll
      v-show="selectedTabs == 0"
      ref="themeScroll"
      class="themeScroll"
      :probeType='3'
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div>
        <div class="head_img" >
          <mslider ref="slider" :loop="isLoop" :show-dot="true" :auto-play="false">
            <div v-for="(item,index) in showImgs" :key="index" class="img_wrapper">
              <img :src="item" alt="" loaded @click="getImg(index)" @load="imgLoad">
            </div>
          </mslider>
        </div>

        <div class="themeRead">
          <div class="themeName">{{series.seriesName}}</div>
          <div class="labelBox">
            <div v-for="(item,i) in labelList" :key="i" class="themeLabel">{{item}}</div>
          </div>
          <div v-html="series.seriesInterpretation" class="themeHtml"></div>
        </div>
      </div>
    </Scroll>

    <!-- 单款详解 -->
    <div v-if="selectedTabs == 1 && stylesFlag == false">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-show="selectedTabs == 1 && stylesFlag == true"
      ref="styleListScroll"
      class="styleListScroll"
      :update-data="[stylesList]"
      :refresh-data="[]"
      :probeType = '3'
      :listenScroll='true'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="styleRefresh"
      @pullingUp="styleLoadMore">
      <!-- pullUpConfig={threshold: 100,txt: { more:'上拉加载', noMore: '— jjjjjjj —'}} -->

      <!-- 滚动的内容 -->
      <ul v-if="stylesList.length>0" class="con-inner-list clear">
        <li v-for="(item,index) in stylesList" :key="index" class="inner-item fl" @click="goGoods(item.id)">
          <div class="goods-img-box">
            <img class="goods-img" :src="item.imgUrl" loaded lazy-load @load="imgLoad" />
            <div class="tipBox">
              <!-- styleFlag 1:重点款，0:非重点款 -->
              <!-- leaFlag 1:没有学习，0:有学习 -->
              <!-- videoFlag 1:没有视频，0:有视频 -->
              <!-- 内网admin2账号请求会的数据styleFlag为null -->
              <img v-if="item.styleFlag == 1" class="key-tip-img" src="../../../../static/images/icon/tip.png" alt="">
              <img v-if="item.leaFlag == 1" class="learnIcon"  src="../../../../static/images/icon/new.png" alt="">
              <img v-if="item.videoFlag == 0" class="videoIcon"  src="../../../../static/images/icon/video.png" alt="">
            </div>

          </div>
          <div class="img-name">{{item.styleNo}}</div>

          <div class="goods-stylePrice">
            <div class='money-symbel'>¥{{item.stylePrice}}</div>
          </div>
        </li>
      </ul>
      <div v-else style="padding-top:0.5px;">
        <!-- <noGood msg="暂无列表数据"></noGood> -->
        <noGood></noGood>
      </div>
    </Scroll>

    <!-- 品牌搭配 -->
    <!-- 横线滚动系列列表 -->
    <Scroll
      v-show="selectedTabs == 2 || selectedTabs == 3"
      ref="serieScrollScroll"
      class="serieScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <!-- 滚动的内容 -->
      <div class="seriesListBox">
        <div
          v-for="(item, index) in seriesList" :key="index" :id="item.id"
          class="seriesItem"
          :class="{active: item.id == seriesId }"
          @click="clickSeries(item.id)"
        >
          {{item.seriesName}}
        </div>
      </div>
    </Scroll>
    <!-- 搭配列表 -->
    <div v-if="selectedTabs == 2 && collLoadFlag == false">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-show="selectedTabs == 2 && collLoadFlag == true"
      ref="collBodyScroll"
      class="collBody"
      :update-data="[collocationList]"
      :refresh-data="[]"
      :probeType = '3'
      :listenScroll='true'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="collRefresh"
      @pullingUp="collLoadMore">
      <div v-if="collocationList.length>0" class="brandRecList">
        <div v-for="(item,index) in collocationList" :key="index" class="brandItem" >
          <vc-img raw height="4.53rem" fit="contain" width="100%" :src="item.imgUrl" alt="" loaded @click="toStyleDetail(item.id)" @load="imgLoad" />
          <div class="collName">{{item.collName}}</div>

          <div :ref="'collItemScroll'+(index+1)" class="coll-item">
            <div class="inner-list clear">
              <div v-for="(item,index) in item.styleList" :key="index" class="inner-item fl" @click="toGoodsDetail(item.id)">
                <img :src="item.imgUrl" alt="">
              </div>
            </div>
          </div>

        </div>
      </div>
      <div  v-else style="padding-top:0.5px;">
        <noGood></noGood>
      </div>
    </Scroll>


    <!-- 店铺搭配 -->
    <div v-if="selectedTabs == 3 && collLoadFlag == false">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-show="selectedTabs == 3 && collLoadFlag == true"
      ref="beautyScroll"
      class="beautyScrollBox"
      :update-data="[collocationList]"
      :refresh-data="[]"
      :probeType = '3'
      :listenScroll='true'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="shopCollRefresh"
      @pullingUp="shopCollLoadMore">
      <!-- 滚动的内容 -->
      <div v-if="collocationList.length>0" class="beautyListBox">
        <div v-for="(item,index) in collocationList" :key="index" class="beautyItem" @click="toShopCollDetail(item.id)">
          <vc-img raw height="4.53rem" fit="contain" width="100%" :src="item.imgUrl" alt="" loaded @load="imgLoad" />
          <!-- <div class="comment">颜色正尺码标准,面料柔软超级舒服,上身很合适,推荐购买哦，导购小姐姐很热心,推荐的都是适合的一整套,不用再为搭配衣服烦恼了</div> -->
          <div class="comment">{{item.collInterpretation}}</div>
          <div class="reviewerBox">
            <img v-if="item.headPortrait" class="avatar" :src="item.headPortrait" alt="">
            <img v-else class="avatar" src="static/images/default/avatarGirl.png" alt="">
            <span class="name">{{item.userName}}</span>
            <img class="praiseIcon" src="static/images/icon/praise-grey.png" alt="">
            <span class="num">{{item.aeNumber}}</span>
          </div>
        </div>
      </div>
      <!-- 请求回的店铺搭配列表为空时 -->
      <div  v-else style="padding-top:0.5px;">
        <noGood></noGood>
      </div>

      <!-- <div class="brandRecList" v-if="collocationList.length>0">
        <div class="brandItem" v-for="(item,index) in collocationList" :key="index" >
          <img :src="item.imgUrl" alt="" @click="toStyleDetail(item.id)" loaded @load="imgLoad">
          <div class="collName">{{item.collName}}</div>
          <div class="coll-item" :ref="'collItemScroll'+(index+1)">
            <div class="inner-list clear">
              <div class="inner-item fl" v-for="(item,index) in item.styleList" :key="index" @click="toGoodsDetail(item.id)">
                <img :src="item.imgUrl" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div  style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div> -->


    </Scroll>


    <!-- <brandCollList v-show="selectedTabs == 2" :collListData='collocationList'></brandCollList> -->
    <!-- <div v-show="selectedTabs == 2" class="brandCollCon">
      <brandCollList :collListData='collocationList'></brandCollList>
    </div> -->

    <!-- 图片预览组件 -->
    <imgPreview v-if="showPreview"
        :imgList = showImgs
        :curIndex="curImgIndex"
        :isShowPreview = showPreview
        @func="changePreview"></imgPreview>

  </div>
</template>
<script>
import util from "@/assets/js/util.js"
import SliderCard from '../../comps/slider/slider';
import popup from "../../comps/popup/popup.vue";
import loadAll from "../../comps/common/loadAll";
import noGood from "../../comps/common/noGoods";

import brandCollList from "../../comps/common/brandCollList";
import imgPreview from "../../comps/common/imgPreview";

import { ImagePreview } from 'vant';
export default {
  name: "series",
  components:{
    'mslider':SliderCard,
    'mPopup':popup,
    'loadAll':loadAll,
    'noGood':noGood,
    'imgPreview':imgPreview,
    'brandCollList':brandCollList
  },
  data() {
    return {
      seasonLabel: "",
      seasonName:'',
      selected: 0,
      showImgs: [],
      headTabs:[],
      series:{
        seriesName:"",
        id:"",
        seriesLabel:"",
        seriesInterpretation:""
      },
      swiperOption:{
        loop:true
      },
      isLoop:true,
      isShow:false,
      picCount:0,

      // =================================
      showTheme:true,
      seriesName1:'',
      selectedTabs:0,
      headTabs1:[
        {
          id:0,
          seriesName:"主题解读"
        },
        {
          id:1,
          seriesName:"单款详解"
        },
        {
          id:2,
          seriesName:"品牌搭配"
        },
        {
          id:3,
          seriesName:"店铺搭配"
        }
      ],

      showPreview:false, // 图片预览组件标志符

      bandId:null,
      styleSeriesId:null,   // 单款详解请求传递的sId
      currentPage:1,
      pageSize:15,
      stylesList:[],    // 单款详解分页数据列表
      stylesFlag:false,
      isLoaded:true,   // 当前页数据是否加载完毕
      isOver:false,    // 全部数据是否加载完毕

      labelList:null,

      styleTotal:null,

      collLoadFlag:false,
      collList:[],   // 品牌搭配列表
      collocationList:[],
      seasonId:null,
      seriesList:[],   // 系列列表
      seriesId:null,   // 被选中的系列id
      collTotal:null,
      collPageSize:6,
      collPageNum:1,

      type:1,   // 1：品牌搭配   2：店铺搭配

      curImgIndex:1,

    };
  },
  created(){
    // let seriesId = this.$router.query.seriesId
    // this.getSeriesInfo();
    console.log("this.$router.query",this.$route.query);
    this.seasonId = this.$route.query.seasonId;
    // this.seriesId = this.$route.query.seriesId;
  },
  activated(){
    // 为了解决灰色背景框的问题的一种方案,不起作用
    // this.$forceUpdate()
  },

  watch:{
    $route(to,from){
      // console.log(">>>>>>>>>",to,from);
      // 如果从详情页回来表示已经学习过该商品,因为组件整个被keepAlive了,无法重新请求,所以监听路由遍历数据将其状态置为0
      if(from.path == "/goodsDetail2"){
        // console.log(from.query)
        // console.log(from.query.styleId)
        for(var i=0;i<this.stylesList.length;i++){
          if(this.stylesList[i].id == from.query.styleId){
            this.stylesList[i].leaFlag = '0';
          }
        }
      }
    },
    selected:function(newV,oldV){
      let _this = this;
      util.loading();
      // console.log(newV,oldV)
      _this.$refs.slider.destroy();
      // _this.getSeriesInfo(newV);
    },
    picCount:function(newV){
      // console.log("加载"+newV);
      // console.log("总共"+document.querySelectorAll("img[loaded]").length);
      if(document.querySelectorAll("img[loaded]").length<=(newV+2)){
        // this.initOrReloadScrollView();
        this.$refs.styleListScroll.refresh();
      }
    }
  },
  mounted() {
    // console.log(this.$route.query)

    this.bandId = parseInt(this.$route.query.bandId);
    this.seriesId = parseInt(this.$route.query.seriesId);
    this.styleSeriesId = this.seriesId;
    this.seasonName = this.$route.query.seasonName;
    this.seasonLabel = this.$route.query.bandName;
    this.getSeries(this.bandId,this.seriesId);
    this.getSeriesInfo(this.seriesId);
    this.getStylesList();  // 获取单款详解列表
    this.getSeriesList();  // 获取系列列表
  },
  methods: {
    back(){
      localStorage.removeItem('seriesSel');
      this.$router.go(-1);
    },
    // 去品牌搭配详情
    toStyleDetail(val){
      let _this = this;
      _this.$router.push({path:"/styleDetail",query:{"collId":val,stemp:new Date().getTime()}});
    },
    // 去店铺搭配详情页面
    toShopCollDetail(id){
      console.log("去店铺搭配详情页面");
      this.$router.push({path:'/shopCollDetail',query:{ collId:id,collStatus:3,stemp:new Date().getTime()}})
    },
    // 去商品详情
    toGoodsDetail(val){
      this.$router.push({path:"/goodsDetail2",query:{"styleId":val,stemp:new Date().getTime()}});
    },
    // 图片预览
    changePreview(val){
      this.showPreview = val
    },
    getImg(index){
      this.showPreview = true;
      this.curImgIndex = index;
    },
    // 图片++
    imgLoad(){
      this.picCount++;
    },
    // 点击改变头部导航
    changeTab(val){
      // console.log(val)
      if(this.selectedTabs!=val){
        // console.log(this.selectedTabs,val)
        this.selectedTabs=val;
        //  console.log(this.selectedTabs)
        // this.initOrReloadScrollView();
        // if(val == 1){
        //   this.getStylesList();
        // }
        if(val == 2){
          this.type = 1;
          this.collPageNum = 1;
          this.collocationList = [];
          this.collLoadFlag = false;
          this.getCollocationList();
          // this.getSeriesList();
          // this.$nextTick(()=>{
          //   let el = document.querySelector(".seriesListBox .active");
          //   console.log(this.$refs.serieScrollScroll,'============',el)
          //   this.$refs.serieScrollScroll.scrollToElement(el,500)
          // })
          setTimeout(()=>{
            let el = document.querySelector(".seriesListBox .active");
            // console.log(this.$refs.serieScrollScroll,'============',el)
            this.$refs.serieScrollScroll.scrollToElement(el,500)
          },200)
        }
        if(val == 3){
          this.type = 2;
          // this.seriesId = -1;
          this.collPageNum = 1;
          this.collocationList = [];
          this.collLoadFlag = false;
          this.getCollocationList();
          this.$refs.beautyScroll.scrollToTop()
        }
      }
    },
    // 根据品牌ID与波段季节ID获取系列列表
    getSeriesList(){
      let _this = this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,  // 品牌id
        "seasonId":_this.seasonId,    //波段id
      }
      console.log(params)
      _this.$axios.post("/api/series/sList",params).then(function(res){
        let data = res.data;
        if(data.code=="200"){
          _this.seriesList = data.data;
           console.log("获取系列筛选项列表数据为",_this.seriesList)
          // _this.seriesSelected = _this.seriesSelected?_this.seriesSelected:_this.seriesList[0].id;
        }
      }).catch(function(error){
        console.log(error);
      });
    },
    // 点击搭配'系列'导航按钮
    clickSeries(id){
      this.seriesId = id;
      this.collPageNum = 1;
      this.$refs.collBodyScroll.scrollToTop();
      this.collocationList = [];
      this.collLoadFlag = false;
      this.getCollocationList();
    },
    // 获取品牌搭配列表
    getCollocationList(){
      let _this=this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "seasonId": _this.seasonId,           // 波段 （季节）
        "seriesId":_this.seriesId,
        "sId": -1,   // 风格 -1 全部
        "modeId":-1,    //品类  -1 全部
        "styleName": "",
        "currentPage": _this.collPageNum,
        "pageSize": _this.collPageSize,
        "type":_this.type,
        "status":3,   // 已发布


  //       "brandId": "1",
  //       "sId": -1,
  //       "modeId": -1,
  //       "seasonId": 456,
  //       "seriesId": _this.seriesId,
  //       "styleName": "",
  //       "currentPage": 1,
  //       "type":"2",
  //       "pageSize": 6,
  //       "status":3

      }
      console.log("品牌搭配列表参数",params)
      _this.$axios.post("/api/coll/collList",params).then(function (res){
        // console.log("请求搭配列表")
        let data = res.data;
        if(data.code=="200"){
          _this.collLoadFlag = true;
          console.log("筛选出的搭配列表为",data.data)
          _this.collTotal = data.data.total;
          if(_this.collPageNum == 1){
            _this.collocationList = data.data.list;
          }else{
            _this.collocationList = _this.collocationList.concat(data.data.list);
          }
          // if(_this.collocationList.length < _this.collTotal){
          //   _this.$refs.collBodyScroll.refresh()
          // }
          // console.log("筛选出的搭配列表_this.collocationList为===",_this.collocationList)
          // // 把这个判断去掉，不满一页的下拉刷新效果也好了
          if(_this.collocationList.length == _this.collTotal){
            if(_this.type == 1){
              _this.$refs.collBodyScroll.update(true)
            }else{
              _this.$refs.beautyScroll.update(true)
            }
          }
          // _this.collLoadMore()
          _this.initOrReloadScrollView();
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    // 搭配的上拉下拉
    collRefresh(){
      this.type = 1;
      this.collPageNum = 1;
      this.getCollocationList();
    },
    collLoadMore(){
      if(this.collocationList.length < this.collTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.collPageNum++;
        this.getCollocationList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.collBodyScroll.update(true)
      }
    },
    // 店铺推荐上下拉加载
    shopCollRefresh(){
      this.type = 2;
      this.collPageNum = 1;
      // this.$refs.beautyScroll.update(true);
      this.getCollocationList();
    },
    shopCollLoadMore(){
      // this.$refs.beautyScroll.update(true);
      if(this.collocationList.length < this.collTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.collPageNum++;
        this.getCollocationList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.beautyScroll.update(true)
      }
    },
    // 获取单款详解列表
    getStylesList(){
      let _this =  this;
      let brandId = localStorage.brandId;
      let userId = localStorage.userId;
      let params = {
        "brandId":brandId,
        "bandId":this.bandId,   // 没数据
        // "sid":this.seriesId,    //  传递这个参数的话，搭配列表点击不同的系列，会请求为空
        "sid":this.styleSeriesId,  // 就取第一次获取到的seriesId临时存储在styleSeriesId并传参赋值
        // "categoryName":"",
        "userId":userId,
        "currentPage":this.currentPage,
        "pageSize":this.pageSize,
      }
      // console.log(params)

      _this.$axios.post("/api/series/getStyleList",params).then(function (res){
        let data = res.data;
        _this.stylesFlag = true;
        if(data.code=="200"){
          console.log("单款详解获取的数据为,",data,data.list);
          // _this.stylesList = [];
          // _this.styleTotal = 0;

          _this.styleTotal = data.data.total;
          if(_this.currentPage == 1){
            _this.stylesList = data.data.list;
          }else{
            _this.stylesList = _this.stylesList.concat(data.data.list);
          }
          // _this.styleLoadMore();
          // _this.$refs.styleListScroll.refresh()
          // if(_this.stylesList.length < _this.styleTotal){
          //   _this.$refs.styleListScroll.refresh()
          // }

          if(_this.stylesList.length == _this.styleTotal){
            _this.$refs.styleListScroll.update(true)
          }
          // console.log("单款详解列表数据为===",_this.stylesList)

        }else{
          _this.$toast(data.data)
        }
      })
      .catch(function (error) {
        _this.$toast(error)
        // console.log(error);
      });
    },
    // 单款详解上拉下拉
    styleRefresh(){
      this.currentPage = 1,
      this.getStylesList();
    },
    styleLoadMore(){
      if(this.stylesList.length < this.styleTotal){
        // console.log(this.stylesList.length , this.styleTotal)
        this.currentPage++;
        this.getStylesList();
      }else{
        // console.log(this.stylesList.length , this.styleTotal)
        this.$refs.styleListScroll.update(true)
      }
    },


    initOrReloadScrollView(call){
      let _this = this;
      _this.$nextTick(()=>{
        // 动态生成不确定搭配列表的滚动
        for(var i =1;i<=_this.collocationList.length;i++){
          var str = "collItemScroll"+i;
          // console.log(_this.$refs[str]);
          if(!_this[str]){
            _this[str] = new _this.$BScroll(_this.$refs[str][0],{
              scrollX:true,
              scrollY:false,
              useTransition:false,
            });
            // console.log(_this[str]);
          }else{
            _this[str].refresh();
          }
        }
      })
    },


    getSeries(bandId,seriesId){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "bandId":bandId
      }

      _this.$axios.post("/api/series/list",params).then(function (res){
        let data = res.data;
        if(data.code=="200"){
          _this.headTabs=data.data;
          // console.log("_this.headTabs为",data)
        }
        // console.log("系列id为",localStorage.seriesSel,seriesId)
        _this.selected = localStorage.seriesSel==null?seriesId:localStorage.seriesSel;
        // _this.initOrReloadScrollView(function(){
        //   _this.headTabScroll.scrollToElement(document.getElementById(_this.selected),0,false,false);
        // });
      }).catch(function (error) {
          console.log(error);
      });
    },
    // 获取主题详解内容
    getSeriesInfo(seriesId){
      // console.log(seriesId)
      let _this = this;
      _this.$axios.get("/api/series/"+seriesId).then(function (res){
        let data = res.data;
        if(data.code=="200"){
          _this.series = data.data;
          console.log("seriesId为",seriesId,"对应的主题详解内容body为",_this.series)
          if(data.data.imgUrl){
            _this.showTheme = true;
            _this.selectedTabs = 0;
            if(data.data.seriesLabel){
              _this.labelList = data.data.seriesLabel.split(",");
            }
            _this.showImgs = data.data.imgUrl.split(",");
            // console.log("点击不同的系列拿到的showImgs为",_this.showImgs)
            if(_this.showImgs.length==1){
              _this.isLoop=false;
            }
          }else{
            _this.showTheme = false;
            _this.selectedTabs = 1;
          }

        }
        _this.$refs.slider.update();
        // _this.initOrReloadScrollView();
      }).catch(function(error){
        console.log(error);
      });
    },
    // 将图片转换为缩略图
    ResetImageUrlS(dataList,addChar) {
      // console.log("124234234")
      var nCount=dataList.length;
      for (var i = 0; i < nCount;i++ ) {
        var dlItem = dataList[i];
        var srcImgUrl = dlItem.imgUrl;//  "http://res.oitor.com:8099/upload/2020/03/1231321421312.png";
        var index = srcImgUrl.lastIndexOf('.');
        var tmpUrl = srcImgUrl.substr(0, index);
        var tmpExt = srcImgUrl.substr(index, srcImgUrl.length - index);
        dlItem.imgUrl = tmpUrl + addChar + tmpExt;
      }
    },

    goGoods(val){
      let _this = this;
      localStorage.seriesSel = _this.selected;
      _this.$router.push({path:"/goodsDetail2",query:{styleId:val}});
    }
  }


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/series1.1";
.head_back,.head_span,.hd_tab_wrap li{
  user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
  font-size: 16px;
  color:#333;
}
.head_span{
  font-weight: 500;
}


</style>
