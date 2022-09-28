<template>
  <div id="tryCollocation">
    <div class="headClass" style="height: 1.4rem;">
      <Header :title="'试试这样搭'"></Header>
    </div>

    <div v-if="loadingFlag">
      <van-loading color="#00a2ea" />
    </div>
    <div v-else>
      <div class="try-collocation">

        <div class="this-clothes">
          <div class="this-style">
            <img :src="styleImgUrl" alt="">
            <div class="this-info">
              <div class="this-title">{{styleTitle}}</div>
              <span class="style-num">{{styleNo}}</span>
              <div class="this-desc"> <span></span>{{styleLabel}}</div>
              <!-- <div class="this-desc"> <span v-for="(item,i) in styleLabel" :key="i">{{item}}</span></div> -->
              <div class="price"><span class="symble">￥</span>{{stylePrice}}</div>
            </div>
          </div>
        </div>

        <div class="coll-tab">
          <div class="brandRec" :class="{active: activeTab == 1}" @click="changeActiveTab(1)">
            <span>品牌推荐</span>
          </div>
          <div class="beautyPhoto" :class="{active: activeTab == 2}" @click="changeActiveTab(2)">
            <span>店铺搭配</span>
          </div>
          <!-- <div class="addIcon" v-if="activeTab == 2" @click="addColl">+</div> -->
        </div>
        <Scroll
          v-show="activeTab == 1"
          class="collBody"
          ref="collBodyScroll"
          :probeType = '3'
          :bounceTime = "0"
          :listenScroll = 'true'
          :pullDown="false"
          :pullUp="false"
        >
          <div class="brandRecList">
            <div class="brandItem" v-for="(item,index) in tryCollArr" :key="index" >
              <img :src="item.imgUrl" alt="" @click="toStyleDetail(item.id)">
              <div class="collLabel">{{item.collName}}</div>

              <div class="coll-item" :ref="'collItemScroll'+(index+1)">
                <div class="inner-list clear">
                  <div class="inner-item fl" v-for="(item,index) in item.styleList" :key="index" @click="toGoodsDetail(item.id)">
                    <img :src="item.imgUrl" alt="">
                  </div>
                </div>
              </div>

              <!-- scroll嵌套scroll出错时的样式，之后要再找找原因 -->
              <!-- <Scroll
                class="collItemScroll"
                :ref="'collItemScroll'+(index+1)"
                :probeType='3'
                :scrollX='true'
                :scrollY='false'
                :autoUpdate="true"
                :pullDown="false"
                :pullUp="false">
                <div class="imgList">
                  <div class="imgBox" v-for="(item,index) in item.styleList" :key="index" >
                    <img :src="item.imgUrl" alt="" @click="toGoodsDetail(item.id)">
                  </div>
                </div>
              </Scroll> -->

            </div>
          </div>
          <loadAll></loadAll>
        </Scroll>

        <Scroll
          class="beautyList"
          v-show="activeTab == 2"
          ref="beautyList"
          :probeType = '3'
          :bounceTime = "0"
          :listenScroll = 'true'
          :pullDown="false"
          :pullUp="false"
        >
          <div class="beautyListBox">
            <!-- <h1>伙伴美拍</h1> -->
            <div class="beautyItem" v-for="(item,index) in beautyList" :key="index"  @click="toShopCollDetail(item.id)">
              <img :src="item.imgUrl" alt="">
              <div class="comment" v-if="item.collInterpretation">{{item.collInterpretation}}</div>
              <div class="comment" v-else>推荐理由推荐理由推荐理由推荐理由推荐理由</div>
              <div class="reviewerBox">
                <img v-if="item.headPortrait" class="avatar" :src="item.headPortrait" alt="">
                <img v-else class="avatar" src="static/images/default/avatarGirl.png" alt="">
                <span class="name">{{item.userName}}</span>
                <img class="praiseIcon" src="static/images/icon/praise-grey.png" alt="">
                <span class="num">{{item.aeNumber}}</span>
              </div>
            </div>
          </div>
          <loadAll></loadAll>
        </Scroll>

      </div>
     </div>
  </div>
