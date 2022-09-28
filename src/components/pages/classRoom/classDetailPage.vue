<template>
  <div id="classDetailPage">
    <div class="headBox">
      <backHeader :title="title" style="background-color: #f5f5f5;">
        <span class="head-class f-l" slot="left" @click="back">
          <slot>
            <img class="back-icon" src="static/images/dev/back@2x.png" alt="">
          </slot>
        </span>
        <span class="head-class place-label" slot="right"></span>
      </backHeader>
    </div>
    <Scroll
      class="box"
      ref="circleScroll"
      :probeType='3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false"
    >
      <div class="content">
        <div class="taxt ql-editor" v-html="con"></div>
      </div>
    </Scroll>

  </div>

</template>

<script>
import Header from "../../comps/header/header";
import backHeader from "../../comps/common/commonBackHeader";
export default {
  name: "classDetailPage",
  components: { Header, backHeader },
  data() {
    return {
      isActive: 1,
      detailedList:"",
      courseId:null,
      chapterId:null,
      title:"",
      con:""


    };
  },
  created(){},
  mounted(){},
  activated(){
    // console.log(this.$route.query);
    this.courseId = this.$route.query.courseId;
    this.chapterId = this.$route.query.item.id;
    this.title = this.$route.query.item.chapterName;
    this.con = this.$route.query.item.content;
    this.unitDetails()
  },
  methods: {
    changClass(i) {
      this.isActive = i;
    },
    back() {
      this.$router.go(-1);
    },
    // 单元详情接口
    unitDetails(){
      let _this = this;
      let con = {
        "courseId":_this.courseId,
        "chapterId":_this.chapterId,
        "userId":localStorage.userId,
        "brandId":localStorage.brandId,
      }
      let jsonParam = _this.GLOBAL.g_paramJson(con);
      _this.$axios.post("/work/chapterInfo/getChapterQueryDetails", jsonParam).then((res) => {

        if(res.data.head.status == 0){
          _this.detailedList = res.data.body.resultList;
        }else{
          _this.$toast(res.data.head.msg);
        }
      }).catch(err=>{
        console.log(err)
      });
    },

  },
};
</script>

<style scoped lang="less">
#classDetailPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .headBox {
    height: 1.4rem;

  }
 .taxt{
   font-size: 15px;
   width: 100%;
   box-sizing: border-box;
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
    /deep/ img{
      width:100%;
    }
  }


}
</style>
