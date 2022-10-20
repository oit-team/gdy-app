<template>
  <VueActions id="myCollocation" data="myCollocation">
    <div class="headBox">
      <backHeader style="background-color: #f5f5f5;" title="我要搭配">
        <span slot="left" class="head-class f-l" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span slot="right" class="head-class place-label" @click="toAddColl" v-actions:addCollocation.click>
          <slot>
            <img class="add-icon" src="static/images/icon/addColl.png" alt="">
          </slot>
        </span>
      </backHeader>
    </div>
    <div class="tabBox">
      <div v-for="(item,index) in tabList"
        :key="index"
        class="tabItem"
        :class="collStatus == item.status?'active':''"
        @click="clickTab(item.status)"
        v-actions:myCollTab.click>
        <span>{{item.statusName}}</span>
        <span>({{item.count}})</span>
        </div>
    </div>
    <div style="height:3px;background-color: #f5f5f5;"></div>


    <div v-if="collLoading == true" key="1">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      v-else
      ref="collBodyScroll"
      class="collBody"
      :update-data="[collList]"
      :refresh-data="[]"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="collRefresh"
      @pullingUp="collLoadMore"
      key="2"
      >

      <div v-if="collList.length > 0" class="collListBox">
        <div v-for="(item,index) in collList" :key="index" class="itemBox" @click="toCollDetail(item.id,item)" v-actions:collList.click>
          <van-swipe-cell>
            <div class="collItem">
              <img class="collImg" :src="item.imgUrl" alt="">
              <div class="detail">
                <div class="collDesc">{{item.collInterpretation}}</div>
                <div class="fitBox">
                  <span v-for="(item,index) in item.occaVal" :key="index">{{item}}</span>
                </div>
                <div class="otherBox">
                  <span class="time">{{item.createDate}}</span>
                  <span v-if="item.aeNumber" class="praiseBox"><img class="praiseIcon" src="static/images/icon/praise-grey.png" alt="">&nbsp;<span class="praiseNum">{{item.aeNumber}}</span></span>
                </div>
              </div>
            </div>

            <template v-if="collStatus != 1" slot="right">
              <van-button v-if="collStatus != 3" square type="primary" text="编辑" @click="editColl(item.id)"  v-actions:editColl.click/>
              <van-button square type="danger" text="删除" @click="deleteColl(item.id,index)"  v-actions:delColl.click/>
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <div v-else style="padding-top:0.5px;">
        <noGood></noGood>
      </div>
    </Scroll>

  </VueActions>
