<template>
  <div id="styleMain" @touchmove.prevent>
    <div class="header" >
      <div class="header_one" @click="back">
        <div><img src="static/images/dev/back_white@2x.png" ></div>
      </div>
      <div ref="header" class="header_two" @click="back">
        <img src="static/images/dev/back@2x.png" >
      </div>
    </div>
    <div ref="page"  class="page">
      <div class="page_scroll_content">

        <div class="head_img">
          <mslider ref="slider" :loop="isLoop" :auto-play="false">
            <div v-for="(item,index) in collInfo.imgUrls" :key="index" class="img_wrapper">
              <vc-img raw fit="contain" height="100%" :src="item" alt="" @click="getImg(index)" />
            </div>
          </mslider>
        </div>
        <div class="base">
          <div v-if="situationsList" class="suitBox">
            <span v-for="(item,i) in situationsList" :key="i" class="item">{{item}}</span>
          </div>
          <!-- <div class="styleName">{{collInfo.collName}}</div> -->
          <div class="recReason">
            <div v-if="reasonDesc !==''" class="recTit">
              <span class="tit">推荐理由</span>
              <img src="static/images/icon/copy.png" alt="">
              <span class="copyBtn"  @click="copy(reasonDesc)">复制</span>
            </div>

            <!-- <div class="recDesc" v-if="reasonDesc !==''">{{reasonDesc}}</div> -->

            <div v-if="reasonDesc !==''" ref="desc"  class="recDesc" :class="fold ? 'fold' : 'unfold'">{{reasonDesc}}</div>
            <div v-if="showExchangeButton">
              <div v-show="fold" class="show" @click="handleFold">展开</div>
              <div v-show="!fold" class="show" @click="handleFold">收起</div>
            </div>

          </div>
        </div>

        <div class="recList">
          <div v-for="(item,i) in goodsSingle" :key="i" class="item" @click="toGoods(item.id)">
            <div class="imgBox">
              <img :src="item.imgUrl" alt="" @load="imgLoad">
              <div class="tipBox">
                <img v-if="item.styleFlag == 1" class="key-tip-img" src="../../../../static/images/icon/tip.png" alt="">
                <img v-if="item.leaFlag == 1" class="learnIcon" src="../../../../static/images/icon/new.png" alt="">
                <img v-if="item.videoFlag == 0" class="videoIcon" src="../../../../static/images/icon/video.png" alt="">
              </div>
            </div>
            <div class="num">{{item.styleNo}}</div>
            <div class="price">￥{{item.stylePrice}}</div>
          </div>

        </div>
        <loadAll></loadAll>

      </div>
    </div>

    <!-- 图片预览组件 -->
    <imgPreview v-if="showPreview"
        :imgList = collInfo.imgUrls
        fromPage="brandCollDetail"
        :curIndex="curImgIndex"
        :isShowPreview = showPreview
        :goodsId='goodsId'
        raw
                @func="changePreview"
        ></imgPreview>

  </div>
</template>

