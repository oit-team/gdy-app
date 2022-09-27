<template>
  <!-- 添加搭配单品 -->
  <div id="addSingle" @touchmove.prevent>
    <div class="hd_select">
      <img src = "static/images/dev/back@2x.png" @click="back">
      <div class="hd_input_wrap"  @click="iptfocus()">
        <span style="color:#777;font-size:6.5px;">商品款号、名称</span>

        <!-- <span class="icon select"></span>
        <form @submit.prevent action="javascript:return true" style="width:100%">
          <input @focus="iptfocus()" readonly type="search" ref="search" placeholder="商品款号、名称" >
        </form> -->
      </div>
      <div class="search" @click="iptfocus()">搜索</div>
    </div>

    <Scroll
      ref="kindTitScroll"
      class="kindTitBox"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <ul class="kindTitUl">
        <li
          v-for="(kindItem,index) in seasonList"
          :key="index"
          class="kindTitItem"
          :class="[kindItem.id == activeSeasonId ?'active':'']"
          @click="clickKindItem(kindItem)">
          <span class="styleName">{{kindItem.fitOccasionName}}</span>
        </li>
      </ul>
    </Scroll>

    <Scroll
      ref="kindTopScroll"
      class="kindTopBox"
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
          v-for="(item,index) in seriesList"
          :key="index"
          class="kindItem"
          :class="[item.id == activeSeriesId ?'active':'']"
          @click="clickItem(item.id,item.seriesName)">
          <span class="styleName">{{item.seriesName}}</span>
        </li>
      </ul>
    </Scroll>

    <!-- <Scroll
      :update-data="[searchList]"
      :refresh-data="[]"
      class="searchResBody"
      ref="searchResScroll"
      :probeType = '3'
      :listenScroll='true'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="rescollRefresh"
      @pullingUp="rescollLoadMore">
      <ul class="recommended" v-if="searchList.length>0">
        <li v-for="(item, key) in searchList" :key="key" class="rec_item" @click="toGoods(item.id)">
          <img class="proImg" width="100%" :src="item.imgUrl" alt="" @load="loadedImg()">
          <div class="baseBox">
            <div class="name">{{item.styleName}}</div>
            <p class="rec_bottom"><span class="price"><i style="">¥</i>{{item.stylePrice}}</span></p>
          </div>
          <div class="addBox" @click.stop="addSingle(item)">+</div>
        </li>
      </ul>
      <div class="noData" v-else>
        <noGood></noGood>
      </div>
    </Scroll> -->

    <div v-if="styleListFlag" style="flex:1;overflow:hidden;"><van-loading color="#00a2ea"  /></div>
    <Scroll
      v-else
      ref="keyStyleScroll"
      class="keyStyleCon"
      :update-data="[styleList]"
      :refresh-data="[]"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="keyStyleRefresh"
      @pullingUp="keyStyleLoadMore">
      <div>
        <div v-if="styleList.length > 0" class="keyStyleDataBox ">
          <div class="clear">
            <div v-for="(item,index) in styleList"
              :key="index"
              class="keyStyle-item fl"
              >
              <!-- @click="goGoodDetail(item.id)" -->
              <div class="goods-img-box">
                <img v-lazy="item.imgUrl" class="goods-img" alt="" >
                <div class="tipBox">
                  <img v-if="item.styleFlag == 1" class="key-tip-img" src="../../../../static/images/icon/tip.png" alt="">
                  <img v-if="item.leaFlag == 1" class="learnIcon"  src="../../../../static/images/icon/new.png" alt="">
                  <img v-if="item.videoFlag == 0" class="videoIcon"  src="../../../../static/images/icon/video.png" alt="">
                </div>
                <div class="addIcon">
                  <img v-if="item.choosed" src="static/images/icon/a-reduce.png" alt="" @click.stop="delSingle(item)">
                  <img v-else src="static/images/icon/add1.png" alt="" @click.stop="addSingle(item)">
                </div>
              </div>
              <div class="goods-num">{{item.styleNo}}</div>

              <div class="goods-stylePrice">
                <div class='money-symbel'>¥{{item.stylePrice}}</div>
              </div>

            </div>
          </div>
          <div style="height:0.5px;background:transprant;"></div>
        </div>
        <div v-else style="padding-top:0.5px;">
          <noGood></noGood>
        </div>

      </div>
    </Scroll>

    <div class="choosedBox">
      <div class="chooseNums" @click="viewChoosedSingle">已选中：{{choosedList.length}}/5</div>
      <!-- <div class="conBtn viewBtn" >查看</div> -->
      <div class="conBtn" @click="conChoosedSingle">确认</div>
    </div>

    <van-popup v-model="show" position="bottom">
      <ul class="ulList">
        <!-- @click="toGoods(item.id)" -->
        <li v-for="(item,index) in choosedList" :key="index" >
          <img :src="item.imgUrl" alt="">
          <div class="baseInfo">
            <div class="styleName">{{item.styleName}}</div>
            <div class="styleNo">{{item.styleNo}}</div>
            <div  style="color:rgba(184, 5, 2, 1);">￥<span>{{item.stylePrice}}</span></div>
          </div>
          <div class="delBtn" @click.stop="delSingle(item)">删除</div>
        </li>
      </ul>
    </van-popup>

  </div>
