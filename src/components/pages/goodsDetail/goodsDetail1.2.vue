<template>
  <div class="main" @touchmove.prevent>
    <div class="header">
      <div class="header_one" @click="back">
        <div><img src="static/images/dev/back_white@2x.png" ></div>
      </div>
      <div class="header_two" ref="header" @click="back">
        <img src="static/images/dev/back@2x.png" >
      </div>
    </div>
    <div class="page" ref = "page">
      <div class="page_scroll_content">
        <div class="head_img">
          <mslider :loop="isLoop" ref="slider" :auto-play="false">
            <div class="img_wrapper" v-for="(item,index) in (styleInfo.styleImgList)" :key="index">
              <img :src="item">
            </div>
          </mslider>
        </div>
        <div class="goods_container">
          <h4 class="goods_name">{{styleInfo.styleName}}</h4>
          <div class="goods_describe" @click="sellShow"><span>{{styleInfo.wearSellingPoint}}</span><img src="static/images/icon/right_blue@2x.png"></div>
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
                <span class="value">{{styleInfo.washMaintenance}}</span>
              </div>
            </div>
            <div class="row">
              <div class="center">
                <span class="name">标签</span>
                <span class="value style_label">{{styleInfo.styleLabel}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="spacing"></div>
        <!-- 卖点 -->
        <div class="title_wrap">
          <div>
            <div class="title">
              <img src="static/images/icon/right_white@2x.png"><div>试试这样卖</div>
            </div>
            <div class="subtitle">Try selling like this</div>
          </div>
          <div class="title_btn" @click="sellShow">详情</div>
        </div>
        <div class="spacing"></div>
        <div class="wrap">
          <div class="basic_info">
            <div class="row" >
              <div class="center" style="margin:0">
                <span class="name">面料卖点</span>
                <span class="value">{{styleInfo.sellingPointFabric}}</span>
              </div>
            </div>
            <div class="row">
              <div class="center">
                <span class="name">设计卖点</span>
                <span class="value">{{styleInfo.designSellingPoint}}</span>
              </div>
            </div>
            <div class="row">
              <div class="center">
                <span class="name">穿着卖点</span>
                <span class="value">{{styleInfo.wearSellingPoint}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="spacing"></div>
        <!-- 搭配 -->
        <div class="title_wrap">
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
        <div class="title_wrap">
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
        <li><span>保养</span><span>{{styleInfo.washMaintenance}}</span></li>
      </ul>
    </m-popup>
    <m-popup title="试试这样卖" ref="sell_pop">
      <ul>
        <li><span>面料卖点</span><span>{{styleInfo.sellingPointFabric}}</span></li>
        <li><span>设计卖点</span><span>{{styleInfo.designSellingPoint}}</span></li>
        <li><span>穿着卖点</span><span>{{styleInfo.wearSellingPoint}}</span></li>
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
      isLoop:true
    };
  },
  components:{
    'mslider': Slider,
    'mPopup':popup
  },
  methods:{
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
      _this.$router.push({path:"/styleDetail",query:{"collId":id,stemp:new Date().getTime()}});
    },
    back(){
      this.$router.go(-1)
    },
    toStyle(val){
      let _this = this;
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
            probeType:3
          });
          _this.pageScroll.on("scroll",pos=>{
            // console.log(pos.y);
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
        _this.pageScroll.scrollTo(0,0,0);
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
            data.data.styleLabel = data.data.styleLabel.split(",").join("  ");
          }
          _this.styleInfo = data.data;
          _this.title = _this.styleInfo.styleNo;
          _this.isLoop = _this.styleInfo.styleImgList.length>1;
        }
        _this.$refs.slider.update();
        _this.initOrLoadScrollView();
      })
      .catch(function(error){
        console.log(error);
      });
    }
  },
  watch:{
    styleId:function(newV,oldV){
      let _this = this;
      util.loading();
      _this.getStyleInfo(newV);

    }
  },
  mounted(){
    let _this = this;
    _this.styleId = _this.$route.query.styleId;
  },
  activated(){
    // let _this = this;
    // _this.styleId = _this.$route.query.styleId;
  },
  updated(){
    this.initOrLoadScrollView();
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
  height: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  opacity: 0;
  z-index: 100;
}
.header_two img{
  height: 0.4rem;
  margin-left:0.4rem;
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
}
</style>

