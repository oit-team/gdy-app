<template>
  <div style="position:relative;top:0px;">
      <div class="head_tab">
          <div class="goods_head_tab_wrapper" ref="goods_head_tab_wrapper">
              <mt-navbar v-model="selected" class="head_tab_bar" ref="head_tab_bar">
                <mt-tab-item v-for="(item, index) in headTabs" :key="index" :id="item.id">{{item.fitOccasionName}}</mt-tab-item>
              </mt-navbar>
          </div>
      </div>
      <div class="head_tab_container">
        <div class="row" id="tabemplyee">
          <div class="e_tab">
            <div class="goods_menu_scroll_wrapper" ref="goods_menu_scroll_wrapper">
              <div>
                <ul class="e_navbar">
                  <li class="e_navbar_item"
                    v-for="(tab, index) in tabs"
                    :class="{'active':tab.id===liselected}"
                    @click="choose(tab.id)" v-bind:key="index">{{tab.bandName}}dddd
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="session_view">
            <div class="loading-box" :class="{'loading':loadingIn,'out':loadingOut}">
              <vue-loading type="spin" color="#00a4ff" :size="{ width: '1rem', height: '1rem' }" ref="loading"></vue-loading>
            </div>
            <div class = "session_info" v-if="band.bandName!=''">
              <div class="session_info_row_01">
                <span>基础信息</span>
              </div>
              <div class="session_info_row">
                <span>【波段名称】</span><span>{{band.bandName}}</span>
              </div>
              <div class="session_info_row">
                <span>【波段季节】</span><span>{{band.seasonName}}</span>
              </div>
              <div class="session_info_row">
                <span>【波段时间】</span><span>{{band.playTime}}</span>
              </div>
            </div>
            <div class="session_img_box goods_session_scroll_wrapper" ref="goods_session_scroll_wrapper">
              <div class="session_scroll_content">
                <div class="series_box" v-for="(item,index) in seriesList" :key="index" @click="goGoods(liselected,item.id)">
                  <img :src="item.imgUrl"/>
                  <p>{{item.seriesName}}</p>
                </div>
                <div class="white_box">
                </div>
              </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
