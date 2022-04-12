<template>
  <div id="newsPage">
    <div class="headBox">
      <backHeader title="消息">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>

    <div class="tabBox">
      <div class="tabItem"
        v-for="(item,index) in newsType"
        :key="index"
        @click="clickTab(item.type)"
        :class="activeType == item.type?'active':''">
        <span>{{item.msgTypeRemark}}</span>
        <span>({{item.count}})</span>
      </div>
    </div>
    <div v-if="newsLoading == true">
      <van-loading color="#00a2ea"  />
    </div>
    <Scroll
      :update-data="[msgList]"
      :refresh-data="[]"
      class="newsConBox"
      ref="newsConScroll"
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      @pullingDown="newsRefresh"
      @pullingUp="newsLoadMore">

      <div class='msgList' v-if="msgList.length>0">
        <div  v-for="(item,index) in msgList" :key='index' @click="toNewsDetail(item)">

          <van-swipe-cell>
            <div class="newsItem">
              <div class="newsIcon">
                <img v-if="item.isRead" src="static/images/icon/read-no.png" alt="">
                <img v-else src="static/images/icon/readed.png" alt="">
              </div>
              <div class="msgBrief">
                <!-- {{item.content}} -->
                <div class="inner" v-html="item.content"></div>
                <div class="time">{{item.createDate}}</div>
              </div>
            </div>
            <!-- 0 审批消息   1 总部消息     2 系统消息 -->
            <template slot="right" v-if="activeType != 1 && activeType != 2">
              <van-button square type="danger" text="删除" @click="deleteMsg(item.id,index)"/>
            </template>
          </van-swipe-cell>

        </div>
      </div>
      <div style="padding-top:0.5px;" v-else>
        <noGood></noGood>
      </div>

    </Scroll>
  </div>
</template>

<script>
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
import { Dialog } from 'vant';
export default {
  name:"newsPage",
  components:{backHeader,noGood},
  data(){
    return {
      newsType:[],
      activeType:2,
      currentPage:1,
      pageSize:10,
      msgList:[],
      newsTotal:0,
      newsLoading:false,

    }
  },
  created(){},
  mounted(){
    this.getNewsType();
    this.getNewsList();
  },
  activated(){
    this.getNewsType();
  },
  watch:{
    $route(to,from){
      if(from.path == "/msgDetail"){
        // console.log(from.query.id)
        for(var i=0;i<this.msgList.length;i++){
          if(this.msgList[i].id == from.query.msg.id){
            // console.log(localStorage.collection)
            this.msgList[i].isRead = 1;
          }
        }
      }
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    // 获取消息类型及数量
    getNewsType(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "brandId":localStorage.brandId, // 品牌id
        "userId":localStorage.userId,
      }
      _this.$axios.post("/api/msg/getMsgTypes",data).then(function (res){
        let data = res.data;
        // console.log("获取消息类型===",data)
        if(data.code=="200"){
          _this.newsType = data.data.data;
        }else{
          _this.$toast("请求失败！");
        }
      }).catch(function (error) {
        console.log(error);
        _this.$toast("请求失败！");
      });
    },
    clickTab(type){
      this.activeType = type;
      this.currentPage = 1;
      this.msgList = [];
      this.newsLoading = true;
      this.getNewsList();

    },

    // 获取消息列表
    getNewsList(){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "brandId":localStorage.brandId, // 品牌id
        "userId":localStorage.userId,
        "currentPage":_this.currentPage,
        "pageSize":_this.pageSize,
        'type': _this.activeType
      }
      _this.$axios.post("/api/msg/getMsgList",data).then(function (res){
        _this.newsLoading = false;
        let data = res.data;
        // console.log("获取消息列表===",data)
        if(data.code=="200"){
          _this.newsTotal = data.data.total;
          if(_this.currentPage == 1){
            _this.msgList = data.data.list;
          }else{
            _this.msgList = _this.msgList.concat(data.data.list);
          }

        }else{
          _this.$toast("请求失败！");
        }
      }).catch(function (error) {
        console.log(error);
        _this.$toast("请求失败！");
      });
    },
    newsRefresh(){
      this.currentPage = 1;
      this.getNewsList();
    },
    newsLoadMore(){
      if(this.msgList.length < this.newsTotal){
        this.currentPage++;
        this.getNewsList();
      }else{
        this.$refs.newsConScroll.update(true)
      }
    },
    // 去消息详情
    toNewsDetail(item){
      console.log("详情----",item);
      this.$router.push({
        path:"/msgDetail",
        query:{
          msg:item
        }
      })
    },
    deleteMsg(id,index){
      console.log("删除消息id===",id,index);
      Dialog.confirm({
        title: '提示',
        message: '确认删除该条消息吗？',
      }).then(() => {
        // on confirm
        let _this=this;
        let params = {
          "msgId":id,
          "userId":localStorage.userId,
        }
        console.log("删除消息",params)
        _this.$axios.post("/api/msg/delMsg",params).then(function (res){
          // console.log("请求搭配列表")
          _this.msgList.splice(index,1);
          _this.getNewsType();
        }).catch(function (error) {
          console.log(error);
        });
      }).catch(() => {
        // on cancel
      });
    }


  }
}
</script>

<style lang="less" scoped>
  #newsPage{
    width:100%;
    height: 100%;
    display: flex;
    flex-direction:column;
    background-color: #f5f5f5;

    .headBox{
      width:100%;
    }
    .tabBox{
      display: flex;
      // align-items: center;
      justify-content: space-around;
      height: 45px;
      line-height: 45px;
      background-color: #fff;
      // border:0.5px solid #ccc;
      margin-bottom:10px;
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
    .newsConBox{
      flex:1;
      overflow: hidden;
      padding:0px 12px;
      .msgList{
        .newsItem{
          padding:10px 12px;
          background-color: #fff;
          margin:8px 0px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          .newsIcon{
            width:13px;
            height:24px;
            margin-right:12px;
            img{
              width:100%;
            }
          }

          .msgBrief{
            flex:1;
            .tit{
              font-size:14px;
              line-height: 26px;
            }
            .inner{
              font-size: 14px;
              line-height: 24px;

              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              -webkit-line-clamp:2;

            }
            .time{
              font-size: 14px;
              line-height: 26px;
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
          width:50px;
          color: #fff;
          height:100%;
          background-color: #ec4753;
          border: none;
        }
      }
    }
  }
</style>
