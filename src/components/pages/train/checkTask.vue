<template>
  <!-- app并没用到该页面，可删除 -->
  <div id="checkTask">
    <div>
      <Header :title="'考核任务'"></Header>
    </div>

    <Scroll
      class="checkTaskCon"
      ref="checkTaskScroll"
      :probeType = '3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false">
      <div v-if="checkTaskList.length > 0">
        <div v-for="(item,index) in checkTaskList" :key="item.id" @click="toCheckTask(item)">
          <div class="lists">
            <div class="listsLeft">
              <div class="listsLeftLeft">{{index+1}}</div>
              <div class="con">
                <div class="con_t">{{item.name}}</div>
                <div class="con_b">{{item.start}}~{{item.end}}</div>
              </div>
            </div>
            <div>
              <span class="yspan" v-if="item.check>=60 && item.check">{{item.check}}分</span>
              <span class="nspan" v-else-if="item.check<60 && item.check">{{item.check}}分</span>
              <span class="ospan" v-else>未考核</span>
              <span><img src="static/images/dev/go@2x.png"></span>
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
  name:'checkTask',
  components:{ Header , backHeader ,noGood},
  data(){
    return {
      checkTaskLoading: true,
      checkTaskList:[
        {
          id:1,
          name:"品牌知识",
          check:"",
          path:"/checkTask",
          start:"2021-01-01",
          end:"2021-01-01"
        },
        {
          id:2,
          name:"店务流程手册",
          check:"62",
          path:"/goodsTest",
          start:"2021-01-01",
          end:"2021-01-01"
        },
        {
          id:3,
          name:"6S精细化管理手册",
          check:"",
          path:"/checkTask",
          start:"2021-01-01",
          end:"2021-01-01"
        },
        {
          id:4,
          name:"品牌款号规则与考核",
          check:"20",
          path:"/checkTask",
          start:"2021-01-01",
          end:"2021-01-01"
        },
        {
          id:5,
          name:"陈列基础规则",
          check:"",
          path:"/goodsTest",
          start:"2021-01-01",
          end:"2021-01-01"
        },
      ],
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
    toCheckTask(item){
      this.$router.push({
        path:"./goodsTestDetail",
        query:{
          item:item,
          displayName:this.displayName
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/checkTask";
</style>
