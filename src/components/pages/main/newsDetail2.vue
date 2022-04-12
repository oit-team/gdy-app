<template>
  <div id="newsDetail"  @touchmove.prevent>
  <!-- <div id="newsDetail"> -->
    <div class="headBox">
      <Header :title="'资讯详情'"></Header>
    </div>

    <div class="newsHead">
      <h1>{{newsTitle}}</h1>
      <div class="publish-box">
        <span class="publish-time">{{publishTime}}</span>
        <!-- <span class="publisher">发布者:{{newsPublisher}}</span> -->
      </div>
    </div>

    <div class="detail-content" ref="contentBox" >
      <div  v-html="newsHtml" ></div>
    </div>

    <div class="fixBottom">
      <div class="coll" @click="clickCollectBtn">
        <img v-if="isCollect" src="../../../../static/images/icon/collect-active.png" alt="">
        <img v-else src="../../../../static/images/icon/collect-grey.png" alt="">

        <!-- <span :class="isCollect?'active':''">收藏</span> -->
      </div>
      <div class="giveup" @click="clickPraiseBtn">
        <img v-if="isPraise" src="../../../../static/images/icon/praise-active.png" alt="">
        <img v-else src="../../../../static/images/icon/praise-grey.png" alt="">
        <span class="likeNum" :class="isPraise?'active':''">{{likeNum}}</span>
        <!-- <span :class="isPraise?'active':''">点赞</span> -->
      </div>
    </div>

    <!-- <div v-if="isIphoneXR" style="height:29px;background:red;"></div>
    <div v-else style="height:0px;background:blue;"></div> -->

  </div>