<script>
import Slider from '../../comps/slider/slider.vue';
import popup from "../../comps/popup/popup.vue";
import loadAll from '../../comps/common/loadAll';
import imgPreview from "../../comps/common/imgPreview";
import { ImagePreview, Toast } from 'vant';
export default {
  name: "styleDetail",
  components:{
    'mslider': Slider,
    'mPopup':popup,
    'loadAll':loadAll,
    'imgPreview':imgPreview,
  },
  data() {
    return {
      options1:{
        zIndex:9999,
        loop:false
      },
      title:"商品",
      collImgs:[],
      collInfo:{collInterpretation:""},
      isLoop:true,

      showPreview:false, // 图片预览组件标志符

      situationsList:[],   // 适用场合
      goodsSingle:[],   // 搭配单品列表

      fold:true,
      reasonDesc:'',
      rem:'',
      showExchangeButton:false,

      curImgIndex:1,

      goodsId:null,

    };
  },
  created(){
    this.goodsId = this.$route.query.collId;
  },

  methods:{
    handleFold(){
			this.fold=!this.fold;
		},
    copy(text) {
      var Input = document.createElement('input'); //创建一个隐藏input（重要！）
      Input.value = text; //赋值
      document.body.appendChild(Input);
      Input.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      Input.className = 'oInput';
      Input.style.display = 'none';
      Toast("复制成功")
    },
    changePreview(val){
      this.showPreview = val
    },
    getImg(index){
      // 这里多传一个参数item,就可以获取到对应点击的图片的src
      // console.log("点击图片预览进行",index);
      this.showPreview = true;
      this.curImgIndex = index;
    },
    infoShow(){
      this.$refs.info_pop.show();
    },
    imgLoad(){
      this.initOrLoadScrollView();
    },
    toGoods(id){
      let route={
        path:"/goodsDetail2",
        query:{
          styleId:id,
          stamp:new Date().getTime()
        }
      };
      this.$router.push(route);
    },
    back(){
      this.$router.go(-1);
    },
    initOrLoadScrollView(){
       let _this = this;
      _this.$nextTick(()=>{
        if(!_this.pageWrapper){
          _this.pageWrapper = new _this.$BScroll(_this.$refs.page,{
            scrollX:false,
            scrollY:true,
            click:true,
            probeType:3,
            useTransition:false,
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
    // 获取搭配详情信息
    getStyleInfo(id){
      let _this = this;
      let params={
        brandId:localStorage.brandId,
        id:id,
        userId:localStorage.userId
      }
      _this.$axios.post("/api/coll/info",params)
      .then(function(res){
        let data = res.data;
        // console.log("搭配详情>>>>>>>>>>>>>>>>>>>>>>>>",data)
        if(data.code=="200"){
          if(data.data.collLabel){
            data.data.collLabel = data.data.collLabel.split(",").join("  ");
          }else{
            data.data.collLabel = "无"
          }
          // data.data.collLabel = data.data.collLabel.split(",").join("  ");
          data.data.imgUrls = data.data.imgUrls.split(",");
          _this.collInfo = data.data;
          // console.log("搭配详情信息=====",_this.collInfo)

          if(_this.collInfo.situations){
            _this.situationsList = _this.collInfo.situations.split(",");
          }

          _this.isLoop=_this.collInfo.imgUrls.length>1;
          _this.goodsSingle = _this.collInfo.styleList;
          // console.log('_this.goodsSingle=====',_this.goodsSingle)
          _this.title=_this.collInfo.collName;
          if(_this.collInfo.collInterpretation){
            _this.reasonDesc = _this.htmlToStr(_this.collInfo.collInterpretation);
          }
          // _this.reasonDesc = _this.htmlToStr(_this.collInfo.collInterpretation);
          // _this.reasonDesc = 'lasdajshd最快速度回复可接受的福克斯在路上的飞机上都地方了就是大家放松的解放军收到货写好是技术的回复速度恢复快结束下拉框是灰色空间大家都灰色空间会发生等级划分只收到回 地方了就是大家放松的解放水电费水电费胜多负少交易根据韩国好几个各回各家公共机构控股和经济共和国公共机构';
          // 地方了就是大家放松的解放军收到货写好是技术的回复速度恢复快结束下拉框是灰色空间大家都灰色空间会发生等级划分只收到回 地方了就是大家放松的解放水电费水电费胜多负少交易根据韩国好几个各回各家公共机构控股和经济共和国公共机构
          // console.log(_this.reasonDesc)
        }
        _this.$refs.slider.update();
      })
      .catch(function(error){
        console.log(error);
      });
    },
    htmlToStr(val){
      return val.split("<br>").join("");
    },
    // 计算是否超过四行
    getRem () {
      // console.log('getRem');
      const defaultRem =22;
      let winWidth = window.innerWidth;
      // console.log('winWidth:' + winWidth);
      let rem = winWidth / 375 * defaultRem;
      return rem;
    },
  },
  watch: {
    'reasonDesc': function () {
      this.$nextTick(function () {
          console.log('nextTick');
          // 判断介绍是否超过四行
          let rem = parseFloat(this.getRem());
          console.log('watch 中的rem', rem);
          if (!this.$refs.desc) {
              console.log('desc null');
              return;
          }
          let descHeight = window.getComputedStyle(this.$refs.desc).height.replace('px', '');
          console.log('descHeight:' + descHeight);
          console.log('如果 descHeight 超过' + (3 * rem) + '就要显示展开按钮');
          if (descHeight >= 3 * rem) {
              // 超过了3行，显示展开收起按钮
              this.showExchangeButton = true;
              this.fold = true;
          } else {
              // 没有超过3行，直接显示全部描述，不显示按钮
              this.showExchangeButton = false;
          }
      }.bind(this));
    },
    $route(to,from){
      // console.log(">>>>>>>>>",to,from);
      // 如果从详情页回来表示已经学习过该商品,因为组件整个被keepAlive了,无法重新请求,所以监听路由遍历数据将其状态置为0
      if(from.path == "/goodsDetail2"){
        // console.log(from.query)
        // console.log(from.query.styleId)
        for(var i=0;i<this.goodsSingle.length;i++){
          if(this.goodsSingle[i].id == from.query.styleId){
            this.goodsSingle[i].leaFlag = '0';
          }
        }
      }
    },

  },
  mounted(){
    let _this = this;
    _this.getStyleInfo(_this.$route.query.collId);
  },
  updated(){
    this.initOrLoadScrollView();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../../assets/pageCss/styleDetail";

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
.spacing {
  height: 10px;
  background: #f8f8f8;
}
.wrap {
  padding: 14.5px 0;
}
.rec-coll-wrap{
  padding: 10px 0 14.5px 0;
  background:#FFF;
}


.head_img{
  position: relative;
}
.head_img_container{
  width: 10rem;
  overflow: hidden;
  background-color: pink;
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
  height:10rem;
  /* object-fit: cover; */
  object-fit: contain;

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

#styleMain{
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
  border-top:0.5px dotted #ccc;
  border-bottom:0.5px dotted #ccc;
}
/* .base_warp{
  border-top:none;
} */

.title_wrap>div{
  height:25px;
}

.title{
  color: #333333;
  font-size: 15px;
  display: flex;
  align-items: center;
}
.tit-dot{
  width: 8px;
  height: 8px;
  background: #00A2EA;
  border-radius: 50%;
  margin-right:10px;
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
  padding:0px 10px;
  font-size: 14px;
  background-color: #00A2EA;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  font-weight: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.more-btn{
  width:15px;
  height:14px;
}


.basic_info {
  display: flex;
  flex-direction:column;
  font-size: 14px;
}
.basic_info .row{
  display: flex;
  justify-content: space-around;
}
.basic_info .row:nth-child(1) .center{
  margin: 0;
}
.basic_info .row .center{
  width: 100%;
  margin-top: 15px;
  display: flex;
  padding:0px 10px;
  box-sizing: border-box;
}
.name{
  margin-left: 18.5px;
  color: #000000;
  letter-spacing: 5px;
}
.value {
  color: #999;
  margin-left: 15px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 1px;
}
.style_label{
  color: #00A2EA;
}
.header_one,.header_two{
  user-select: none; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;
}
</style>
