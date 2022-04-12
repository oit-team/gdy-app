<template>
  <div id="myCircle">
    <div class="headBox">
      <Header :title="'工作圈'"></Header>
    </div>

    <!-- <div class="module-box" ref = "moduleList">
      <ul class="module-ul" >
        <li
          class="module-item"
          :class="[item.dOrderby == activeId ?'active':'']"
          v-for="(item,Mindex) in circleClassify"
          :key="Mindex"
          @click="clickTest(item.dOrderby,item.type)"
        >
          {{item.displayName}}
        </li>
      </ul>
    </div> -->

    <Scroll
      class="module-box"
      ref="moduleScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <!-- 滚动的内容 -->
      <div class="module-ul">
        <div
          class="module-item"
          :class="[item.dOrderby == activeId ?'active':'']"
          v-for="(item,Mindex) in circleClassify"
          :key="Mindex"
          @click="clickTest(item.dOrderby,item.type)">
          {{item.displayName}}
        </div>
      </div>
    </Scroll>

    <div class="select-list clear">
      <div class="item fl select-condit" @click="timeClickCondition" :class="[curCondition == 1 ? 'active':'']">
        <div>时间</div>
        <div class="img-box">
          <div class="img-inner-box">
            <img src="../../../../static/images/icon/arr-top.png" alt="" v-if="curCondition == 1 && timeChooseFlag">
            <img src="../../../../static/images/icon/arr-top-grey.png" alt="" v-else>
          </div>
          <div class="img-inner-box">
            <img src="../../../../static/images/icon/arr-bottom.png" alt="" v-if="curCondition == 1 && !timeChooseFlag">
            <img src="../../../../static/images/icon/arr-bottom-grey.png" alt="" v-else>
          </div>
        </div>
      </div>
      <div class="item fl select-condit" @click="scanClickCondition" :class="[curCondition == 2 ? 'active':'']">
        <div>浏览量</div>
        <div class="img-box">
          <div class="img-inner-box">
            <img src="../../../../static/images/icon/arr-top.png" alt="" v-if="curCondition == 2 && scanChooseFlag">
            <img src="../../../../static/images/icon/arr-top-grey.png" alt="" v-else>
          </div>
          <div class="img-inner-box">
            <img src="../../../../static/images/icon/arr-bottom.png" alt="" v-if="curCondition == 2 && !scanChooseFlag">
            <img src="../../../../static/images/icon/arr-bottom-grey.png" alt="" v-else>
          </div>
        </div>
      </div>
      <div class="item fl select-condit" @click="praiseClickCondition" :class="[curCondition == 3 ? 'active':'']">
        <div>点赞量</div>
        <div class="img-box">
          <div class="img-inner-box">
            <img src="../../../../static/images/icon/arr-top.png" alt="" v-if="curCondition == 3 && praiseFlag">
            <img src="../../../../static/images/icon/arr-top-grey.png" alt="" v-else>
          </div>
          <div class="img-inner-box">
            <img src="../../../../static/images/icon/arr-bottom.png" alt="" v-if="curCondition == 3 && !praiseFlag">
            <img src="../../../../static/images/icon/arr-bottom-grey.png" alt="" v-else>
          </div>
        </div>
      </div>
    </div>

    <div class="coll-loading-box" v-if="newsLoading == true">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-else
      :update-data="[newsList]"
      :refresh-data="[]"
      class="circleCon"
      ref="circleScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="circleRefresh"
      @pullingUp="circleLoadMore">
      <div v-if="newsList.length > 0">
        <div class="item" v-for="item in newsList" :key="item.id" @click="toNewsDetail(item.id,item.collection,item.praise,item.browse,item.browseNum)">
          <div class="icon-box">
            <img v-if="item.browse" src="../../../../static/images/icon/read-no.png" alt="">
            <img v-else src="../../../../static/images/icon/readed.png" alt="">
          </div>
          <div class="new-brief">
            <div class="title" :class="item.browse?'active-tit':''">{{item.nTitle}}</div>
            <div class="other">
              <span class="module">[{{item.underModule}}]</span>
              <span class="time">{{item.updateTime}}</span>
              <span class="scan-count">浏览量：{{item.browseNum}}</span>
              <span class="giveUp" >
                <img src="../../../../static/images/icon/praise-grey.png" alt="">
                <span>{{item.likeNum}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="noData" v-else>
        <noGood></noGood>
      </div>
    </Scroll>

  </div>
</template>

<script>
import Header from '../../comps/header/header';
import loadAll from '../../comps/common/loadAll';
import util from "@/assets/js/util.js";
import { Toast } from 'mint-ui';
import noGood from "../../comps/common/noGoods";

export default {
  name:"myCircle",
  components:{ Header , loadAll ,noGood },
  data(){
    return {
      curCondition:1,
      timeChooseFlag:false,
      scanChooseFlag:'',
      colChooseFlag:'',
      selectCondition:1,
      praiseFlag:'',

      page:1,
      pageSize:12,

      pageSum:0,
      newsSum:0,
      newsLoaded:false,
      dropDown:false,
      newsLoading:true,
      newsList:[],

      activeId:100,
      moduleType:"全部",
      circleClassify:[]
    }
  },
  methods:{
    clickClassifyTit(id,type){
      this.activeId = id;
      this.moduleType = type;
    },
    ininListScroll(){
      let _this = this;
      // 模块scroll
      _this.$nextTick(()=>{
        if(!_this.moduleListscroll){
          _this.moduleListscroll = new _this.$BScroll(_this.$refs.moduleList,{
            scrollX:true,
            scrollY:false,
            click:true,
            bounce:false,
            useTransition:false,
          });
        }else{
          _this.moduleListscroll.refresh();
        }
      })
    },
    clickTest(id,type){
      this.moduleType = type;
      // console.log(this.$refs.moduleScroll)  // 大小写一定要注意,不能错喽!!!!
      if(this.activeId != id){
        if(this.activeId > id){
          this.$refs.moduleScroll.scrollToElement(event.currentTarget,500);
        }else{
          if(!!event.currentTarget.previousElementSibling){
            this.$refs.moduleScroll.scrollToElement(event.currentTarget.previousElementSibling,500);
          }else{
            this.$refs.moduleScroll.scrollToElement(event.currentTarget,500);
          }
        }
        this.newsLoading = true;
        this.newsList = [];
        this.activeId = id;
      }
      this.initNewsList()
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
      if(browser == 0){
        browseNum ++;
        localStorage.browseNum = browseNum;
      }else{
        localStorage.browseNum = browseNum;
      }
    },
    back(){
      this.$router.go(-1);
    },
    timeClickCondition(){
      this.curCondition = 1;
      this.timeChooseFlag = !this.timeChooseFlag;
      if(this.timeChooseFlag){
        this.selectCondition = 2   // 时间递增/倒序
      }else{
        this.selectCondition = 1  // 时间递减/正序
      }
      this.newsLoading = true;
      this.page = 1;
      this.newsList = [];
      this.initNewsList();

    },
    scanClickCondition(){
      this.curCondition = 2;
      this.scanChooseFlag = !this.scanChooseFlag;
      if(this.scanChooseFlag){
        this.selectCondition = 6;    // 浏览量递增
      }else{
        this.selectCondition = 5;    // 浏览量递减
      }
      this.newsLoading = true;
      this.page = 1;
      this.newsList = [];
      this.initNewsList();
    },
    praiseClickCondition(){
      this.curCondition = 3;
      this.praiseFlag = !this.praiseFlag;
      if(this.praiseFlag){
        this.selectCondition = 4;
      }else{
        this.selectCondition = 3;
      }
      this.newsLoading = true;
      this.page = 1;
      this.newsList = [];
      this.initNewsList();
    },
    initNewsList(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      if(_this.moduleType == "全部"){
        _this.moduleType = '';
      }
      let data = {
        "userId": userid,
        "page":_this.page,
        "pageSize":_this.pageSize,
        "sortState":_this.selectCondition,   // 排序类型
        "underModule":_this.moduleType,   // 新增字段,模块
      }
      _this.$axios.post("/api/noticeInfo/selNoticeList",data)
      .then(function (res){
          _this.newsLoading = false;
          let data = res.data;
          // console.log("返回的数据",data)
          if(data.code=="200"){
            _this.pageSum = data.data.pages;
            _this.newsSum = data.data.total;
            if(_this.page == 1){
              _this.newsList = data.data.list
            }else{
              _this.newsList = _this.newsList.concat(data.data.list);
            }

          }else{
            Toast("请求失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
        Toast("请求失败！");
      });
    },
    circleRefresh(){
      this.page = 1;
      this.initNewsList();
    },
    circleLoadMore(){
      if(this.newsList.length < this.newsSum){
        // console.log(this.collocationList.length , this.collTotal)
        this.page++;
        this.initNewsList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.circleScroll.update(true)
      }
    },
    // 获取我的工作圈模块
    getModuleList(){
      let _this = this;
      let data = {
        brandId:localStorage.brandId
      }
      _this.$axios.post("/api/noticeInfo/selModuleList",data)
      .then(function (res){
          let data = res.data;
          // console.log("获取模块列表接口返回的数据",data)
          if(data.code=="200"){
            _this.circleClassify = data.data;
            let jsonObj = {
              key: "全部",
              displayName: "全部",
              dOrderby: '100',
              type: "全部"
            };
            _this.circleClassify.unshift(jsonObj);
            // _this.circleClassify.pop();    // 看'其他'模块是否要显示,不显示就把此行代码放开

          }else{
            Toast("请求失败！");
          }
      })
      .catch(function (error) {
        console.log(error);
        Toast("请求失败！");
      });
    }
  },
  // 当引入keep-alive 的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated
  // 退出时触发deactivated。当再次进入（前进或者后退）时，只触发activated
  created(){},
  mounted(){

  },
  activated(){
    this.getModuleList();

    if(localStorage.keepCircleFlag == "false"){
      this.page = 1;
      this.selectCondition = 1;
      this.newsList = [];
      this.curCondition = 1;
      this.timeChooseFlag = false;
      this.initNewsList();
    }else if(localStorage.keepCircleFlag == "true"){
      // console.log("localStorage.keepCircleFlag == 'true'","不重新加载")
    }
  },
  updated(){
    // this.ininListScroll();
  },
  watch:{
    $route(to,from){
      if(from.path == "/newsDetail"){
        for(var i=0;i<this.newsList.length;i++){
          if(this.newsList[i].id == from.query.id){
            this.newsList[i].browse = true;
            this.newsList[i].likeNum = localStorage.likeNum;
            this.newsList[i].browseNum = localStorage.browseNum;
            this.newsList[i].praise = localStorage.isPraise;
            this.newsList[i].collection = localStorage.collection;
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/myCircle";

</style>