</template>

<script>
import util from '@/assets/js/util.js';
import loadAll from '../../comps/common/loadAll';
import noGood from "../../comps/common/noGoods";
import { Dialog } from 'vant';

export default {
  name: "",
  components:{
    loadAll,
    noGood,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      value:"",
      defaultValue:"毛衣",
      searchList:[{}],
      page:1,
      pageSize:8,
      isLoaded:true,
      isOver:false,
      resTotal:0,
      choosedList:[],
      show:false,

      activeSeasonId:null,
      seasonList:[],
      activeSeriesId:null,
      seriesList:[],
      currentPage:1,
      pageSize:12,
      styleListFlag:true,
      styleList:[],
      styleTotal:0,

    };
  },
  created(){

  },
  mounted(){
    let _this = this;
    this.getSeasonList();
  },
  updated(){
  },
  activated(){
    // console.log("add   query======",this.$route.query)
    // if(this.$route.query.choosedList){
    //   console.log("this.$route.query.choosedList----",this.$route.query.choosedList);
    //   this.choosedList = this.$route.query.choosedList;
    // }
    if(localStorage.singleList){
      this.choosedList = JSON.parse(localStorage.singleList);
    }
    //  this.getSeasonList();
    for(let i=0;i<this.styleList.length;i++){
      this.styleList[i].choosed = false;
    }
    if(this.choosedList.length>0){
      for(let i=0;i<this.choosedList.length;i++){
        for(let j=0;j<this.styleList.length;j++){
          // console.log(_this.choosedList[i].id , _this.styleList[j].id)
          if(this.choosedList[i].id == this.styleList[j].id){
          //   console.log("上个页面有参数传递过来",_this.searchList[j].id , _this.choosedList[i].id)
            this.styleList[j].choosed = true;
            break;
          }
        }
      }
    }
  },
  methods:{
    back(){
      this.$router.go(-1);
      localStorage.removeItem("search");
      // 点击返回要把之前所选的单品都给清除掉
      if(this.choosedList.length>0){
        this.choosedList = []
      }
    },
    goGoodDetail(id){
      this.$router.push({
        path:"/goodsDetail2",
        query:{
          styleId:id,
          stamp:new Date().getTime()
        }
      })
    },
    loadedImg(){},
    // 聚焦跳转搜索单品页面
    iptfocus(){
      this.$router.push({
        path:"/searchSingle",
        query:{
          stamp:new Date().getTime()
        }
      })

      // this.$router.push({
      //   path:'/searchSingle',
      //   query:{
      //     choosedList:this.choosedList,
      //     recommentReason:this.$route.query.recommentReason,
      //     activeSuit:this.$route.query.activeSuit,
      //     collImgList:this.$route.query.collImgList,
      //     tempImgList:this.$route.query.tempImgList,
      //     collId:this.$route.query.collId,

      //     // upImgList:this.$route.query.upImgList,
      //   }
      // })
    },
    // 获取季节列表
    getSeasonList(){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":1
      }
      _this.$axios.post("/api/dic/normalList",params).then(function (res){
        let data = res.data;
        if(data.code=="200"){
          // console.log("商品页面获取的seasonlist为,",data);
          _this.seasonList = data.data;
          _this.activeSeasonId = data.data[0].id;
          // console.log("_this.activeSeasonId",_this.activeSeasonId)
          _this.getSeriesList();
        }
      }).catch(function (error) {
          console.log(error);
      });
    },
    clickKindItem(item){
      // console.log(item);
      if(this.activeSeasonId != item.id){
        this.activeSeasonId = item.id;
        this.getSeriesList();
      }
      // setTimeout(()=>{
      //   let el = document.querySelector(".scrollUl .active");
      //   // console.log(this.$refs.kindTopScroll,'============',el)
      //   this.$refs.kindTopScroll.scrollToElement(el,500)
      // },200)
    },
    getSeriesList(){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "sId":_this.activeSeasonId
      }
      _this.$axios.post("/api/series/getSeriesListById",params).then(function (res){
        let data = res.data;
        if(data.code=="200"){
          // console.log("根据季节ID获取系列列表,====",data);
          _this.seriesList = data.data;
          _this.activeSeriesId = data.data[0].id;
          _this.styleList = [];
          _this.styleListFlag = true;
          _this.getStylesList()
        }
      }).catch(function (error) {
          console.log(error);
      });

    },
    clickItem(id,seriesName){
      // console.log(id,seriesName)
      // this.keyStyleData = [];
      if(this.activeSeriesId != id){
        this.activeSeriesId = id;
        this.currentPage = 1;
        this.styleList = [];
        this.styleListFlag = true;
        this.getStylesList();
        if(this.activeSeriesId < id){
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
        this.activeSeriesId = id;
      }
    },
    // 根据季节id和系列id获取单品列表
    getStylesList(){
      // console.log(this.currentPage,this.pageSize)
      let _this =  this;
      let brandId = localStorage.brandId;
      let userId = localStorage.userId;
      let params = {
        "brandId":brandId,
        "bandId":null,  // 波段id ,eg:冬二波
        "sid":_this.activeSeriesId,    // 系列id
        "userId":userId,
        "currentPage":this.currentPage,
        "pageSize":this.pageSize,
      }
      _this.$axios.post("/api/series/getStyleList",params).then(function (res){
        let data = res.data;
        _this.styleListFlag = false;
        if(data.code=="200"){
          // console.log("根据季节id和系列id获取单品列表",data,data.list);
          _this.styleTotal = data.data.total;
          if(_this.currentPage == 1){
            _this.styleList = data.data.list;
          }else{
            _this.styleList = _this.styleList.concat(data.data.list);
          }
          for(let i=0;i<_this.styleList.length;i++){
            _this.$set(_this.styleList[i], 'choosed',false);
          }
          if(_this.choosedList.length>0){
            for(let i=0;i<_this.choosedList.length;i++){
              for(let j=0;j<_this.styleList.length;j++){
                // console.log(_this.choosedList[i].id , _this.styleList[j].id)
                if(_this.choosedList[i].id == _this.styleList[j].id){
                //   console.log("上个页面有参数传递过来",_this.searchList[j].id , _this.choosedList[i].id)
                  _this.styleList[j].choosed = true;
                  break;
                }
              }
            }
          }

        }else{
          _this.$toast(data.data)
        }
      }).catch(function (error) {
        // debugger
        _this.$toast(error)
      });
    },

    keyStyleRefresh(){
      this.currentPage = 1;
      this.getStylesList();
    },
    keyStyleLoadMore(){
      if(this.styleList.length < this.styleTotal){
        this.currentPage++;
        this.getStylesList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.keyStyleScroll.update(true)
      }
    },


    addSingle(item){
      if(this.choosedList.length<5){
        // console.log("选择搭配单品的item====",item);
        let isExist = false;
        for(let i=0;i<this.choosedList.length;i++){
          if(this.choosedList[i].id == item.id){
            isExist = true;
            break
          }
        }
        if(isExist){
          this.$toast("该单品已存在")
        }else{
          for(let i=0;i<this.styleList.length;i++){
            if(item.id == this.styleList[i].id){
              this.styleList[i].choosed = true
            }
          }
          this.choosedList.push(item)
        }
      }else{
        this.$toast("最多只能选择5件单品")
      }
      localStorage.singleList = JSON.stringify(this.choosedList);
    },
    // 查看所选单品，以弹出框的形式，要考虑到可删除操作
    viewChoosedSingle(){
      if(this.choosedList.length>0){
        this.show = true
      }else{
        this.$toast("您还未选择单品")
      }
    },
    // 删除单品
    delSingle(item){
      for(let i=0;i<this.choosedList.length;i++){
        if(this.choosedList[i].id == item.id){
          this.choosedList.splice(i, 1);
          if(this.choosedList.length==0){
            this.show = false
          }
          for(let i=0;i<this.styleList.length;i++){
            if(item.id == this.styleList[i].id){
              this.styleList[i].choosed = false;
            }
          }
          break
        }
      }
      localStorage.singleList = JSON.stringify(this.choosedList);
    },
    // 确认所选单品并返回到添加搭配页面
    conChoosedSingle(){
      if(this.choosedList.length==0){
        this.$toast("您还未选择搭配单品")
      }else{
        this.$router.push({
        // this.$router.replace({
          path:'/addCollocation',
          params:{
            choosedList:this.choosedList,
            recommentReason:this.$route.query.recommentReason,
            activeSuit:this.$route.query.activeSuit,
            collImgList:this.$route.query.collImgList,
            tempImgList:this.$route.query.tempImgList,
            collId:this.$route.query.collId,

            // upImgList:this.$route.query.upImgList,
          }
        })
      }

    },

    search(val){
      let _this = this;
      if(_this.value==""){
        _this.value =  _this.defaultValue;
      }
      if(_this.page==1){
        util.loading();
      }
      _this.$axios.get("/api/style/search/"+_this.value+"?currentPage="+_this.page+"&pageSize="+_this.pageSize+"&brandId="+localStorage.brandId).then(function(res){
        let data = res.data;
        if(data.code=="200"){
          if(_this.page==1){
            _this.searchList = data.data.list;
          }else{
            _this.searchList = _this.searchList.concat(data.data.list);
          }
          _this.resTotal = data.data.total;
        }
      }).catch(function(error){
        console.log(error);
      });
    },
    // 搭配的上拉下拉
    rescollRefresh(){
      this.page = 1;
      this.searchList = [];
      this.search();
    },
    rescollLoadMore(){
      if(this.searchList.length < this.resTotal){
        this.page++;
        this.search();
      }else{
        this.$refs.searchResScroll.update(true)
      }
    },
    toGoods(id){
      let _this = this;
      let route = {
        path:"/goodsDetail2",
        query:{
          styleId:id,
          stamp:new Date().getTime()
        }
      };
      localStorage.search = _this.value;
      _this.$router.push(route);
    }
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../../assets/workCss/addSingle.less";

</style>
