<template>
  <VueActions class="homeMain" data="homeIndex" @touchmove.prevent>
    <div class="homeHead">
      <div class="top">
        <span class="logoImg">
          <!-- 高单易 -->
          <img src="static/images/searchIndex/indexLogo.png" alt="">
        </span>
        <img class="scanIcon" @click="toScan" src="static/images/searchIndex/scan.png" alt="">
        <div class="newsIconBox">
          <img class="newsIcon" @click="toNews" src="static/images/searchIndex/news.png" alt="">
          <!-- <span class='noReadTip' v-if="noReadMsgNum>0"></span> -->
          <span class='noReadTip' v-if="noReadMsgNum>0 && noReadMsgNum<99">{{noReadMsgNum}}</span>
          <span class='noReadTip' v-if="noReadMsgNum>99">...</span>
        </div>
      </div>
      <div class="SearchBox">
        <!-- 直接搜索，跳转到搜索结果页面 -->
        <!-- <form @submit.prevent action="javascript:return true">
          <input class="" ref="search" @keyup.13="toStylesInfo()"  v-model="searchInput" placeholder="商品款号/名称" type="search">
        </form> -->

        <!-- 聚焦时跳转到搜索的首页面 -->
        <!-- <form @submit.prevent action="javascript:return true">
          <input class="" ref="search" @click="toSearch" placeholder="商品款号/名称" type="search">
        </form> -->

        <div class="searchIpt" @click="toSearch">商品款号/名称/面料</div>

      </div>
    </div>
    <div style="width:100%;height:4px;background-color: #f5f5f5;"></div>
    <Scroll
      class="homeConBox"
      ref="addCollScroll"
      :probeType = '3'
      :bounce='false'
      :listenScroll='true'
      :pullDown="false"
      :pullUp="false">
      <div>
        <!-- 考核任务模块 -->
        <!-- <div class="examTaskBox">
          <div class="taskList">
            <div>【考核任务】：本周内完成N9系列自测考核</div>
            <div>【考核任务】：本周内完成N9系列自测考核</div>
          </div>
          <div class="icon">
            <img src="static/images/icon/right@2x.png" alt="">
          </div>
        </div> -->
        <!-- 新增商品模块 -->
        <div class="addGoodsBox">
          <div class="titBox">
            <span class="secTit">新增系列</span>
            <!-- <span class="thirdTit">9月6号</span> -->
            <!-- <img class="icon" src="static/images/icon/rightArrowGrey.png" alt=""> -->
          </div>
          <div class="list">
            <div class="item"  v-for="(item,index) in curSeriesList" :key="index" @click="toSeries(item)" v-actions:addItem.click>
              <!-- {{item.seriesName}}({{item.count}}) -->
              <span class="name">{{item.seriesName}}</span> <span class="count">({{item.count}})</span>
            </div>
          </div>
        </div>

        <!-- 我的工作圈 -->
        <div class="workCircle">
          <div class="titBox" @click="toMyCircle">
            <span class="secTit">我的工作圈</span>
            <img class="icon" src="static/images/icon/rightArrowGrey.png" alt="">
          </div>
          <div class="list" v-if="circleList.length>0">
            <div class="item" v-for="(item,index) in circleList" :key="index" @click="toNewsDetail(item.id,item.collection,item.praise,item.browse,item.browseNum)" v-actions:toMyCircle.click>
              <!-- <div class="icon-box">
                <img v-if="!item.browse" src="../../../../static/images/icon/read-no.png" alt="">
                <img v-if="item.browse" src="../../../../static/images/icon/readed.png" alt="">
              </div> -->
              <div class="circleCon">
                <div class="tit"> <span class="typeName">[{{item.underModule}}]&nbsp;&nbsp;{{item.nTitle}}</span></div>
                <div class="count">
                  <span class="time">{{item.updateTime}}</span>
                  <span class="browserBox">浏览：{{item.browseNum}}</span>
                  <span class="praiseBox"><img src="static/images/icon/praise-grey.png" alt="">{{item.likeNum}}</span>
                </div>
              </div>
              <div v-if="item.browse" class="tip">已读</div>
              <div v-else class="tip">未读</div>

            </div>
          </div>
          <div v-else class="noData">
            没有更多的工作圈发布
          </div>
        </div>
      </div>
    </Scroll>
    <div style="width:100%;height:4px;background-color: #f5f5f5;"></div>

  </VueActions>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
  name: "searchIndex",
  data() {
    return {
      searchInput:"",
      circleList:[],
      curSeriesList:[],
      noReadMsgNum:null,
    };
  },
  components:{},
  created(){
    // console.log("-------created--------");
    this.getCurSeries();
    this.getCircleList();
    this.getNoReadNum();
  },
  mounted(){
    // console.log("-------mounted--------");
    window.callJsFunction = this.scanToSearch;
  },
  activated(){
    // console.log("-------activated--------");
    this.getCurSeries();
    this.getCircleList();
    this.getNoReadNum();
  },
  methods:{
    toSearch(){
      this.$router.push({
        path:"/search",
        query:{
          stamp:new Date().getTime()
        }
      });
    },
    toStylesInfo(){
      let _this = this;
      var search  = _this.searchInput;
      if(search==null || search==""){
        Toast("请输入货号");
        return;
      }
      _this.$refs.search.blur();
      setTimeout(function(){
        let route = {
          path:"/searchResult",
          query:{
            value:search,
            stamp:new Date().getTime()
          }
        }
        _this.searchInput="";
        _this.$router.push(route);
      },350);
    },
    toScan(){
      // console.log(localStorage.osType)
      if(localStorage.osType=="IOS"){
        // console.log("ios");
        window.webkit.messageHandlers.JsCallObjectC.postMessage('{"methodName":"ScanCode"}');
      }else if(localStorage.osType=="ANDROID"){
        // console.log("android");
        window.JsCallObjectC.postMessage('{"methodName":"scanCode"}')
      }
    },
    toSeries(item){
      this.$router.push({
        path:"/series",
        query:{
          "bandId":item.bandId,
          "seriesId":item.id,
          'categoryName':item.seriesName,
          "bandName":item.bandName,
          "seasonId":item.seasonId,
          "seasonName":item.seasonName,
          stamp:new Date().getTime()
        }
      });
    },
    // 获取未读消息数量
    getNoReadNum(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "brandId":localStorage.brandId,  // 品牌id
        "userId":userid
      }
      // console.log(data)
      _this.$axios.post("/api/msg/getUnreadMsgNum",data).then(function (res){
        let data = res.data;
        console.log("获取未读消息数量===",data)
        if(data.code=="200"){
          _this.noReadMsgNum = data.data.count;

        }else{
          Toast("请求失败！");
        }
      }).catch(function (error) {
        console.log(error);
        Toast("请求失败！");
      });
    },

    toNews(){
      this.$router.push({
        path:"newsPage",
        query:{
          stamp:new Date().getTime()
        }
      })
    },
    scanToSearch(val){
      let _this = this;
      setTimeout(function(){
        let route = {
          path:"/searchResult",
          query:{
            value:val,
            stamp:new Date().getTime()
          }
        }
        _this.$router.push(route);
      },350);
    },
    // 获取最新的系列以及下属商品数
    getCurSeries(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "brandId":localStorage.brandId,  // 品牌id
        "newSeriesCount":4,  // 获取最新的系列前几条
      }
      // console.log(data)
      _this.$axios.post("/api/series/getNewSeries",data).then(function (res){
        let data = res.data;
        console.log("获取最新的系列以及下属商品数===",data)
        if(data.code=="200"){
          _this.curSeriesList = data.data;

        }else{
          Toast("请求失败！");
        }
      }).catch(function (error) {
        console.log(error);
        Toast("请求失败！");
      });
    },
    // 获取首页工作圈列表，限制只展示5条
    getCircleList(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "page":1,
        "pageSize":6,
        "sortState":1,   // 时间倒序排列
        "underModule":'',   // 新增字段,模块
        // "underModule":'培训',  // 测试没有数据的情况
      }
      // console.log(data)
      _this.$axios.post("/api/noticeInfo/selNoticeList",data).then(function (res){
        let data = res.data;
        console.log("返回的数据",data)
        if(data.code=="200"){
          if(data.data.list){
            _this.circleList = data.data.list;
          }
        }else{
          Toast("请求失败！");
        }
      }).catch(function (error) {
        console.log(error);
        Toast("请求失败！");
      });
    },
    toMyCircle(){
      this.$router.push({
        path:"/myCircle",
        query:{
          stamp:new Date().getTime()
        }
      });
    },
    toNewsDetail(id,collection,praise,browser,browseNum){
      this.$router.push({
        path:"/newsDetail",
        query:{
          id:id,
          collection:collection,
          praise:praise,
          isBrowser:browser
        }
      })
      // console.log(browseNum)
      if(browser == 0){
        browseNum ++;
        localStorage.browseNum = browseNum;
        // console.log("=====未浏览过,浏览量+1========",localStorage.browseNum)
      }else{
        localStorage.browseNum = browseNum;
        // console.log("=====浏览过,浏览量为========",localStorage.browseNum)
      }
      // console.log(localStorage.browseNum)
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../.../../../assets/pageCss/searchIndex";

</style>