</template>
<script>
import { Dialog } from 'vant';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'myCollocation',
  components:{ Header , backHeader ,noGood },
  data(){
    return {
      collStatus:0,
      tabList:[],
      totalNum:0,
      collLoading:true,
      collList:[],
      collTotal:0,
      currentPage:1,
      pageSize:8,
      suitOccaList:[],   // 适用场景列表

      fromAddColl:false,
    }
  },
  beforeRouteEnter(to, from, next) {
    // console.log("--enter----",to,from)
    if(from.path == "/addCollocation"){
      next(vm => {
        vm.fromAddColl = true
      })

    }
    next();
  },
  created(){
    this.getShopCollStatus();
    this.getSuitList();
  },
  mounted(){

    this.getCollList();
  },
  activated(){
    localStorage.removeItem("activeSuitList");
    localStorage.removeItem("singleList");
    localStorage.removeItem("recommentReasonVal");
    localStorage.removeItem("collImgListArr");
    localStorage.removeItem("shopCollId");

    this.getShopCollStatus();
  },
  methods:{
    back(){
      this.$router.push({
        path:'/index',
        query:{
          stamp:new Date().getTime()
        }
      })
    },
    // 获取适用场景列表
    getSuitList(){
      let _this = this;
      let data = {
        "brandId": localStorage.brandId,
        "dType": 3,
        "classification":1
      }
      // debugger
      _this.$axios.post("/api/dic/queryDicList",data).then(function (res){
        if(res.data.code == 200){
          _this.suitOccaList = res.data.data;
          // console.log("适用场景列表为:",_this.suitOccaList);
        }
      }).catch(function (error) {
        console.log(error);
        _this.$toast("请求失败--获取适用列表！");
      });
    },

    dealFitOcca(fitOccasion){
      let occaValArr = [];
      if(fitOccasion){
        let curOccasion = fitOccasion.split(",");
        for(let i=0;i<curOccasion.length;i++){
          if(curOccasion[i]){
            curOccasion[i] = Number(curOccasion[i])
          }
        }
        for(let i=0;i<curOccasion.length;i++){
          if(!curOccasion[i]){
            curOccasion.splice(i,1);
          }
        }
        // console.log("处理后curOccasion",curOccasion);

        if(curOccasion.length>0){
          for(let i=0;i<curOccasion.length;i++){
            for(let j=0;j<this.suitOccaList.length;j++){
              if(curOccasion[i] == this.suitOccaList[j].id ){
                occaValArr.push(this.suitOccaList[j].fitOccasionName)
              }
            }
          }
        }
      }
      // console.log("occaValArr",occaValArr)
      return occaValArr;
    },

    // 编辑搭配
    editColl(id){
      // console.log("编辑搭配id===",id);
      this.$router.push({
        path:"/addCollocation",
        query:{
          collId:id,
          editFlag:true,
          collStatus:this.collStatus,
          stamp:new Date().getTime()
        }
      })
    },
    // 删除搭配
    deleteColl(id,index){
      // console.log("删除搭配id===",id,index);
      Dialog.confirm({
        title: '提示',
        message: '确认删除该搭配吗？',
      }).then(() => {
        // on confirm
        let _this=this;
        let params = {
          "collId": id
        }
        _this.$axios.post("/api/coll/delColl",params).then(function (res){
          // console.log("请求搭配列表")
          _this.collList.splice(index,1);
          _this.getShopCollStatus();
        }).catch(function (error) {
          console.log(error);
        });
      }).catch(() => {
        // on cancel
      });
    },
    toAddColl(){
      this.$router.push({path:'/addCollocation'})
    },
    clickTab(id){
      this.collStatus = id;
      this.currentPage = 1;
      this.collList = [];
      this.collLoading = true;
      this.getCollList();

    },
    // 去我要搭配详情页面
    toCollDetail(id,item){
      // console.log("搭配详情=====",id,item)
      // this.$router.push({path:'/shopCollDetail',query:{ collId:1950,stamp:new Date().getTime()}})
      this.$router.push({path:'/shopCollDetail',query:{ collId:id,collStatus:this.collStatus,collInfo:item,stamp:new Date().getTime()}})
    },
    // 获取店铺搭配各种状态
    getShopCollStatus(){
      let _this=this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId": brandId,
        "userId":localStorage.userId,
      }
      _this.$axios.post("/api/coll/getShopCollStatus",params).then(function (res){
        // console.log("获取店铺搭配各种状态====", res.data)
        let data = res.data;
        if(data.code=="200"){
          _this.tabList = res.data.data;
        }else{
          _this.$toast(res.data.message)
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    getCollList(){
      let _this=this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId": brandId,
        "sId": -1,
        "modeId": -1,
        "seasonId": -1,
        "seriesId": -1,
        "styleName": "",
        "currentPage": _this.currentPage,
        "pageSize": _this.pageSize,
        "type":"2",  // 1：品牌搭配  2：店铺搭配
        "userId":localStorage.userId,
        "status":_this.collStatus    // 1：已发布, 2：审批拒绝, 3:   未审核  0:已保存
      }
      _this.$axios.post("/api/coll/collList",params).then(function (res){
        // console.log("请求搭配列表")
        let data = res.data;
        _this.collLoading = false;

        if(data.code=="200"){
          // console.log("筛选出的搭配列表为",data.data)
          _this.collTotal = data.data.total;
          if(_this.currentPage == 1){
            _this.collList = data.data.list;
          }else{
            _this.collList = _this.collList.concat(data.data.list);
          }

          for(let i=0;i<_this.collList.length;i++){
            let occaVal = _this.dealFitOcca(_this.collList[i].fitOccasion);
            _this.$set(_this.collList[i], 'occaVal',occaVal);
          }
        }

      }).catch(function (error) {
        console.log(error);
      });
    },
    collRefresh(){
      this.currentPage = 1;
      this.getShopCollStatus();
      this.getCollList();
    },
    collLoadMore(){
      if(this.collList.length < this.collTotal){
        // console.log(this.collocationList.length , this.collTotal)
        this.currentPage++;
        this.getCollList();
      }else{
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.collBodyScroll.update(true)
      }
    },

  }
}
</script>
<style lang="less" scoped>
#myCollocation{
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .headBox{
    height: 1.4rem;
  }
  .tabBox{
    display: flex;
    // align-items: center;
    justify-content: space-around;
    height: 45px;
    line-height: 45px;
    // background-color: #ccc;
    // border:0.5px solid #ccc;
    .tabItem{
      font-size: 14px;
      height:38px;
    }
    .tabItem.active{
      color:#1978FE;
      font-size: 16px;
      border-bottom:2px solid #1978FE;
    }
  }
  .collBody{
    flex:1;
    overflow: hidden;
    background-color: #f5f5f5;
    // padding-left:10px;
    // padding:7px 0px;
    box-sizing: border-box;

    .collListBox{
      width:100%;
      height: 100%;
      .itemBox{
        width:100%;
        background-color: #fff;
        padding:12px 0px;
        // border:0.5px solid #f3f3f3;
        margin-bottom: 6px;
        .collItem{
          display: flex;
          // padding:12px 0px;
          align-items: center;
          box-sizing: border-box;
          position: relative;
          height: 80px;
          .collImg{
            position: absolute;
            top:0;
            left:0;
            margin-left:12px;
            width:80px;
            height:80px;
            display: block;
            object-fit: contain;
          }
          .detail{
            width:100%;
            box-sizing: border-box;
            // flex:1;
            // margin-right:12px;
            // margin-left:6px;
            padding-left:100px;
            font-size:14px;
            color:#666;
            // background-color: pink;
            .collDesc{
              width:100%;
              line-height: 20px;
              // height: 40px;
              text-align: justify;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color:#000;
              font-size: 16px;
            }
            .fitBox{
              // line-height: 24px;
              color:#1978FE;
              // color:#666;
              // line-height: 30px;
              span{
                display: inline-block;
                background-color: #4b93f8;
                color:#fff;
                padding:3px 8px;
                margin:5px 0px;
                border-radius: 5px;
                margin-right:5px;
                font-size: 12px;
                line-height: 12px;
              }
            }
            .otherBox{
              display: flex;
              align-items: center;

              .praiseBox{
                .praiseIcon{
                  width:13px;
                  margin-left:50px;
                }

              }
            }
          }

        }
        .van-swipe-cell__right{
          width:40px;
          height:100%;
          box-sizing: border-box;
        }
        .van-button--normal {
          // padding: 0 20px;
          font-size: 15px;
        }
        .van-button--danger {
          width:48px;
          color: #fff;
          height:100%;
          background-color: #ec4753;
          border: none;
        }
        .van-button--primary {
          width:50px;
          color: #fff;
          height:100%;
          background-color: #1978FE;
          border: none;
        }
      }
    }
  }
}

</style>
