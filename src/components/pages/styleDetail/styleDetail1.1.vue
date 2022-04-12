<template>
  <div class="main" @touchmove.prevent>
    <div class="header" @click="back">
      <div class="header_one">
        <div><img src="static/images/dev/back_white@2x.png" ></div>
      </div>
      <div class="header_two" ref="header" @click="back">
        <img src="static/images/dev/back@2x.png" >
      </div>
    </div>
    <div class="page"  ref="page">
      <div class="page_scroll_content">
        <div class="head_img">
          <mslider :loop="isLoop" ref="slider" :auto-play="false">
            <div class="img_wrapper" v-for="(item,index) in collInfo.imgUrls" :key="index">
              <img :src="item">
            </div>
          </mslider>
        </div>
        <div class="spacing"></div>
        <div class="wrap">
          <h4 class="title"><span></span>&nbsp;搭配基础信息&nbsp;<span></span></h4>
          <p class="subtitle">Commodity basic</p>
          <div>
            <ul class="basic_info">
              <li>
                <span class="name">搭配名称:</span>
                <span class="value">{{collInfo.collName}}</span>
              </li>
              <li>
                <span class="name">推荐等级:</span>
                <span class="value">
                  <span
                      v-for="(item, key) in [1,2,3,4,5]"
                      :key="key"
                      class="star"
                      :class="{highlighted:key<collInfo.recommendationLevel}"
                    ></span>
                </span>
              </li>
              <li>
                <span class="name">适合场合:</span>
                <span class="value">{{collInfo.situations}}</span>
              </li>
              <li>
                <span class="name">搭配标签:</span>
                <span class="value">{{collInfo.collLabel}}</span>
              </li>
              <li>
                <span class="name">搭配解读:</span>
                <span class="value">{{collInfo.collInterpretation}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="spacing"></div>
        <!-- 推荐 -->
        <div
          class="wrap"
          style="background:#F8F8F8"
        >
          <h4 class="title"><span></span>&nbsp;搭配单款&nbsp;<span></span></h4>
          <p class="subtitle">Matching single</p>
          <div>
            <ul class="recommended">
              <li
                v-for="(item, key) in goodsSingle"
                :key="key"
              >
                <div class="rec_item" @click="toGoods(item.id)">
                  <img
                    width="100%"
                    :src="item.imgUrl"
                    alt="" @load="loadedImg"
                  >
                  <p class="name">{{item.styleName}}</p>
                  <p class="rec_bottom"><span class="price"><i style="">¥</i> {{item.stylePrice}}</span><!--<span class="people_buy">{{'6'}}人已买</span>--></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from '../../comps/slider/slider.vue';
export default {
  name: "",
  data() {
    return {
      title:"商品",
      collImgs:[],
      goodsSingle:[
      ],
      collInfo:{},
      isLoop:true
    };
  },
  components:{
    'mslider': Slider,
  },
  methods:{
    loadedImg(){
      this.initOrLoadScrollView();
    },
    toGoods(id){
      let route={
        path:"/goodsDetail",
        query:{
          styleId:id
        }
      };
      this.$router.push(route);
    },
    back(){
      this.$router.go(-1)
    },
    initOrLoadScrollView(){
       let _this = this;
      _this.$nextTick(()=>{
        if(!_this.pageWrapper){
          _this.pageWrapper = new _this.$BScroll(_this.$refs.page,{
            scrollX:false,
            scrollY:true,
            click:true,
            probeType:3
          });
          _this.pageWrapper.on("scroll",pos=>{
            if(Math.abs(pos.y)-80 <= 0){
              _this.$refs.header.style.opacity=0;
            }
            else if(Math.abs(pos.y)-80 > 0){
              _this.$refs.header.style.opacity = (Math.abs(pos.y)-80)/180;
            }
          });
        }else{
          _this.pageWrapper.refresh();
        }
      })
    },
    getInfo(id){
      let _this = this;
      let params={
        brandId:localStorage.brandId,
        id:id
      }
      _this.$axios.post("/api/coll/info",params)
      .then(function(res){
        let data = res.data;
        if(data.code=="200"){
          data.data.imgUrls = data.data.imgUrls.split(",");
          _this.collInfo = data.data;
          _this.isLoop=_this.collInfo.imgUrls.length>1;
          _this.goodsSingle = _this.collInfo.styleList;
          _this.title=_this.collInfo.collName;
        }
        _this.$refs.slider.update();
      })
      .catch(function(error){
        console.log(error);
      });
    }
  },
  mounted(){
    let _this = this;
    _this.getInfo(_this.$route.query.collId);
  },
  updated(){
    this.initOrLoadScrollView();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.goods_container {
  padding: 14.5px 15px 10px 15px;
}
.goods_name {
  font-size: 18px;
  font-family: PingFang-SC-Bold;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  padding: 0 0 11px 0;
  /* line-height: 78px; */
}
.goods_describe {
  font-size: 14px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  line-height: 16px;
  padding: 0 0 7.5px 0;
}
.goods_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
}
.title span {
  width: 15px;
  height: 1px;
  background: rgba(153, 153, 153, 1);
}
.subtitle {
  text-align: center;
  font-size: 9px;
  font-family: ArialMT;
  font-weight: 400;
  color: rgba(199, 199, 199, 1);
  line-height: 16px;
  margin-bottom: 13px;
}
.basic_info {
  background: #f7f7f7;
  display: flex;
  flex-wrap: wrap;
  margin: 0 7.5px;
  padding-top: 17px;
}

.basic_info li {
  width: 100%;
  font-size: 14px;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  line-height: 16px;
  margin-bottom: 15.5px;
  padding-left: 20px;
  box-sizing: border-box;
}
.name {
  color: #c7c7c7;
}
.value {
  color: #999;
}
.spacing {
  height: 10px;
  background: #f8f8f8;
}
.wrap {
  padding: 21px 0;
}
.selling_point {
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
  padding: 0 45px;
}
.col_img_a {
  height: 100%;
  width: 4.4rem;
  text-align: center;
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.img_wrapper img{
  width: 10rem;
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
</style>
