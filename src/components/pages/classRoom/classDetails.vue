<template>
  <div id="classDetails">
    <div class="headBox">
      <backHeader
        title="微课"
        style="background-color: #f5f5f5;"
      >
        <span
          class="head-class f-l"
          slot="left"
          @click="back"
        >
          <slot>
            <img
              class="back-icon"
              src="static/images/dev/back@2x.png"
              alt=""
            >
          </slot>
        </span>
        <span
          class="head-class place-label"
          slot="right"
        ></span>
      </backHeader>
    </div>
    <Scroll
       class="box"
       ref="goodsBodyScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false"
    >
      <ul class="box-list">
        <li
          v-for="(item,index) of content"
          :key="index"
          :class="{active: isActive === index}"
          @click="changeAdd(item.dicttimeDisplayName,index)"
        >{{item.dicttimeDisplayName}}

        </li>
        <!-- <div class="icon">
          <img
            src="static/images/icon/loupe.png"
            alt=""
          >
        </div> -->
      </ul>
    </Scroll>
     <!-- 切换类别显示数据加载中圆圈 -->
    <div class="coll-loading-box" v-if="newsLoading == true">
      <van-loading color="#00a2ea"  />
    </div>
    <!-- 品牌知识 -->
    <Scroll
       v-else
      :update-data="[courseList]"
      class="home"
      ref="moduleScroll"
      :listenScroll='true'
      :probeType='3'
      :scrollX='false'
      :scrollY='true'
      :autoUpdate="false"
      @pullingDown="circleRefresh"
      @pullingUp="cyclicLoading">
      <div class="scroll" v-if='courseList.length>0'>
        <div
          class="content"
          v-for="(item,index) in courseList"
          :key="index"
        >
          <div class="top">
            <div class="logo">
              <img
                src="static/images/icon/weiketang.png"
                alt=""
              >
            </div>
            <span>{{item.courseType | formatType}}</span>
            <span>{{item.creatTime}}</span>
          </div>
          <div class="middle">
            <div class="middle-top">
              <div class="odiv"></div>
              <div class="left">
                <span class="title">{{item.courseName}}</span>
                <!-- <span class="tit">学习时长：{{item.courseDuration}}</span> -->
              </div>
            </div>
            <ul>
              <li
                class="middle-list"
                @click="toNewsDetail(smallItem,item.id)"
                v-for="(smallItem,idx) in item.chapterList"
                :key="idx"
              >
                <div class="list-left"><img
                    src="static/images/icon/dot.png"
                    alt=""
                  ></div>
                <div class="zj">
                  <div class="zj-tit">{{smallItem.chapterName}}</div>
                  <div class="zj-title">{{smallItem.studyDuration}}</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="below">
            <div class="taskLiLeft">
              <img
                src="static/images/icon/time.png"
                alt=""
              >
              <span class="tab1">{{item.courseDuration}}</span>
            </div>
            <div class="taskLiLeft">
              <img
                src="static/images/icon/top.png"
                alt=""
              >
              <span class="tab2">{{item.examRankingMax}}分</span>
            </div>
            <div class="taskLiLeft" @click="runking(item)">
              <img
                src="static/images/icon/runKing.png"
                alt=""
              >
              <span class="tab3">排行榜</span>
            </div>
            <div class="taskLiLeft">
              <img
                src="static/images/icon/lishi.png"
                alt=""
              >
              <span class="tab4">查历史</span>
            </div>
            <div class="taskLiLeft">
              <img
                src="static/images/icon/ceyice.png"
                alt=""
              >
              <span class="tab5">测一测</span>
            </div>

          </div>

        </div>

      </div>
       <!-- 无加载数据显示小手机图标 -->
       <div v-else style="padding-top:0.5px;">
          <noGood></noGood>
        </div>

    </Scroll>

  </div>
</template>