</template>
<script>
import Header from '../../comps/header/header';
import loadAll from "../../comps/common/loadAll";
export default {
  name:"tryCollacation",
  components:{Header,loadAll},
  data(){
    return {
      styleId:'',
      styleNo:'',
      styleImgUrl:'',
      styleTitle:'',
      styleLabel:'',
      stylePrice:'',

      tryCollArr:[],
      loadingFlag:true,

      activeTab:1,   // 1 品牌搭配   2 伙伴美拍
    }
  },
  created(){
    this.styleId = this.$route.query.styleId;
  },
  mounted() {
    this.getCollInfo(this.styleId);
  },
  activated(){
    // // 为了解决灰色背景框的问题的一种方案,不起作用
    // this.$forceUpdate();
    // console.log(this.$route.query);
    if(this.$route.query.typeId){
      let typeId = this.$route.query.typeId;
      if(typeId == 1){
        this.activeTab = 1;
      }else if(typeId ==2){
        this.activeTab = 2;
      }

    }
    this.getCollInfo(this.styleId);
  },
  methods:{
    // 点击进行tab切换
    changeActiveTab(val){
      if(this.activeTab != val){
        this.activeTab = val
      }
    },

    getCollInfo(styleId){
      let _this = this;
      let param={
        id:styleId
      }
      _this.$axios.post("/api/style/getCollInfo",param).then(res=>{
        let data = res.data;
        if(data.code=="200"){
          _this.loadingFlag = false;
          // console.log("试试这样搭配搭配详细页数据为",res.data)
          _this.styleNo = data.data.styleNo;
          _this.styleImgUrl = data.data.imgUrls.split(",")[0];
          _this.styleTitle = data.data.styleName;
          _this.stylePrice = data.data.stylePrice;
          if(data.data.styleLabel!=null){
            _this.styleLabel = data.data.styleLabel;
            // _this.styleLabel = data.data.styleLabel.split(",");
          }
          _this.tryCollArr = data.data.collList;
          _this.beautyList = data.data.dpCollList;
          // console.log(_this.tryCollArr)
          _this.initCollsScroll();
        }
      }).catch(function(error){
        console.log(error);
      });
    },
    initCollsScroll(){
      let _this = this;
      _this.$nextTick(()=>{
        // 动态生成不确定搭配列表的滚动
        for(var i =1;i<=_this.tryCollArr.length;i++){
          var str = "collItemScroll"+i;
          // console.log(_this.$refs[str]);
          if(!_this[str]){
            _this[str] = new _this.$BScroll(_this.$refs[str][0],{
              scrollX:true,
              scrollY:false,
              useTransition:false,
            });
            // console.log(_this[str]);
          }else{
            _this[str].refresh();
          }
        }
      })
    },
    toStyleDetail(val){
      let _this = this;
      _this.$router.push({path:"/styleDetail",query:{"collId":val,stemp:new Date().getTime()}});
    },
    // 去店铺搭配详情页面
    toShopCollDetail(id){
      // console.log("去店铺搭配详情页面");
      this.$router.push({path:'/shopCollDetail',query:{ collId:id,collStatus:3,stemp:new Date().getTime()}})
    },
    toGoodsDetail(val){
      let _this = this;
      let route = {
        path:"/goodsDetail2",
        query:{
          styleId:val,
          stamp:new Date().getTime()
        }
      }
      _this.$router.push(route);
    },
    addColl(){
      this.$router.push({
        path:"/addCollocation"
      })

    }
  },

}
</script>

<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/tryCollocation";

.van-loading, .van-loading__spinner {

  vertical-align: middle;
}
.van-loading__spinner {
  width: 7.4rem;
  height: 1.4rem;
  position: relative;
  top:165px;
  left:50%;
  margin-left:-3.7rem;
}

</style>