</template>
<script>
import Header from '../../comps/header/header';
import { Toast } from 'vant';
export default {
  name:"newsDetail",
  components:{Header},
  data(){
    return {
      isCollect:false,
      isPraise:false,
      praise:0,   // 0 未点赞  1 已点赞
      collection:0,   // 0 未收藏  1 已收藏
      state:-1,  // 1点赞 2 取消点赞 3 收藏 4 取消收藏
      likeNum:0,
      newsTitle:'',
      newsPublisher:'',
      publishTime:'',
      newsHtml:'',
      osType:undefined,
      devt:undefined,
      isIphoneXR:false,
      scrollTopFlag:false,
    }
  },
  methods:{
    clickCollectBtn(){
      // 点击的是收藏按钮
      // 如果当前状态为true,则是由已收藏变为取消收藏;如果当前状态为false,则是由未收藏变为收藏
      if(this.isCollect){
        this.state = 4;
      }else{
        this.state = 3;
      }
      this.isCollect = !this.isCollect;
      if(this.isCollect){
        this.collection = 1;
      }else{
        this.collection = 0;
      }
      localStorage.collection = this.collection;
      this.clickFunc(this.praise,this.collection,this.state);

    },
    clickPraiseBtn(){
      // 点击的是点赞按钮
      // 如果当前状态为true,则是由已点赞变为取消点赞;如果当前状态为false,则是由未点赞变为点赞
      if(this.isPraise){
        this.state = 2;
      }else{
        this.state = 1;
      }
      this.isPraise = !this.isPraise;
      if(this.isPraise){
        this.praise = 1;
        this.likeNum ++;
        localStorage.likeNum = this.likeNum;
        // console.log(localStorage.likeNum)
      }else{
        this.praise = 0;
        this.likeNum --;
        localStorage.likeNum = this.likeNum;
        // console.log(localStorage.likeNum)
      }
      console.log(this.collection)
      localStorage.isPraise = this.praise;
      this.clickFunc(this.praise,this.collection,this.state);
    },

    //  点击收藏/点赞事件公共方法
    clickFunc(praise,collection,state){
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        "userId": userid,
        "noId":_this.$route.query.id,
        "praise":praise,
        "browse":1,
        "collection":collection,
        "state":state
      }
      // console.log(data,"22222")
      let params = data
      _this.$axios.post("/api/noticeInfo/upNoticeInfo",data)
      .then(function (res){
        let data = res.data;
        // console.log(data,"33333")
        if(res.data.code=="200"){
          // console.log(params)
          if(parseInt(params.state) == 1){
            Toast({
              message: '点赞成功',
              icon: 'good-job-o'
            });
          }else if(parseInt(params.state) == 2){
            Toast({
              message: '取消点赞',
              // icon: 'good-job-o'
            });
          }else if(parseInt(params.state) == 3){
            Toast({
              message: '收藏成功',
              icon: 'like-o'
            });
          }else if(parseInt(params.state) == 4){
            Toast({
              message: '取消收藏',
              // icon: 'like-o'
            });
          }

          _this.praise = parseInt(params.praise);
          _this.collection = parseInt(params.collection);
        }else{
          Toast("请求失败！");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    getNewaDetail(){
      console.log("获取资讯详情")
      let _this = this;
      let newsId = _this.$route.query.id;   // 新闻资讯id
      let userid = localStorage.getItem("userId");
      let data = {
        "userId":userid,
        "noId":newsId
      }
      console.log(data)
      let params = data
      _this.$axios.post("/api/noticeInfo/selNoticeById",data)
      .then(function (res){
        if(res.data.code=="200"){
          let data = res.data;
          console.log(data);

          _this.newsTitle=data.data.nTitle;
          _this.newsPublisher=data.data.publisherName;
          _this.publishTime = data.data.updateTime;

          _this.likeNum = res.data.data.likeNum;
          localStorage.likeNum = _this.likeNum;
          // console.log(localStorage.likeNum)

          if(res.data.data.content == ''){
            _this.newsHtml = '<div style="text-align:center;margin-top:70px;font-size:8px;color:#999;">暂未发现公告内容,敬请期待</div>'
          }else{
            let html = res.data.data.content;
            const regex = new RegExp('<img', 'gi');
            let _html = html.replace(regex,`<img style="max-width: 100%; height: auto;display:block;"`
              // ).replace(new RegExp('<br>','gi'),''
              ).replace(new RegExp('<p','gi'),`<br><p style="text-align:justify;font-size:8px;text-indent:2em;"`);
            _this.newsHtml = _html;
          }

        }else{
          Toast("请求失败！");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    initNewsDetailScroll(){
      let _this = this;
      _this.$nextTick(()=>{
        if(!_this.contentBox){
          _this.contentBox = new _this.$BScroll(_this.$refs.contentBox,{
            click:true,
            scrollX:false,
            scrollY:true,
            bounce:false,
            probeType:3
          });
          console.log("滚动部分",_this.contentBox)
          // 监听scroll事件没生效
          _this.contentBox.on('scroll', (pos) => {
            // console.log("scroll",pos.y-_this.contentBox.maxScrollY)
            if(pos.y-_this.contentBox.maxScrollY > 200){
              _this.contentBox.refresh();
            }
          })
        }else{
          // console.log("回到顶部",_this.scrollTopFlag)
          if(_this.scrollTopFlag){
            _this.contentBox.scrollTo(0,0,0);
            _this.scrollTopFlag = false;
          }
          _this.contentBox.refresh();
        }
      })

    },

  },

  created(){

    // console.log("created=================")
    // // 传参的方式获取该条资讯收藏或点赞的默认状态
    // console.log(this.$route.query)
    // this.collection = this.$route.query.collection;
    // console.log(this.collection)
    // this.praise = this.$route.query.praise;
    // if(this.collection == 0){
    //   this.isCollect = false
    // }else{
    //   this.isCollect = true
    // }
    // if(this.praise == 0){
    //   this.isPraise = false
    // }else{
    //   this.isPraise = true
    // }
    // // 进入详情页即为已浏览
    // // console.log("======created===11111===")
    // // console.log(this.$route.query.id)
    // localStorage.collection = this.collection;
    // localStorage.isPraise = this.praise;

    // if(this.$route.query.isBrowser == 1){
    //   this.clickFunc(this.praise,this.collection,-1);
    // }else{
    //   this.clickFunc(this.praise,this.collection,5);
    // }
    // // console.log("========created结束====44444===")

  },
  mounted(){
    // this.getNewaDetail();
    // 通过$refs获取dom元素
    // this.box = this.$refs.contentBox
    // // 监听这个dom的scroll事件
    // this.box.addEventListener('touchmove', (e) => {
    //   console.log(e)
    // // console.log(" scroll " + this.box.scrollTop)
    // console.log("增加滚动监听事件成功")
    // }, false)
    // this.contentBox.scrollTo(0,0,500)
  },
  updated(){
    this.initNewsDetailScroll()
  },
  activated(){
    this.scrollTopFlag = true;
    this.initNewsDetailScroll();
    console.log("activated=================")
    console.log(this.$route.query)
    this.collection = this.$route.query.collection;
    console.log(this.collection)
    this.praise = this.$route.query.praise;
    if(this.collection == 0){
      this.isCollect = false
    }else{
      this.isCollect = true
    }
    if(this.praise == 0){
      this.isPraise = false
    }else{
      this.isPraise = true
    }

    // 进入详情页即为已浏览
    // console.log("======created===11111===")
    // console.log(this.$route.query.id)
    localStorage.collection = this.collection;
    localStorage.isPraise = this.praise;

    if(this.$route.query.isBrowser == 1){
      this.clickFunc(this.praise,this.collection,-1);
    }else{
      this.clickFunc(this.praise,this.collection,5);
    }

    this.osType = localStorage.osType;
    this.devt = localStorage.devt;
    // console.log(this.osType,typeof this.osType);
    // console.log(this.devt,typeof this.devt);
    if(this.osType == 'IOS' && this.devt == 'iPhone_XR'){
      this.isIphoneXR = true;
    }else{
      this.isIphoneXR = false;
    }
    // console.log(this.isIphoneXR,typeof this.isIphoneXR)

    this.getNewaDetail();
  },
  // watch:{
  //   $route(from,to){
  //     // console.log(from,to)
  //   }
  // }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/newsDetail";


</style>