// var tab01 = Vue.extend({
//             template:'<p>This is tab01</p>'
//         })
//         var tab02 = Vue.extend({
//             template:'<p>This is tab02</p>'
//         })
//         var tab03 = Vue.extend({
//             template:'<p>This is tab03</p>'
//         })
import util from "@/assets/js/util.js"
export default {
  name: "",
  data() {
    return {
      selected:"",
      band:{
        id:"",
        bandName:"",
        season:"",
        bandStartTime:"",
        bandEndTime:"",
        playTime:""
      },
      loadingIn:false,
      loadingOut:false,
      seriesList:[

      ],
      tabs:[
        {bandName:"春一波",id:0},
        {bandName:"春二波",id:1},
        {bandName:"春三波",id:2},
        {bandName:"春四波",id:3},
        {bandName:"夏一波",id:4},
        {bandName:"夏二波",id:5},
        {bandName:"夏三波",id:7},
        {bandName:"夏四波",id:8},
      ],
      liselected:"",
      headTabs:[
        {fitOccasionName:"18春夏",id:0},
        {fitOccasionName:"18秋冬",id:1},
        {fitOccasionName:"19春夏",id:2},
        {fitOccasionName:"19秋冬",id:3}
      ]
    };
  },
  components: {
  },
  methods: {
    goGoods(bandId,seriesId){
      let _this = this;
      _this.$router.push({
        path:"/series",
        query:{
          "bandId":bandId,
          "seriesId":seriesId
        }
      });
    },
    choose: function(index) {
      let _this = this;
      _this.liselected = index;
    },
    initAndReloadScroll(){
      let _this = this;
      _this.$nextTick(()=>{
        if(!_this.headTabScroll){
          _this.headTabScroll = new _this.$BScroll(_this.$refs.goods_head_tab_wrapper,{
            scrollX:true,
            scrollY:false,
            click:true,
            bounce:{
              left:false,
              right:false
            }
          });
        }else{
          _this.headTabScroll.refresh();
        }
        if(!_this.menuScroll){
          _this.menuScroll = new _this.$BScroll(_this.$refs.goods_menu_scroll_wrapper,{
            click:true,
            bounce:{
              top:false,
              bottom:false
            }
          });
        }else{
          _this.menuScroll.refresh();
        }
        if(!_this.sessionScroll){
            _this.sessionScroll = new _this.$BScroll(_this.$refs.goods_session_scroll_wrapper,{
            click:true
          });
        }else{
          _this.sessionScroll.refresh();
        }
      });
    },
    getSeasonList(){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":1
      }
      _this.$axios.post("/api/dic/normalList",params)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            _this.headTabs=data.data;
            if(!_this.selected){
              _this.selected = _this.headTabs[0].id;
            }
          }
          _this.$refs.head_tab_bar.$el.style.width = 4* _this.headTabs.length +"rem";
          _this.initAndReloadScroll();
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    getBandBySeasonId(seasonId){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "seasonId":seasonId
      }
      _this.$axios.post("/api/band/list",params)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            _this.tabs=data.data;
            if(_this.tabs.length>0){
              _this.liselected=_this.tabs[0].id;
            }
          }
           _this.initAndReloadScroll();
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    getSeries(bandId){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "bandId":bandId
      }
      _this.$axios.post("/api/series/list",params)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            _this.seriesList=data.data;
          }
          _this.initAndReloadScroll();
      })
      .catch(function (error) {
          console.log(error);
      });
    }
  },
  watch:{
    selected:function(newV,oldV){
      let _this = this;
      _this.band = {
        bandName:"",
        seasonName:"",
        playTime:""
      }
      _this.seriesList = [];
      _this.getBandBySeasonId(newV);
    },
    liselected:function(newV,oldV){
      let _this = this;
      if(!_this.loadingIn){
        _this.loadingIn=true;
        setTimeout(function(){
          _this.loadingIn=false;
        },800);
      }
      _this.tabs.forEach(e => {
        if(newV == e.id){
          e.playTime = e.bandStartTime.substr(0,10)+"~"+e.bandEndTime.substr(0,10);
          _this.band=e;
          return;
        }
      });
      _this.getSeries(newV);
    }
  },
  updated(){
    this.initAndReloadScroll();
  },
  mounted() {
    let _this = this;
    _this.getSeasonList();

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.session_scroll_content{
  overflow: hidden;
}
.goods_menu_scroll_wrapper{
  overflow: hidden;
}
.goods_head_tab_wrapper{
  width: 100vw;
  overflow: hidden;
}
.session_view{
  float: left;
  width: 70%;
  height: 15.3rem;
  background-color: #fff;
}
.series_box p{
  text-align: center;
}





* {
  padding: 0;
  margin: 0;
}
.head_tab_container{
    width:100vw;
    margin-top:2px;
}
.head_tab_bar{
    width:24rem;
    font-size:7px;
}
#tabemplyee {
  width: 30%;
  height: 14.4rem;
  margin: 0 auto;
  /* background-color: #f0f0f1; */
  float: left;
  font-size: 6px;
}
.mt_tab_container{
  height: 15.3rem;
}
.e_tab {
  height: 100%;
  background-color: #f0f0f1;
  padding: 0;
  width: 100%;
}
.e_tab ul li {
  display: block;
  text-align: center;
  cursor: pointer;
  line-height: 1.4rem;
  border-bottom: transparent;
  font-size: 0.38rem;
}
.e_tab ul li .e_tab_bd {
  margin: 3%;
}
.e_navbar_item.active {
  background-color: #fff;
  color: #00a4ff;
}
/*切换动画*/
.fade-transition {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave {
  opacity: 0;
}
#tabcontainer {
  float: left;
  width: 70%;
  height: 15.3rem;
  background-color: #fff;
}
.tab_item {
  display: none;
}
.tab_item.active {
  display: block;
}
.session_info{
  margin: 10px;
  border: 0.5px solid #dfd5d5;
  padding-top: 7px;
  padding-left: 10px;
  text-align: left;
  border-radius: 7px;
  font-size: 0.5rem;
}
.session_info div{
  margin-bottom: 7.5px;
}
.session_info_row{
  font-size: 0.3rem;
}
.session_img_box{
  padding-left: 19px;
  overflow: hidden;
  height:11rem;
}
.series_box{
  float: left;
  margin-right: 20px;
  margin-bottom: 15px;
  font-size: 0.36rem;
  line-height: 0.5rem;
}
.series_box img{
  width: 2.5rem;
  height:1.9rem;
}
.white_box{
  float: left;
  width:100%;
  height: 1.4rem;
}
.goods_menu_scroll_wrapper{
  height: 100%;
}
.loading-box{
  overflow: hidden;
  height:0rem;
}
.loading-box.loading{
  animation: fadeInOut 1.2s;
}

@keyframes fadeInOut
{
  0% {height: 0rem;}
  50% {height: 1rem;}
  100% {height:0rem;}
}
</style>
