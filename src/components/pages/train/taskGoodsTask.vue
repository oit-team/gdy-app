<template>
  <div id="taskGoodsTask">
    <!-- 头部 -->
    <div class="headBox" style="height: 1.4rem;">
      <backHeader title="商品自测">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>
    <!-- 条件搜索 -->
    <Scroll
      class="goods-box"
      ref="goodsScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <div class="goods-ul">
        <div
          class="goods-item"
          v-for="(item, index) in headTabs"
          :key="index"
          :id="item.id"
          :class="{active: item.id == selected}"
          @click="set_tab_index(item.id,index)">
          {{item.fitOccasionName}}
        </div>
      </div>
    </Scroll>
    <!-- 测一测列表 -->
    <div v-if="testLoadingFlag == true">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-else
      class="goodsBody"
      ref="goodsBodyScroll"
      :probeType = '3'
      :bounceTime = "0"
      :listenScroll = 'true'
      :pullDown="false"
      :pullUp="false"
    >
      <div class="scrollCon" v-if='bigList&&bigList.length>0'>
        <div class="scrollTestItem"  v-for="(series,index) in bigList" :key="index">
          <div class="goodsListTop">
            <div class="odiv"></div>
            <div class="seriesName">{{series.bandName}}</div>
          </div>
          <div class="goodsListBom">
            <div class="liTop">
              <div class="tesk">
                <span class="teskNums">测试次数:</span><span class="Num">{{series.obj.testCount}} 次</span>
              </div>
              <div class="best">
                <span class="bestGrade">最好成绩:</span><span class="grade">{{series.obj.maxFraction}} 分</span>
              </div>
            </div>
            <div class="odiv"> </div>
            <div class="liBom">
              <div class="taskLiLeft" v-if="series.obj.testCount&&series.obj.testCount>0" @click="goodsTestShow(series)">
                <img src="static/images/icon/lishi.png" alt="">
                <span>查历史</span>
              </div>
              <div class="taskLiLeft" v-else>
              </div>
              <div class="taskLiRight" @click="taskBtn(series)">
                <img src="static/images/icon/ceyice.png " alt="">
                <span>测一测</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div>
    </Scroll>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
import util from "@/assets/js/util.js"
export default {
  name:'taskGoodsTask',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      bigList:[],
      selected:"",//class判断 id==selected
      loadingFlag:true,
      seriesList:[],
      labelName:"",   // 季节波段名称
      headTabs:[],
      goodsTestList: [],
      season:[],
      date:[],
      testLoadingFlag:true,   // 测试列表加载状态 true 记载中 false 加载完毕

      isActive:0,   // 判断头部滚动需要该参数，初始值为0
    }
  },
  created(){},
  mounted(){},
  activated(){
    localStorage.removeItem('dateName');
    localStorage.removeItem('score');
    this.getSeasonList();
  },
  watch:{
    selected:function(newV,oldV){
      // console.log("监听头部季节波段selected 变化",newV,oldV)
      let _this = this;
      for(var i =0;i<_this.headTabs.length;i++){
        if(newV==_this.headTabs[i].id){
          _this.labelName = _this.headTabs[i].fitOccasionName;
          break;
        }
      }
      _this.seriesList = [];
      _this.getBandBySeasonId(newV);
    },
  },
  methods:{
    // 返回
    back(){
      localStorage.removeItem('season')
      this.$router.push({
        path:'/index',
      })
    },
    // 获取头部季节列表
    getSeasonList(){
      let _this =  this;
      let params = {
        "brandId":localStorage.brandId,
        "typeId":1
      }
      _this.$axios.post("/api/dic/normalList",params).then(function (res){
        if(res.data.code=="200"){
          // console.log("获取头部季节列表成功====",res.data)
          _this.headTabs = res.data.data;
          if(localStorage.season){
            if(_this.selected == localStorage.season){
              _this.selected = localStorage.season;
              _this.getBandBySeasonId(_this.selected);
            }else{
              _this.selected = localStorage.season;
            }
          }else{
            _this.selected = _this.headTabs[0].id;
          }
        }
      }).catch(function (error) {
          console.log(error);
      });
    },
    // 点击头部季节导航进行内容切换
    set_tab_index(val,index){
      let _this = this;
      if(_this.selected!=val){

        if(this.isActive != index){
          if(this.isActive < index){
            this.$refs.goodsScroll.scrollToElement(event.currentTarget,500);
          }else{
            if(!!event.currentTarget.previousElementSibling){
              this.$refs.goodsScroll.scrollToElement(event.currentTarget.previousElementSibling,500);
            }else{
              this.$refs.goodsScroll.scrollToElement(event.currentTarget,500);
            }
          }
        }
        this.isActive = index;

        _this.testLoadingFlag = true;
        _this.selected=val;
        _this.listType = 1;
        // 监听selected有变化的时候会重新请求
      }
    },
    // 根据季节id和品牌ID进行系列测试列表的查询
    getBandBySeasonId(seasonId){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "bsCode": localStorage.brandIdGDY,
        "brandId":brandId,
        "seasonId":seasonId,
        "userId":localStorage.userId
      }
      _this.$axios.post("/api/series/getGoodsTestResult",params).then(function (res){
        // console.log("请求系列测试列表成功",res.data)
        _this.testLoadingFlag=false;
        if(res.data.code=="200"){
          let data = res.data.data;
          _this.bigList = data.bandList;
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    // ============================
    // 测一测按钮  到开始测试页面
    taskBtn(item){
      localStorage.removeItem('tpName');
      localStorage.season = this.selected;  //季节id
      localStorage.dateId = item.id;  //波段id
      localStorage.dateName = this.labelName +' '+ item.bandName; //季节名称+波段日期
      localStorage.toTestPath = 'taskGoodsTask';
      this.$router.push({
        path:"/taskTest",
        query:{
          ceyice:1  //自定义名称，   后面判断是商品自测进来，还是考核任务进来
        }
      });
    },

    // 跳转至查历史列表
    goodsTestShow(item){
      let _this = this;
      localStorage.score = item.obj.maxFraction;
      localStorage.season = this.selected;//季节id
      localStorage.dateId = item.id;//波段id
      localStorage.dateName = _this.labelName +' '+ item.bandName
      // localStorage.checkRecordFlag = 'true';
      _this.$router.push({
        path:'/checkRecord'
      })
    },

  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/taskGoodsTask";
</style>
