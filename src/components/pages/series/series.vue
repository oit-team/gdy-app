<template>
  <div style="background-color: #fff;">
    <mt-header :title="title">
      <span @click="back" slot="left">
        <mt-button icon="back">返回</mt-button>
      </span>
      <!-- <mt-button icon="more" slot="right"></mt-button> -->
    </mt-header>
    <div class="head_tab">
        <div class="head_scroll_wrapper" ref="head_scroll_wrapper">
          <mt-navbar v-model="selected" class="head_tab_bar" ref="head_tab_bar">
            <mt-tab-item :id="item.id" v-for="(item, index) in headTabs" :key="index"
            >{{item.seriesName}}
            </mt-tab-item>
          </mt-navbar>
        </div>
    </div>
    <div class="head_tab_container container_scroll_wrapper" ref="container_scroll_wrapper">
      <div>
        <div class="series_info">
          <div class="series_info_row">
            <span>【系列名称】</span><div>{{series.seriesName}}</div>
          </div>
          <div class="series_info_row">
            <span>【系列标签】</span><div>{{series.seriesLabel}}}</div>
          </div>
          <div class="series_info_row">
            <span>【系列解读】</span><div>{{series.seriesInterpretation}}</div>
          </div>
          <div class="series_info_row">
            <span>【系列图片】</span>
          </div>
        </div>
        <div class="series_info_imgs">
          <mt-swipe :show-indicators="false">
            <mt-swipe-item v-for="(item, index) in showImgs" :key="index">
              <img :src="item"/>
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div class="series_info_goods">
          <div class="series_info_goods_title">本系列单款详解</div>
          <div class="series_info_goods_list">
            <div class="series_info_goods_box" v-for="(item,index) in goodsList" :key="index"
              @click="goGoods(item.id)">
              <img :src="item.imgUrl" width="1rem" height="1rem"/>
              <span>货号：{{item.styleNo}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from "@/assets/js/util.js"
export default {
  name: "",
  data() {
    return {
      title: "春一波",
      selected: 0,
      showImgs: [
        "/static/imgs/time1.jpg",
        "/static/imgs/time2.jpg",
        "/static/imgs/time3.jpg"
      ],
      headTabs:[],
      seriesList:[
        {name:"123",value:0}
      ],
      series:{
        seriesName:"",
        id:"",
        seriesLabel:"",
        seriesInterpretation:""
      },
      goodsList:[

      ]
    };
  },
  methods: {
    back(){
      this.$router.go(-1)
    },
    getSeries(bandId,seriesId){
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
            _this.headTabs=data.data;
          }
          _this.$refs.head_tab_bar.$el.style.width=_this.headTabs.length*4 +"rem";
          _this.$nextTick(()=>{
            _this.selected = seriesId;
          });
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    getSeriesInfo(seriesId){
      let _this = this;
      _this.$axios.get("/api/series/"+seriesId)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            _this.series = data.data;
            _this.showImgs = data.data.imgUrl.split(",");
            _this.goodsList = data.data.styleList;
          }
      }).catch(function(error){
        console.log(error);
      });
    },
    goGoods(val){
      let _this = this;
      _this.$router.push({path:"/goodsDetail",query:{styleId:val}});
    },
    initOrReloadScrollView(){
      let _this = this;
      _this.$nextTick(() => {
        _this.headTabScroll = new _this.$BScroll(
          _this.$refs.head_scroll_wrapper,
          {
            scrollX: true,
            scrollY: false,
            click: true,
            bounce:{
              left:false,
              right:false
            }
          }
        );
        _this.bodyTabScroll = new _this.$BScroll(
          _this.$refs.container_scroll_wrapper,
          {
            scrollY: true,
            click: true
          }
        );
      });
    }
  },
  watch:{
    selected:function(newV,oldV){
      let _this = this;
      util.loading();
      _this.getSeriesInfo(newV);
    }
  },
  mounted() {
    let _this = this;
    var bandId = parseInt(_this.$route.query.bandId);
    var seriesId = parseInt(_this.$route.query.seriesId);
    _this.getSeries(bandId,seriesId);
    _this.initOrReloadScrollView();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head_tab {
  width: 100vw;
}
.head_tab_container {
  width: 100vw;
  background-color: #fff;
  height: 15.7rem;
  overflow: hidden;
}
.head_tab_bar {
  /* width: 20rem; */
}
.series_info {
  text-align: left;
  padding-top: 0.2rem;
  padding-left: 0.2rem;
  font-size: 0.4rem;
}
.series_info_row {
  line-height: 1rem;
  overflow: hidden;
}
.series_info_row span {
  display: block;
  float: left;
}
.series_info_row div {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
.scroll_view {
  height: 15.7rem;
}
.series_info_imgs {
  width: 95vw;
  margin-left: 2.5vw;
  height: 4rem;
}

.series_info_imgs img {
  width: 100%;
  height: 100%;
}

.series_info_goods {
  margin-top: 0.2rem;
}
.series_info_goods_title {
  text-align: center;
  font-size: 0.35rem;
  padding-bottom: 0.3rem;
  border-bottom: 0.5px solid #8eacac;
}
.series_info_goods_box {
  float: left;
  margin-left: 0.3rem;
  margin-top: 0.3rem;
}
.series_info_goods_box img {
  width: 2.9rem;
  height: 4rem;
}
.series_info_goods_box span {
  display: block;
  text-align: center;
}
</style>
