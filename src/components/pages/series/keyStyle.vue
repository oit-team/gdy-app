<template>
  <VueActions id="keyStylePage" data="keyStyle" @touchmove.prevent>
    <div class='header'>
      <div class="head_back" @click="back"><img src="static/images/dev/back@2x.png"></div>
      <span class="head_span">{{seasonName}}</span>
      <div></div>
    </div>



    <Scroll
      class="kindTitBox"
      ref="kindTitScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <!-- 滚动的内容 -->
      <ul class="kindTitUl" >
        <li
          class="kindTitItem"
          :class="[kindItem.bandName == bandName ?'active':'']"
          v-for="(kindItem,index) in bigList"
          v-actions:kindTitleTab.click
          :key="index"
          @click="clickKindItem(kindItem.bandName)">
          <span class="styleName">{{kindItem.bandName}}</span>
        </li>
      </ul>
    </Scroll>

    <Scroll
      class="kindTopBox"
      ref="kindTopScroll"
      :listenScroll='true'
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <!-- 滚动的内容 -->
      <ul class="scrollUl" >
        <li
          class="kindItem"
          :class="[item.id == activeId ?'active':'']"
          v-for="(item,index) in cateList"
          :key="index"
          v-actions:seriesNameTab.click
          @click="clickItem(item.id,item.seriesName)">
          <span class="styleName">{{item.seriesName}}</span>
        </li>
      </ul>
    </Scroll>

    <!-- <horizonScroll :horizonScroll = cateList
                  :activtedId = activeId
                  @func = "getKeyStyleList"></horizonScroll> -->

    <div v-if="!styleListFlag"><van-loading color="#00a2ea"  /></div>
    <Scroll
      v-if="styleListFlag"
      :update-data="[keyStyleData]"
      :refresh-data="[]"
      class="keyStyleCon"
      ref="keyStyleScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="keyStyleRefresh"
      @pullingUp="keyStyleLoadMore">
      <div>
        <div v-if="keyStyleData.length > 0" class="keyStyleDataBox ">
          <div class="clear">
            <div class="keyStyle-item fl"
              v-for="(item,index) in keyStyleData"
              :key="index"
              @click="goGoodDetail(item.id)">
              <div class="goods-img-box">
                <img class="goods-img" v-lazy="item.imgUrl" alt="" loaded @load="imgLoad">
                <!-- <img class="key-tip-img" v-if="item.styleFlag == 1"  src="../../../../static/images/icon/key_tip.png" alt=""> -->
                <div class="tipBox">
                  <img class="key-tip-img" v-if="item.styleFlag == 1" src="../../../../static/images/icon/tip.png" alt="">
                  <img class="learnIcon" v-if="item.leaFlag == 1"  src="../../../../static/images/icon/new.png" alt="">
                  <img class="videoIcon" v-if="item.videoFlag == 0"  src="../../../../static/images/icon/video.png" alt="">
                </div>
              </div>
              <div class="goods-num">{{item.styleNo}}</div>


              <div class="goods-stylePrice">
                <div class='money-symbel'>¥{{item.stylePrice}}</div>
                <!-- <div class="learnIcon" v-if="item.leaFlag == 1">
                  <van-icon  size="20" color="#00a4ed" name="new-arrival" />
                </div>
                <div class="lastIcon" v-if="item.videoFlag == 0 ">
                  <van-icon  size="18" color="#00a4ed" name="play-circle" />
                </div> -->
              </div>

            </div>
          </div>
          <div style="height:0.5px;background:transprant;"></div>
        </div>
        <div style="padding-top:0.5px;" v-else>
          <noGood></noGood>
        </div>

      </div>
    </Scroll>

  </VueActions>
</template>
<script>
import horizonScroll from "../../comps/common/horizonScroll";
import noGood from "../../comps/common/noGoods";
import loadAll from '../../comps/common/loadAll';

