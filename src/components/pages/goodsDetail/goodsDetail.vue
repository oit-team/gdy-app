<template>
  <div style="background-color: #fff">
    <mt-header :title="title">
      <span @click="back" slot="left">
        <mt-button icon="back">返回</mt-button>
      </span>
      <!-- <mt-button icon="more" slot="right"></mt-button> -->
    </mt-header>
    <div class="pageBody pageWrapper" ref="pageWrapper">
      <div class="pageContent">
        <div class="goodsImage img_box">
          <mt-swipe :auto="5000">
            <mt-swipe-item v-for="(item, index) in styleInfo.styleImgList" :key="index">
              <img :src="item"/>
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div class="goodsHead">
          <div class="goodsName">
            {{styleInfo.styleName}}
          </div>
          <div class="goodsTag">
            {{styleInfo.wearSellingPoint}}
          </div>
          <div class="goodsI">
            <div class="goodsPrice">
              <span>￥</span>{{styleInfo.stylePrice}}
            </div>
            <div class="goodsHot">
              【推荐等级】<img :src="'/static/imgs/'+styleInfo.recommendationLevel+'.png'">
            </div>
          </div>
        </div>
        <div class="goodsInfo">
          <div class="title">
            · 商品基础信息
          </div>
          <div class="row">
            <div class="info_box area_box">
              <span>【款式编号】</span><span>{{styleInfo.styleNo}}</span>
            </div>
          </div>
          <div class="row">
            <div class="info_box">
              <span>【所属波段】</span><span>{{styleInfo.bandName}}</span>
            </div>
            <div class="info_box">
              <span>【所属系列】</span><span>{{styleInfo.seriesName}}</span>
            </div>
          </div>
          <div class="row">
            <div class="info_box">
              <span>【款式材质】</span><span>{{styleInfo.styleFabric}}</span>
            </div>
            <div class="info_box">
              <span>【款式颜色】</span><span>{{styleInfo.styleColor}}</span>
            </div>
          </div>
          <div class="row">
            <div class="info_box">
              <span>【款式廓形】</span><span>{{styleInfo.styleFlowerPattern}}</span>
            </div>
            <div class="info_box">
              <span>【款式类别】</span><span>{{styleInfo.styleCategory}}</span>
            </div>
          </div>
          <div class="row">
            <div class="info_box">
              <span>【洗涤保养】</span><span>{{styleInfo.washMaintenance}}</span>
            </div>
          </div>
          <div class="row" >
            <div class="info_box area_box ">
              <span>【款式标签】</span><span>{{styleInfo.styleLabel}}</span>
            </div>
          </div>
        </div>
        <div class="goodsSale">
          <div class="title">
            · 试试这样卖
          </div>
          <div class="row">
            <div class="sale_box">
              <span>【面料卖点】</span><span v-html="styleInfo.sellingPointFabric"></span>
            </div>
          </div>
          <div class="row">
            <div class="sale_box">
              <span>【设计卖点】</span><span v-html="styleInfo.designSellingPoint"></span>
            </div>
          </div>
          <div class="row">
            <div class="sale_box">
              <span>【穿着卖点】</span><span v-html="styleInfo.wearSellingPoint"></span>
            </div>
          </div>
        </div>
        <div class="goodsCollection">
          <div class="title">
            · 试试这样搭
          </div>
          <div class="goodsCollectionImgs goodsCollectionWrapper" ref="goodsCollectionWrapper">
            <div class="imgsContent" ref="collImgsContent">
              <div class="img_box" v-for="(item,index) in styleInfo.collList" :key="index">
                <img  :src="item.imgUrl" @click="toColl(item.id)"/>
              </div>
            </div>
          </div>
        </div>
        <div class="goodsSingle">
          <div class="title">
            · 搭配单品推荐
          </div>
          <div class="goodsSingleImgs">
            <img v-for="(item, index) in styleInfo.styleList" :key="index" :src="item.imgUrl" @click="toStyle(item.id)"/>
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
      title:"商品",
      styleId:"",
      styleInfo:{
      },
    };
  },
  methods:{
    toColl(id){
      let _this = this;
      _this.$router.push({path:"/styleDetail",query:{"collId":id}});
    },
    back(){
      this.$router.go(-1)
    },
    toStyle(val){
      // _this.
      let _this = this;
      _this.styleId=val;
    },
    initOrLoadScrollView(){
       let _this = this;
      _this.$nextTick(()=>{
        if(!_this.pageWrapper){
          _this.pageWrapper = new _this.$BScroll(_this.$refs.pageWrapper,{
            scrollX:false,
            scrollY:true,
            click:true
          });
        }else{
          _this.pageWrapper.refresh();
        }
        if(!_this.goodsCollectionWrapper){
          _this.goodsCollectionWrapper = new _this.$BScroll(_this.$refs.goodsCollectionWrapper,{
            scrollX:true,
            scrollY:false,
            click:true
          });
        }else{
          _this.goodsCollectionWrapper.refresh();
        }
        _this.pageWrapper.scrollTo(0,0,0);
      })
    },
    getStyleInfo(id){
      let _this = this;
      _this.$axios.get("/api/style/"+id)
      .then(function(res){
        let data = res.data;
        if(data.code=="200"){
          data.data.styleImgList = data.data.imgUrls.split(",");
          _this.styleInfo = data.data;
          _this.$refs.collImgsContent.style.width=4.5*_this.styleInfo.collList.length + "rem";
          _this.title = _this.styleInfo.styleNo;
        }
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
      _this.initOrLoadScrollView();
    }
  },
  mounted(){
    let _this = this;
    _this.styleId = _this.$route.query.styleId;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pageBody{
  width: 100vw;
  height:16.7rem;
  overflow: hidden;
}
.goodsImage{
  height: 10rem;
  text-align: center;
  padding-bottom: 0.2rem;
  border-bottom: 0.5px solid #000;
}
.goodsHead{
  padding: 0.45rem;
}
.goodsName{
  font-size: 0.5rem;
}
.goodsTag{
  margin-top: 6px;
  color:#dfdfdf;
  font-size:0.3rem;
}
.goodsI{
  overflow: hidden;
  vertical-align: middle;
  line-height: 1rem;
  margin:0.2rem 0;
}
.goodsPrice{
  float: left;
  color: red;
  font-size:1rem;
}
.goodsPrice span{
  font-size:0.5rem;
}
.goodsHot{
  float: right;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.3rem;
}
.goodsHot img{
  width: 2.5rem;
  position: relative;
  top: 50%;
  left: 30%;
  /* -webkit-transform: translate(-50%,-50%); */
  transform: translate(-50%,-50%);
}
.title{
  font-size: 0.45rem;
  border-top: 0.5px solid #bfbfbf;
  border-bottom: 0.5px solid #bfbfbf;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 8px;
  margin-bottom:0.2rem;
}
.row{
  overflow: hidden;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}
.info_box{
  font-size: 0.35rem;
  float: left;
  width: 40%;
  padding-left:0.4rem;
}
.sale_box{
  font-size: 0.35rem;
  padding-left:0.4rem;
  width: 100%;
}
.goodsSingleImgs{
  overflow: hidden;
  width:90%;
  margin:0 auto;
}
.goodsSingleImgs img{
  width:2.9rem;
  height: 2.9rem;
  float: left;
  margin-right: 0.1rem;
  margin-bottom:0.1rem;
}
.goodsCollectionImgs{
  width:100vw;
  overflow: hidden;
  margin-bottom: 0.2rem;
}
.goodsCollectionImgs .img_box{
  width:4rem;
  height:4rem;
  float:left;
  margin-left:0.5rem;
}
.img_box img{
  max-width: 100%;
  max-height: 100%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.imgsContent{
  width:100vw;
  overflow: hidden;
}
.area_box{
  width: 100%;
}
</style>

