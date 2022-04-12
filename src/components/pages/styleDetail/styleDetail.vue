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
            <mt-swipe-item v-for="(item, index) in collImgs" :key="index">
              <img :src="item"/>
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div class="goodsInfo">
          <div class="title">
            · 搭配基础信息
          </div>
          <div class="row">
            <div class="info_box">
              <span>【搭配名称】</span><span>{{collInfo.collName}}</span>
            </div>
          </div>
          <div class="row">
            <div class="info_box">
              <span>【推荐等级】</span><span class="goodsHot"><img :src="'/static/imgs/'+collInfo.recommendationLevel+'.png'"></span>
            </div>
          </div>
          <div class="row">
            <div class="info_box">
              <span>【适合场合】</span><span>{{collInfo.situations}}</span>
            </div>
          </div>
          <div class="row">
            <div class="info_box">
              <span>【搭配标签】</span><span>{{collInfo.collLabel}}</span>
            </div>
          </div>
          <div class="row">
            <div class="info_box text_area">
              <span>【搭配解读】</span><span class="text_area_content" v-html="collInfo.collInterpretation"></span>
            </div>
          </div>
        </div>
        <div class="goodsSale">
          <div class="title">
            · 搭配单品
          </div>
          <div class="singleListBox">
            <div class="singleBox" v-for="(item, index) in goodsSingle" :key="index" @click="toGoods(item.id)">
              <img :src="item.imgUrl"/>
              <div class="singleInfo">
                <div class="styleName">
                  {{item.styleName}}
                </div>
                <div class="singlePrice">
                  ￥{{item.stylePrice}}
                </div>
                <div class="singleProp">
                </div>
              </div>
              <!-- <div class="singleNum">
                x1
              </div> -->
              <!-- <div class="singleIcon">></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      title:"商品",
      collImgs:[],
      goodsSingle:[

      ],
      collInfo:{}
    };
  },
  methods:{
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
          _this.pageWrapper = new _this.$BScroll(_this.$refs.pageWrapper,{
            scrollX:false,
            scrollY:true,
            click:true
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
          _this.collInfo = data.data;
          _this.collImgs = _this.collInfo.imgUrls.split(",");
          _this.goodsSingle = _this.collInfo.styleList;
          _this.title=_this.collInfo.collName;
        }
      })
      .catch(function(error){
        console.log(error);
      });
    }
  },
  mounted(){
    let _this = this;
    _this.getInfo(_this.$route.query.collId);
    _this.initOrLoadScrollView();
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
  width: 100%;
  padding-left:0.4rem;
}
.text_area span{
  display: block;
  float: left;
}
.text_area_content{
  width:7rem;
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
  width:3.5rem;
  height: 3.5rem;
  float: left;
  margin-right: 1rem;
}

.singleBox{
  width:90%;
  margin-left: 10%;
  overflow: hidden;
  font-size:0.38rem;
  position: relative;
  padding-bottom: 0.3rem;
  margin-bottom:0.3rem;
  border-bottom:0.5px solid #c0c0c0;
}
.singleBox>*{
  float:left;
}
.singleBox img{
  width: 2.5rem;
  height: 2.5rem;
}
.singleInfo{
  width: 5rem;
  margin-left: 0.2rem;
}
.singleName{
  line-height: 0.38rem;
  height:0.76rem;
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
.singlePrice{
  font-size: 0.5rem;
  margin-top: 0.25rem;
  color: #ff4c00;
}
.singleNum{
  position: absolute;
  right: 0.2rem;
}
.singleIcon{
  position: absolute;
  right: 0.3rem;
  bottom: 0.2rem;
  font-size: 0.6rem;
  color: #ababa6;
}
.img_box img{
  max-width: 100%;
  max-height: 100%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.goodsHot img{
  width: 1.9rem;
}
</style>