export default {
  name:"keyStyle",
  components:{ horizonScroll,noGood,loadAll},
  data(){
    return {
      keyStyleData:[],
      bandId:null,
      currentPage:1,
      pageSize:12,

      categoryName:null,   // 类别名称,对应的数据就是根据类别名称查出来的
      seasonName:null,
      bandName:null,     // 波段名,如对应的春二波
      activeId:null,     // 选中状态id,本来没有,之后加的,所以数据并不是根据id查找的

      keyScrollRefresh:false,  // 判断是否时滚动加载的标志,若不是,则需要清空数据,重新请求
      styleListFlag:false,    // 品类产品列表请求标志

      picCount:0,   // 页面图片个数计算
      keyStyleTotal:null,
      bigList:[],

    }
  },

  created(){
    console.log(this.$route.query);
    this.bigList = this.$route.query.bigList;
    this.cateList = this.$route.query.cateList;  // 动态传过来的数据
    this.activeId = this.$route.query.cateId;
    this.bandId = this.$route.query.bandId;
    this.categoryName = this.$route.query.categoryname;
    this.bandName = this.$route.query.bandName;
    this.seasonName = this.$route.query.seasonName;


    this.getKeyStyleList();
  },
  mounted(){
    // let el = document.querySelector(".scrollUl .active");
    // // console.log(el,"当前选中的元素","======",this.$refs.kindTopScroll)     // 获取当前滚动的元素并滚动到它的位置
    // this.$refs.kindTopScroll.scrollToElement(el,0,0)
    // // this.$refs.kindTopScroll.scrollToElement(el,500)
    setTimeout(()=>{
      let el = document.querySelector(".scrollUl .active");
      // console.log(this.$refs.kindTopScroll,'============',el)
      this.$refs.kindTopScroll.scrollToElement(el,500)

      let kindEl = document.querySelector(".kindTitUl .active");
      // console.log(this.$refs.kindTopScroll,'============',kindEl)
      this.$refs.kindTitScroll.scrollToElement(kindEl,500)

    },200)


  },
  updated(){

  },
  watch:{
    picCount:function(newV){
      if(document.querySelectorAll("img[loaded]").length<=(newV+6)){
        // this.initKeyStyle();
        this.$refs.keyStyleScroll.refresh();
      }
    },
    $route(to,from){
      // console.log(from.path);
      // 如果从详情页回来表示已经学习过该商品,因为组件整个被keepAlive了,无法重新请求,所以监听路由遍历数据将其状态置为0
      if(from.path == "/goodsDetail2"){
        // console.log(from.query)
        // console.log(from.query.styleId)
        for(var i=0;i<this.keyStyleData.length;i++){
          if(this.keyStyleData[i].id == from.query.styleId){
            this.keyStyleData[i].leaFlag = '0';
          }
        }
      }
    },
    activeId(newV,oldV){
      // console.log("00000000000000",newV,oldV)
      // 监听类别变化
      this.styleListFlag = false;
    }

  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    imgLoad(){
      this.picCount++;
    },
    getKeyStyleList(){
      // console.log("横向滚动子组件传过来的id值为:",data)
      // if(data){
      //   this.categoryName = data;
      // }
      // console.log(this.categoryName)
      // 根据传过来的id进行请求对应商品数据
      let _this =  this;
      let brandId = localStorage.brandId;
      let userId = localStorage.userId;
      let params = {
        "brandId":brandId,
        "bandId":this.bandId,   // 没数据
        "categoryName":this.categoryName,
        "userId":userId,
        "currentPage":this.currentPage,
        "pageSize":this.pageSize,
      }
      // console.log(params)
      _this.$axios.post("/api/series/getStyleList",params).then(function (res){
        let data = res.data;
         _this.styleListFlag = true;
        if(data.code=="200"){
          console.log("重点款页面获取的数据为,",data);
          // _this.keyStyleData = [];
          // _this.keyStyleTotal = 0;
          // // // 动态获取数据
          // if(!_this.keyScrollRefresh){
          //   _this.keyStyleData = [];
          // }
          if(_this.currentPage == 1){
            _this.keyStyleData = res.data.data.list;
          }else{
            _this.keyStyleData = _this.keyStyleData.concat(res.data.data.list);
          }
          _this.keyStyleTotal = data.data.total;

        }else{
          _this.$toast(data.data)
        }
      })
      .catch(function (error) {
        _this.$toast(error)
        console.log(error);
      });
    },
    keyStyleRefresh(){
      this.currentPage = 1;
      this.getKeyStyleList();
    },
    keyStyleLoadMore(){
      if(this.keyStyleData.length < this.keyStyleTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.currentPage++;
        this.getKeyStyleList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.keyStyleScroll.update(true)
      }
    },

    clickItem(id,seriesName){
      // console.log(id,seriesName)
      // this.keyStyleData = [];
      if(this.activeId != id){
        this.keyStyleData = [];
        this.styleListFlag = false;
        // console.log("不重复,重新请求");
        // this.keyScrollRefresh = false;
        // console.log(this.activeId , id)
        this.activeId = id;
        this.categoryName = seriesName;
        this.currentPage = 1;
        this.getKeyStyleList();
        if(this.activeId < id){
          this.$refs.kindTopScroll.scrollToElement(event.currentTarget,500);
        }else{
          if(!!event.currentTarget.previousElementSibling){
            this.$refs.kindTopScroll.scrollToElement(event.currentTarget.previousElementSibling,500);
          }else{
            this.$refs.kindTopScroll.scrollToElement(event.currentTarget,500);
          }
        }
      }else{
        // console.log("重复,不重新请求")
        this.activeId = id;
      }
    },
    // this.styleListFlag = false;
    clickKindItem(bandName){
      console.log(bandName);
      this.keyStyleData = [];
      this.styleListFlag = false;
      for( let i=0;i<this.bigList.length;i++){
        console.log(this.bandName , bandName)
        if(bandName == this.bigList[i].bandName){
          this.cateList = this.bigList[i].result;
          this.bandName = bandName;
          this.activeId = this.cateList[0].id;
          this.bandId = this.cateList[0].bandId;
          this.categoryName = this.cateList[0].seriesName;
          console.log(this.cateList)

          this.getKeyStyleList();
        }
      }

      setTimeout(()=>{
        let el = document.querySelector(".scrollUl .active");
        // console.log(this.$refs.kindTopScroll,'============',el)
        this.$refs.kindTopScroll.scrollToElement(el,500)
      },200)

    },
    goGoodDetail(id){
      this.$router.push({
        path:"/goodsDetail2",
        query:{
          styleId:id,
          stamp:new Date().getTime()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/keyStyle";


</style>
