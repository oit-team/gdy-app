<template>
  <VueActions
    class="newsDetail"
    data  ="myCircleDetailItem"
    @touchmove.prevent
  >
    <Header :title="'详情'"></Header>

    <div class="newsHead" v-actions:newsDetail>
      <h2>{{newsTitle}}</h2>
      <div class="publish-box">
        <span class="publish-time">{{publishTime}}</span>
      </div>
    </div>

    <div
      class="detail-content"
      ref="contentBox"
      v-actions:itemContent.duration
    >
      <div
        class="page_scroll_content"
        @click="getImg($event)"
        v-actions:getImg.click
      >
        <div
          class="content-box ql-editor"
          v-html="newsHtml"
        >
          <!-- <div class="content-box" v-html="newsHtml"></div> -->
        </div>
      </div>
    </div>
    <div
      class="fixBottom"
      v-if="!fromPath"
    >
      <!-- <div class="coll" @click="clickCollectBtn">
        <img v-if="isCollect" src="../../../../static/images/icon/collect-active.png" alt="">
        <img v-else src="../../../../static/images/icon/collect-grey.png" alt="">
      </div> -->
      <div
        class="giveup"
        @click="clickPraiseBtn"
        v-actions:praiseBtn.click
      >
        <img
          v-if="isPraise"
          src="../../../../static/images/icon/praise-active.png"
          alt=""
        >
        <img
          v-else
          src="../../../../static/images/icon/praise-grey.png"
          alt=""
        >
        <span
          class="likeNum"
          :class="isPraise?'active':''"
        >{{likeNum}}</span>
      </div>
    </div>

  </VueActions>
</template>

