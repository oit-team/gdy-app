<template>
  <!-- 添加搭配单品 -->
  <div id="searchSingle" @touchmove.prevent>
    <div class="hd_select">
      <img src = "static/images/dev/back@2x.png" @click="back">
      <div class="hd_input_wrap">
        <span class="icon select"></span>
        <form @submit.prevent action="javascript:return true" style="width:100%">
          <input @keyup.13="toSearch()" v-model="value"  type="search" ref="searchIpt" placeholder="商品款号、名称" >
        </form>
      </div>
      <div class="search" @click="toSearch()">搜索</div>
    </div>
    <div style="flex:1;overflow:hidden;" v-if="searchFlag"><van-loading color="#00a2ea"  /></div>
    <Scroll
      v-else
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
        <div class="keyStyle-item fl"
          v-for="(item,index) in searchList"
          :key="index"
          >
          <!-- @click="toGoods(item.id)" -->
          <div class="goods-img-box">
            <img class="goods-img" v-lazy="item.imgUrl" alt="">
            <div class="addIcon">
              <img v-if="item.choosed" @click.stop="delSingle(item)" src="static/images/icon/a-reduce.png" alt="">
              <img v-else @click.stop="addSingle(item)" src="static/images/icon/add1.png" alt="">
            </div>
          </div>
          <div class="goods-num">{{item.styleNo}}</div>
          <div class="goods-stylePrice">
            <div class='money-symbel'>¥{{item.stylePrice}}</div>
          </div>
        </div>
      </ul>
      <div class="noData" v-else>
        <noGood></noGood>
      </div>
    </Scroll>

    <div class="choosedBox">
      <div class="chooseNums" @click="viewChoosedSingle()">已选中：{{choosedList.length}}/5</div>
      <!-- <div class="conBtn viewBtn" >查看</div> -->
      <div class="conBtn" @click="conChoosedSingle()">确认</div>
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
  name: "searchSingle",
  components:{
    loadAll,
    noGood,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      value:"",
      defaultValue:'null',
      searchList:[],
      page:1,
      pageSize:12,
      isLoaded:true,
      isOver:false,
      resTotal:0,
      choosedList:[],
      show:false,
      searchFlag:true,
    };
  },
  mounted(){
    let _this = this;
    let val = localStorage.search==null?_this.$route.query.value:localStorage.search;
    _this.search(val);
  },
  updated(){
  },
  activated(){
    if(localStorage.singleList){
      this.choosedList = JSON.parse(localStorage.singleList);
    }
    this.page=1;
    this.searchFlag = true;
    this.searchList = [];
    this.search();
    this.changfouce();
  },
  // 自定义指令 v-focus 使input聚焦，能聚焦，效果不对，所以选择另外一种方法this.changfouce()
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods:{
    changfouce(){
      setTimeout(()=>{
        this.$refs.searchIpt.focus();
      },800)
    },
    loadedImg(){
    },
    back(){
      this.$router.go(-1);
      localStorage.removeItem("search");
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
          for(let i=0;i<this.searchList.length;i++){
            if(item.id == this.searchList[i].id){
              this.searchList[i].choosed = true
            }
          }
          this.choosedList.push(item);
        }
      }else{
        this.$toast("最多只能选择5件单品")
      }
      localStorage.singleList = JSON.stringify(this.choosedList);
      // console.log("this.choosedList=====",this.choosedList)
    },
    // 查看所选单品，以弹出框的形式，要考虑到可删除操作
    viewChoosedSingle(){
      // console.log("查看所选单品");
      if(this.choosedList.length>0){
        this.show = true
      }else{
        this.$toast("您还未选择单品")
      }
    },
    // 删除单品
    delSingle(item){
      // console.log("删除item===",item,item.id)
      for(let i=0;i<this.choosedList.length;i++){
        if(this.choosedList[i].id == item.id){
          // console.log(this.choosedList[i].id , item.id)
          this.choosedList.splice(i, 1);
          if(this.choosedList.length==0){
            this.show = false
          }
          for(let i=0;i<this.searchList.length;i++){
            if(item.id == this.searchList[i].id){
              this.searchList[i].choosed = false;
            }
          }
          break
        }
      }
      localStorage.singleList = JSON.stringify(this.choosedList);
      // console.log("删除后的this.choosedList=====",this.choosedList)
    },
    // 确认所选单品并返回到添加搭配页面
    conChoosedSingle(){
      // console.log("确认所选单品");
      if(this.choosedList.length==0){
        this.$toast("您还未选择搭配单品")
      }else{
        this.$router.push({
          path:'/addCollocation',
          query:{
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

    toSearch(val){
      this.page=1;
      this.$refs.searchIpt.blur();
      this.searchList = [];
      this.search(val);
    },
    search(val){
      let _this = this;
      _this.value = _this.value.replace(/\s*/g,"");
      if(_this.value==""){
        // _this.value = 'null';
        _this.defaultValue = 'null';
      }else{
        _this.defaultValue = _this.value;
      }
      // if(_this.page==1){
      //   util.loading();
      // }
      _this.$axios.get("/api/style/search/"+_this.defaultValue+"?currentPage="+_this.page+"&pageSize="+_this.pageSize+"&brandId="+localStorage.brandId).then(function(res){
        let data = res.data;
        _this.searchFlag = false;
        // console.log(data);
        // _this.changfouce();
        if(data.code=="200"){
          _this.resTotal = data.data.total;
          if(_this.page==1){
            _this.searchList = data.data.list;
          }else{
            _this.searchList = _this.searchList.concat(data.data.list);
          }
          // console.log(_this.choosedList)

          for(let i=0;i<_this.searchList.length;i++){
            _this.$set(_this.searchList[i], 'choosed',false);
          }
          if(_this.choosedList.length>0){
            for(let i=0;i<_this.choosedList.length;i++){
              for(let j=0;j<_this.searchList.length;j++){
                if(_this.choosedList[i].id == _this.searchList[j].id){
                  // console.log("上个页面有参数传递过来",_this.searchList[j].id , _this.choosedList[i].id)
                  _this.searchList[j].choosed = true;
                }
              }
            }
          }

          // console.log("商品列表===",_this.searchList)
        }
      }).catch(function(error){
        console.log(error);
      });
    },
    // 搭配的上拉下拉
    rescollRefresh(){
      this.page = 1;
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
@import "../../../assets/workCss/searchSingle.less";

</style>
