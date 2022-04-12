<template>
  <div id="hello">
    <div style="font-size:12px;" @click="back">back(返回按钮)</div>
    <!-- 图片预览测试代码（没啥用处，不用在意） -->
    <!-- <van-image-preview v-model="show" :images="images" @change="onChange">
      <template v-slot:index>第{{ index }}页</template>
    </van-image-preview> -->

    <!-- 封装横向滚动条组件测试代码 -->
    <!-- <horizonScroll :horizonScroll = list
                  :activtedVal = activeId
                  :types = type
                  :renderName = renderName1
                  @func = "testFun"></horizonScroll>

    <div style="height:50px;background:pink;">占位空间</div>

    <horizonScroll :horizonScroll = seasonList
                  :activtedVal = curSeason
                  :types = seasonType
                  :renderName = renderName2
                  @func = "testFun1"></horizonScroll> -->

    <div style="height:50px;background:green;">占位空间</div>

    <horizonScroll :horizonScroll = seriesList
                  :activtedVal = curSeries
                  :types = seriesType
                  :renderName = renderName3
                  @func = "testFun2"></horizonScroll>

  </div>
  <!-- curSeries:"复古回溯",
      seriesType:"seriesName",
      renderName3:'seriesName',
      seriesList:[ -->
</template>
<script>

import wxApi from '../assets/js/common';
import horizonScroll from "./comps/common/horizonScroll";


export default {
  name: 'HelloWorld',
  components:{ horizonScroll },
  data () {
    return {
      show: false,
      index: 0,
      images:[
        "http://res.oitor.com:8099/upload/0/2019/5/d1ee197e2d7441519f9d55c6bca9fb6c.jpg",
        "http://res.oitor.com:8099/upload/0/2019/5/e727908e349949d2a5ef95f132091b6d.jpg"
      ],

      activeId:'1',
      type:'sId',
      renderName1:'name',
      list:[
        {
          id:1,
          sId:1,
          name:"name一"
        },
        {
          id:2,
          sId:2,
          name:"name二"
        },
        {
          id:3,
          sId:3,
          name:"name三"
        },
        {
          id:4,
          sId:4,
          name:"name四"
        },
        {
          id:5,
          sId:5,
          name:"name五"
        },
        {
          id:6,
          sId:6,
          name:"name六"
        },
        {
          id:7,
          sId:7,
          name:"name七"
        }
      ],

      curSeason:"2020夏",
      seasonType:"seasonName",
      renderName2:'seasonName',
      seasonList:[
        {
          id:1,
          seasonName:"2020春"
        },
        {
          id:2,
          seasonName:"2020夏"
        }
      ],

      curSeries:"优雅香颂",
      seriesType:"seriesName",
      renderName3:'seriesName',
      seriesList:[
        {
          id:1,
          seriesName:"复古回溯"
        },
        {
          id:2,
          seriesName:"摩登都市"
        },
        {
          id:3,
          seriesName:"浪漫邂逅"
        },
        {
          id:4,
          seriesName:"优雅香颂"
        },
        {
          id:5,
          seriesName:"花园畅想"
        }
      ],

    }
  },
  mounted(){
    // wxApi.wxRegister(this.wxRegCallback)
  },
  methods:{
    testFun(){
      console.log("测试方法")
    },
     testFun1(){
      console.log("测试方法111111111111")
    },
    testFun2(){
      console.log("3333333333333333333333")
    },


    back(){
      this.$router.go(-1);
    },
    wxRegCallback () {
      // 用于微信JS-SDK回调
      this.wxShareTimeline()
      this.wxShareAppMessage()
    },
    wxShareTimeline(){
      let option = {
        title:'分享标题',
        desc:'分享描述',
        link:'分享链接', // window.location.href.split('#')[0], // 分享链接，根据自身项目决定是否需要split
        imgUrl:'https://images.ktpis.com/app_logo_new_new.png',   // 分享图标
        success(){
          console.log("朋友圈分享成功")
        },
        error(){
          console.log("朋友圈分享失败")
        }
      }
      // 将配置注入通用方法
      wxApi.shareTimeline(option)
    },
    wxShareAppMessage(){
      let option = {
        title:'分享标题',
        desc:'分享描述',
        link:'分享链接', // window.location.href.split('#')[0], // 分享链接，根据自身项目决定是否需要split
        imgUrl:'https://images.ktpis.com/app_logo_new_new.png',   // 分享图标
        success(){
          console.log("好友分享成功")
        },
        error(){
          console.log("好友分享失败")
        }
      }
      // 将配置注入通用方法
      wxApi.shareAppMessage(option)
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#hello{
  box-sizing:border-box;
  width:100%;
  .img-list{
    width:100%;
    img{
      width:100%;
      border:5px solid green;
    }

  }
}


</style>
