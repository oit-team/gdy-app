<template>
  <!-- app并没用到该页面，可删除 -->
  <div id="goodsTestTopic">
    <div>
      <Header :title="displayName +' '+ title.name"></Header>
    </div>
    <Scroll
      class="goodsTestTopicCon"
      ref="goodsTestTopicScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div class="bodys">
        <div class="listsTop">
          <img src="../../../../static/images/goodDetail/shopRec1.png">
        </div>
        <div class="listsBom">
          <div class="listsBomTop">
            <div class="listsBomTopTop"><span class="listsBomTopTopSpan">{{goodsTestTopicList.num}}</span>/{{goodsTestTopicList.nums}}</div>
            <div class="listsBomTopBom"><img class="listsBomTopTopImg" src="static/images/goodsTest/test35@2x.png" alt="">{{goodsTestTopicList.time}}</div>
          </div>
          <div class="listsBomIn">这款商品的款式一下描述正确的是：</div>
          <div class="listBomBom">
            <div class="listBomBomList" @click="optTopicShow" v-for="(item,index) in goodsTestTopicList.exercises" :key='index'>
              <div class="listIcon">{{item.letter}}</div><div>{{item.text}}</div>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="footer" >
      <van-button class="startBtn up" type="info" @click="startTesting">上一题</van-button>
      <van-button class="startBtn in" @click="catalogShow">目 录</van-button>
      <van-button class="startBtn down" type="info" @click="startTesting">下一题</van-button>
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
  name:'goodsTestTopic',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      goodsTestTopicLoading: true,
      goodsTestTopicList:
        {
          num:1,
          nums:10,
          time:"5:00",
          exercises:[
            {
              letter:"A",
              text:"QWE123-DSF8023"
            },
            {
              letter:"A",
              text:"QWE123-DSF8023"
            },
            {
              letter:"A",
              text:"QWE123-DSF8023"
            },
            {
              letter:"A",
              text:"QWE123-DSF8023"
            },
          ]
        },
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
    catalogShow(){
      // 跳转目录页
      this.$router.push({
        path:"./topicCatalog",
        query:{
          displayName:this.displayName,
          item:this.title
        }
      })
    },
    // 选中
    optTopicShow(){
      // 选中
      // 手动执行下一题
    },
    //执行上下题
    startTesting(){

      // this.$router.push({
      //   path:"./",
      //   query:{
      //     item:item
      //   }
      // })
    },
    //列表跳转方法
    toGoodsTestDetail(item){
      // console.log(item,this.displayName)
      // this.$router.push({
      //   path:"./",
      //   query:{
      //     item:item
      //   }
      // })
    },
    //条件查询
    goodsTestTopicShow(item){
      this.displayName = item.displayName
      this.activeId = item.dOrderby
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/goodsTestTopic";
</style>