<script>
import Header from "../../comps/header/header";
import backHeader from "../../comps/common/commonBackHeader";
import noGood from "../../comps/common/noGoods";
export default {
  components: { Header, backHeader,noGood },
  data() {
    return {
      content: [],
      isActive: 0,
      courseList: [],
      pageSize: 6,
      pageNum: 1,
      newSum: 0,
      courseType:"",
      status: 0,
      newsLoading: true,//加载效果


    };
  },
  mounted() {
    // this.queryCourseList();
    // this.getCateList()
  },
  activated(){
     this.queryCourseList();
     this.getCateList()
  },
  // 过滤
  filters:{
    formatType(val){
      return val.join(",")//数组转字符用逗号隔开
    },
  },
  methods: {
    back() {
      // this.$router.go(-1);
      this.$router.push({
        path:'/index',
        query:{
          stamp:new Date().getTime()
        }
      })
    },

    //排行榜跳转详情
    runking(item){
      console.log(item);
      this.$router.push({
        path: "/runking",
        query:{
        item:item,
        }
      });

    },
    changeAdd(item,i) {
      this.isActive = i;
      console.log(item);

       if(item=="全部"){
          this.courseType=''
        }else{
         this.courseType = item;
        }
      this.pageNum = 1;
      this.newsLoading = true;
      this.queryCourseList();
    },
    toNewsDetail(item,courseId) {
      // console.log(item);
      this.$router.push({
        path: "/details",
        query:{
          item:item,
          courseId:courseId
        }
      });
    },
    // 课程列表查询
    queryCourseList() {
      let _this = this;
      let con = {
        userId: localStorage.userId,
        courseType: _this.courseType,
        status: _this.status,
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        brandId: localStorage.brandId
      };
      let jsonParam = this.GLOBAL.g_paramJson(con);
      _this.$axios
        .post("/work/CourseInfo/getAppQueryCourse", jsonParam)
        .then(function(res) {
          _this.newsLoading = false;
          if (res.data.head.status == "0") {
            // 赋值给data
            console.log(res);

            _this.newSum = res.data.body.count
            // 滚动加载分页判断
            if(_this.pageNum == 1){
              _this.courseList = res.data.body.resultList
            }else{
               _this.courseList = _this.courseList.concat( res.data.body.resultList);
            }
            // 数组转字符
            // for (let i = 0; i < _this.courseList.length; i++) {
            //   // console.log(_this.courseList[i]);
            //   _this.courseList[i].courseType = _this.courseList[i].courseType.join(",")
            // }
          } else {
            _this.$toast(res.data.message);
          }
        })
        .catch(function(error) {
          console.log(error);
          // _this.$toast("接口调用失败");
        });
    },
    //上拉刷新，下拉加载，分页
   circleRefresh() {
      this.pageNum = 1;
      this.queryCourseList();
    },
    cyclicLoading() {
      if (this.courseList.length < this.newSum) {
        // console.log(this.collocationList.length , this.collTotal)
        this.pageNum++;
        this.queryCourseList();
      } else {
        // console.log(this.collocationList.length , this.collTotal)
        this.$refs.moduleScroll.update(true);
      }
    },
    // 顶部分类接口
     getCateList(){
      let _this = this;
      let con = {
       "userId":localStorage.userId,
        "brandId":localStorage.brandId,
        "type":"BS_TYPE_1",
      }
      let jsonParam = _this.GLOBAL.g_paramJson(con,100009);
      _this.$axios.post("/goods/dictitemInfo/dictitemInfoAllMethod", jsonParam).then((res) => {
        // console.log("查询顶部类别列表成功-----",res.data.body);
        if(res.data.head.status == 0){
          _this.content = res.data.body.result;
          let obj = {dicttimeDisplayName: "全部"};
          _this.content.unshift(obj);
        }else{
          _this.$message({
            message: res.data.head.msg,
            type: 'warning'
          });
        }
      }).catch(err=>{
        console.log(err)
      });
    },
    //单元学习时长接口
    // lengthStudy(){


    // }

  }
};
</script>

<style scoped lang="less">
#classDetails {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .box {
    width: 100%;
    height: 1.2rem;
    line-height: 1.1rem;
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #f5f5f5;
    padding-left: 5px;
    .box-list {
      width: 100%;
      -webkit-box-flex: 1;
      flex: 1;
      overflow: hidden;
      display: flex;
      height: 1.1rem;
      align-content:space-between;
      box-sizing: border-box;

      .active {
        border-bottom: 2px solid #1978fe;
        color: #1978fe;
        // font-size: 16px;
      }
      li {
        white-space: nowrap;
        font-size: 14px;
        color: #999;
        box-sizing: border-box;
        margin: 0 15px;
        height: 0.96rem;
      }

    }
  }
  .home {
    flex: 1;
    width: 100%;
    background-color: #f5f5f5;
    .scroll {
      -webkit-box-flex: 1;
      flex: 1;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        border: 0.5px solid #fff;
        background: #fff;
        margin: 10px 10px 10px 10px;
        // height: 322.5px;
        box-sizing: border-box;
        font-size: 14px;
        .top {
          color: #999;
          height: 40px;
          align-items: center;
          // border-bottom: 0.5px solid #f3f3f3;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 7.5px;
          .logo img {
            width: 25px;
            height: 25px;
            border-radius: 5px;
          }
          span {
            font-size: 15px;
            margin: 0 7.5px;
          }
        }
        .middle {
          // flex: 1;
          // display: flex;
          // flex-direction: row;
          // justify-content: space-between;
          // align-items: center;
          // margin: 10px 10px;
          .middle-top {
            width: 100%;
            height: 40px;
            display: flex;
            border-bottom: 0.5px solid #f3f3f3;
            .odiv {
              margin: 0 10px;
              width: 3px;
              background: #1978fe;
              height: 14px;
              margin-top: 12.5px;
              // margin-right: 12.5px;
            }
            .left {
              width: 100%;
              display: flex;
              justify-content: space-between;
              padding-right: 10px;
            }
            span {
              line-height: 40px;
              display: block;
            }
            .title {
              font-size: 14px;
            }
            // .tit {
            //   font-size: 8px;
            //   color: #999;
            // }
          }
          .middle-list {
            width: 100%;
            height: 40px;
            display: flex;
            border-bottom: 0.5px solid #f3f3f3;
            .list-left {
              width: 35px;
              // height: 100%;
              text-align: center;
              line-height: 44.5px;
              img {
                width: 15px;
                height: 15px;
              }
            }
            .zj {
              display: flex;
              width: 100%;
              justify-content: space-between;
              font-size: 12.5px;
              padding-right: 10px;
              align-items: center;
              .zj-title {
                width: 20%;
                text-align: center;
                color: #5ea1fe;
              }
              .zj-title1 {
                color: #f5f5f5;
                // margin-top: 2.5px;
                // height: 22.5px;
                width: 26%;
                text-align: center;
                background-color: #5ea1fe;
                border-radius: 25px;
              }
            }
          }
        }
        .below {
          display: flex;
          .taskLiLeft {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 7.5px;
            margin-bottom:7.5px ;
            img {
              flex: 1;
              // width:50%;
              width: 17.5px;
            }
            span {
              margin-top: 5px;
              font-size: 12px;
            }
            .tab5 {
              color: #5ea1fe;
            }
            .tab4 {
              color: #4fd5ac;
            }
            .tab2 {
              color: #ff8c7c;
            }
            .tab3 {
              color: #af9414;
            }
            .tab1 {
              color: #8a8a8a;
            }
          }
        }
      }
    }
  }
}
</style>
