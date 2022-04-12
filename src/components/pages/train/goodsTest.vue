<template>
  <!-- app并没用到该页面，可删除 -->
  <div id="goodsTest">
    <div>
      <Header :title="'商品测一测'"></Header>
    </div>
    <Scroll
      class="goods-box"
      ref="goodsScroll"
      :probeType='3'
      :scrollX='true'
      :scrollY='false'
      :autoUpdate="true"
      :pullDown="false"
      :pullUp="false">
      <!-- 滚动的内容 -->
      <div class="goods-ul">
        <div
          class="goods-item"
          :class="[item.dOrderby == activeId ?'active':'']"
          v-for="(item,index) in goodsClassify"
          :key="index"
          @click="goodsTestShow(item)">
          {{item.displayName}}
        </div>
      </div>
    </Scroll>
    <Scroll
      class="goodsTestCon"
      ref="goodsTestScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div v-if="goodsTestList.length > 0">
        <div v-for="(item,index) in goodsTestList" :key="index">
          <div class="listsJoin">
            <div class="date">{{item.start}}</div>
            <div class="lists" v-for="(item_a) in item.arr" :key="item_a.id" @click="toGoodsTest(item_a)">
              <div class="listsLeft">
                <div>{{item_a.name}}</div>
              </div>
              <div>
                <span class="yspan" v-if="item_a.check>=60 && item_a.check">{{item_a.check}}分</span>
                <span class="nspan" v-else-if="item_a.check<60 && item_a.check">{{item_a.check}}分</span>
                <span class="ospan" v-else>未考核</span>
                <span><img src="static/images/dev/go@2x.png"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="noData" v-else>
        <noGood></noGood>
      </div>
    </Scroll>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { Toast } from 'mint-ui';
import Header from '../../comps/header/header';
import backHeader from '../../comps/common/commonBackHeader';
import noGood from "../../comps/common/noGoods";
export default {
  name:'goodsTest',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      goodsTestLoading: true,
      goodsTestList:
      [
        {
          id:1,
          start:"10月10日",
          arr:[
            {
              id:3,
              name:"Z9",
              check:"",
              path:"/"
            },
            {
              id:4,
              name:"N9",
              check:"62",
              path:"/goodsTest"
            },
            {
              id:5,
              name:"浪漫花都系列",
              check:"62",
              path:"/goodsTest"
            }
          ]
        },
        {
          id:2,
          start:"10月10日",
          arr:[
            {
              id:6,
              name:"Z9",
              check:"",
              path:"/"
            },
            {
              id:7,
              name:"N9",
              check:"62",
              path:"/goodsTest"
            },
            {
              id:8,
              name:"浪漫花都系列",
              check:"62",
              path:"/goodsTest"
            }
          ]
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
    }
  },
  created(){

  },
  mounted(){

  },
  activated(){

  },
  watch:{
  },
  methods:{
    //列表跳转方法
    toGoodsTest(item){
      // console.log(item,this.displayName)
      this.$router.push({
        path:"./goodsTestDetail",
        query:{
          item:item,
          displayName:this.displayName
        }
      })
    },
    //条件查询
    goodsTestShow(item){
      this.displayName = item.displayName
      this.activeId = item.dOrderby
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/goodsTest";
</style>