<script>
import Header from "../../comps/header/header";
import { Toast } from "vant";
import { ImagePreview } from "vant";
export default {
  name: "newsDetail",
  components: { Header },
  data() {
    return {
      isCollect: false,
      isPraise: false,
      praise: 0, // 0 未点赞  1 已点赞
      collection: 0, // 0 未收藏  1 已收藏
      state: -1, // 1点赞 2 取消点赞 3 收藏 4 取消收藏
      likeNum: 0,
      newsTitle: "",
      newsPublisher: "",
      publishTime: "",
      newsHtml: "",
      // osType:undefined,
      // devt:undefined,
      // isIphoneXR:false,
      scrollTopFlag: false,
      fromPath: "",
    };
  },
  methods: {
    getImg($event) {
      // console.log($event.target.currentSrc)
      // 有图片的时候才会执行此操作
      if ($event.target.currentSrc) {
        ImagePreview({
          images: [$event.target.currentSrc],
          showIndex: false,
        });
      }
    },

    clickCollectBtn() {
      // 点击的是收藏按钮
      // 如果当前状态为true,则是由已收藏变为取消收藏;如果当前状态为false,则是由未收藏变为收藏

      if (this.isCollect) {
        this.state = 4;
      } else {
        this.state = 3;
      }
      this.isCollect = !this.isCollect;
      if (this.isCollect) {
        this.collection = 1;
      } else {
        this.collection = 0;
      }

      localStorage.collection = this.collection;
      this.clickFunc(this.praise, this.collection, this.state);
    },
    clickPraiseBtn() {
      // 点击的是点赞按钮
      // 如果当前状态为true,则是由已点赞变为取消点赞;如果当前状态为false,则是由未点赞变为点赞
      if (this.isPraise) {
        this.state = 2;
      } else {
        this.state = 1;
      }
      this.isPraise = !this.isPraise;
      if (this.isPraise) {
        this.praise = 1;
        this.likeNum++;
        localStorage.likeNum = this.likeNum;
        // console.log(localStorage.likeNum)
      } else {
        this.praise = 0;
        this.likeNum--;
        localStorage.likeNum = this.likeNum;
        // console.log(localStorage.likeNum)
      }
      localStorage.isPraise = this.praise;
      this.clickFunc(this.praise, this.collection, this.state);
    },
    //  点击收藏/点赞事件公共方法
    clickFunc(praise, collection, state) {
      let _this = this;
      let userid = localStorage.getItem("userId");
      let data = {
        userId: userid,
        noId: _this.$route.query.id,
        praise: praise,
        browse: 1,
        collection: collection,
        state: state,
      };
      let params = data;
      _this.$axios
        .post("/api/noticeInfo/upNoticeInfo", data)
        .then(function (res) {
          let data = res.data;
          if (res.data.code == "200") {
            if (parseInt(params.state) == 1) {
              Toast({
                message: "点赞成功",
                icon: "good-job-o",
              });
            } else if (parseInt(params.state) == 2) {
              Toast({
                message: "取消点赞",
                // icon: 'good-job-o'
              });
            } else if (parseInt(params.state) == 3) {
              Toast({
                message: "收藏成功",
                icon: "like-o",
              });
            } else if (parseInt(params.state) == 4) {
              Toast({
                message: "取消收藏",
                // icon: 'like-o'
              });
            }

            _this.praise = parseInt(params.praise);
            _this.collection = parseInt(params.collection);
          } else {
            Toast("请求失败！");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getNewaDetail() {
      let _this = this;

      let newsId = _this.$route.query.id; // 新闻资讯id
      let userid = localStorage.getItem("userId");
      let data = {
        userId: userid,
        noId: newsId,
      };
      let params = data;
      _this.$axios
        .post("/api/noticeInfo/selNoticeById", data)
        .then(function (res) {
          if (res.data.code == "200") {
            let data = res.data;
            // console.log(data);

            _this.newsTitle = data.data.nTitle;
            _this.newsPublisher = data.data.publisherName;
            _this.publishTime = data.data.updateTime;

            _this.likeNum = res.data.data.likeNum;
            localStorage.likeNum = _this.likeNum;

            if (res.data.data.content == "") {
              _this.newsHtml =
                '<div style="text-align:center;margin-top:70px;font-size:8px;color:#999;">暂未发现公告内容,敬请期待</div>';
            } else {
              let html = res.data.data.content;
              const regex = new RegExp("<img", "gi");
              let _html = html.replace(
                regex,
                `<img style="max-width: 100%; height: auto;display:block;"`
                // ).replace(new RegExp('<br>','gi'),''
              );
              // .replace(new RegExp('<p','gi'),`<br><p style="text-align:justify;font-size:8px;text-indent:2em;"`);
              _this.newsHtml = _html;
            }
          } else {
            Toast("请求失败！");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    initNewsDetailScroll() {
      let _this = this;
      _this.$nextTick(() => {
        if (!_this.contentBoxScroll) {
          _this.contentBoxScroll = new _this.$BScroll(_this.$refs.contentBox, {
            scrollX: false,
            scrollY: true,
            click: true,
            probeType: 3,
            useTransition: false,
            // preventDefaultException:{className:/(^|\s)bs_prevent(\s|$)/}
          });
          // console.log("滚动部分",_this.contentBoxScroll)
          // 监听scroll事件没生效
          _this.contentBoxScroll.on("scroll", (pos) => {
            // console.log(pos)
            // console.log("scroll",pos.y,_this.contentBoxScroll.maxScrollY,pos.y-_this.contentBoxScroll.maxScrollY)
            if (pos.y - _this.contentBoxScroll.maxScrollY <= 0) {
              _this.contentBoxScroll.refresh();
            }
          });
        } else {
          if (_this.scrollTopFlag) {
            _this.contentBoxScroll.scrollTo(0, 0, 0);
            _this.scrollTopFlag = false;
          }
          _this.contentBoxScroll.refresh();
        }
      });
    },
  },
  watch: {},
  mounted() {
    // console.log("--------newsDetail----mounted----")
    this.initNewsDetailScroll();
  },
  activated() {
    this.scrollTopFlag = true;
    this.initNewsDetailScroll();
    // console.log("newsDetail=======activated=================")
    console.log(this.$route.query);
    this.fromPath = this.$route.query.fromPath;
    console.log(this.fromPath);
    if (!this.fromPath) {
      this.collection = this.$route.query.collection;
      // console.log(this.collection)
      this.praise = this.$route.query.praise;

      if (this.collection == 0) {
        this.isCollect = false;
      } else {
        this.isCollect = true;
      }
      if (this.praise == 0) {
        this.isPraise = false;
      } else {
        this.isPraise = true;
      }

      // 进入详情页即为已浏览
      // console.log("======created===11111===")
      // console.log(this.$route.query.id)
      localStorage.collection = this.collection;
      localStorage.isPraise = this.praise;

      if (this.$route.query.isBrowser == 1) {
        this.clickFunc(this.praise, this.collection, -1);
      } else {
        this.clickFunc(this.praise, this.collection, 5);
      }
    }else{
      this.clickFunc(true, true, -1);
    }

    this.getNewaDetail();
  },
  updated() {
    // this.initNewsDetailScroll();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
// @import "../../../assets/css/commom.css";
// @import "../../../assets/pageCss/newsDetail";
body {
  font-size: 16px;
}
.newsDetail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 16px !important;
}
.header {
  width: 100%;
  z-index: 99;
  box-sizing: border-box;
}
.newsHead {
  padding: 5px 15px;
  box-sizing: border-box;
  h2 {
    font-size: 23px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    // color:red;
  }
  .publish-box {
    font-size: 12px;
    color: #999;
    line-height: 30px;

    .publisher {
      margin-left: 15px;
    }
  }
}
.detail-content {
  width: 100vw;
  flex: 1;
  overflow: hidden;
  // border:5px solid rgb(0, 255, 170);
  box-sizing: border-box;
  .content-box {
    padding: 0px 15px 20px 15px;
    // 给v-html里面的内容设置样式
    /deep/ p {
      text-align: justify;
      font-size: 16px !important;
      line-height: 25px;
      // text-indent:2em;
      white-space: pre-wrap; // 显示空格
    }
    /deep/ h1,
    /deep/ h2,
    /deep/ h3,
    /deep/ h4,
    /deep/ h5,
    /deep/ h6 {
      white-space: pre-wrap;
      // text-indent:2em;
    }

    /deep/ span,
    /deep/ a {
      font-size: 16px !important;
    }
  }
}

.fixBottom {
  height: 1.1rem;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-around;
  color: #000;
  font-size: 16px;
  border-top: 0.5px solid #e3e3e3;
  // background-color: pink;
  div {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 24px;
    }
    .active {
      color: #1978fe;
    }
  }

  .giveup {
    position: relative;
    .likeNum {
      position: absolute;
      top: -2px;
      left: 24px;
      font-size: 10px;
    }
  }
}

.bottom-tip {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 10px 0px 5px 0px;
  // border:0.5px solid #000;
  display: flex;
}
.hr_block {
  width: 50px;
  height: 0.5px;
  margin-top: 8px;
  border-top: 0.5px solid #ccc;
}
.hr_block:first-child {
  margin-left: auto;
}
.hr_block:last-child {
  margin-right: auto;
}
</style>

