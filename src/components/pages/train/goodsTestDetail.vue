<template>
  <!-- app并没用到该页面，可删除 -->
  <div id="goodsTestDetail">
    <div>
      <Header :title="displayName +' '+ title.name"></Header>
    </div>
    <Scroll
      class="goodsTestDetailCon"
      ref="goodsTestDetailScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div class="bodys">
        <div class="bodysTop" v-for="item in goodsTestDetailList" :key="item.id">
          <div class="lists">
            <div class="listsTop">
              <img :src="item.icon">
            </div>
            <div class="listsBom">
              <span class="tspan">{{item.name}}</span>
              <span class="bspan">{{item.num}}</span>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="footer" >
      <van-button class="startBtn" round type="info" @click="startTesting">开始测试</van-button>
    </div>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'goodsTestDetail',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      goodsTestDetailLoading: true,
      goodsTestDetailList:
      [
        {
          icon:"/static/images/goodsTest/test44@2x.png",
          name:"考题数量",
          num:"10道",
        },
        {
          icon:"/static/images/goodsTest/test35@2x.png",
          name:"考核时间",
          num:"15分钟",
        },
        {
          icon:"/static/images/goodsTest/test36@2x.png",
          name:"最好成绩",
          num:"60分",
        },
      ],
      goodsClassify:[
        {
          key: "2020冬", displayName: "2020冬", dOrderby: "3", type: "2020冬"
        },
        {
          key: "2020秋", displayName: "2020秋", dOrderby: "2", type: "2020秋"
        },
        {
          key: "2020夏", displayName: "2020夏", dOrderby: "1", type: "2020夏"
        },
      ],
      activeId:3,
      displayName:"2020冬",
      title:"Z9",
    }
  },
  created(){

  },
  mounted(){

  },
  activated(){
    this.displayName = this.$route.query.displayName
    this.title = this.$route.query.item
  },
  watch:{
  },
  methods:{
    startTesting(){
      this.$router.push({
        path:"./goodsTestTopic",
        query:{
          displayName:this.displayName,
          item:this.title
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/goodsTestDetail";
</style>
