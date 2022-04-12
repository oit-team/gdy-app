<template>
  <!-- app并没用到该页面，可删除 -->
  <div id="myTrainCheck">
    <div class='header'>
      <div class="img">
        <img src="static/images/dev/back@2x.png" @click="back" >
      </div>
      <span class="tit">培训考核</span>
      <span class="placeLabel" ></span>
    </div>
    <Scroll
      class="trainCheckCon"
      ref="trainCheckScroll"
      :probeType='3'
      :listenScroll='true'
      :autoUpdate="false"
      :scrollX='false'
      :scrollY='true'
      :pullDown="false"
      :pullUp="false"
    >
      <div v-if="trainList.length > 0">
        <div
          v-for="(item,index) in trainList"
          :key="index"
        >
          <div
            v-if="item.bsTypeTaskStatus == 1"
            class="lists"
            @click="toTrainCheck(item)"
          >
            <span>{{item.bsName}}</span>
            <div>
              <!-- <span class="ospan">{{"未考核"}}{{item.taskCount}}项</span> -->
              <span><img src="static/images/dev/go@2x.png"></span>
            </div>
          </div>
          <div
            v-else-if="item.bsTypeTaskStatus == 2"
            class="lists"
            @click="toTrainCheck(item)"
          >
            <span>{{item.bsName}}</span>
            <div>
              <!-- <span class="ospan">{{"考核完成"}}{{item.taskCount}}</span> -->
              <span><img src="static/images/dev/go@2x.png"></span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="noData"
        v-else
      >
        <noGood></noGood>
      </div>
    </Scroll>
  </div>
</template>
<script>
import { Dialog } from "vant";
import { Toast } from "mint-ui";
import Header from "../../comps/header/header";
import backHeader from "../../comps/common/commonBackHeader";
import noGood from "../../comps/common/noGoods";
export default {
  name: "myTrainCheck",
  components: { Header, backHeader, noGood },
  data() {
    return {
      trainLoading: true,
      trainList:[
        {
          bsName: "员工必学",
          bsType: 1,
          taskCount: 10,
          bsTypeTaskStatus: 1,
        },{
          taskCount:79,bsName:"商品测一测必学",bsTypeTaskStatus:1,bsType:2
        },{
          taskCount:4,bsName:"考核任务",bsTypeTaskStatus:1,bsType:3
        }
      ],
      bsCode: "",
      bsType: "",
      page: 1,
      pageSize: 8,
      checkData:[],
    };
  },
  created() {},
  mounted() {},
  activated() {},
  watch: {},
  methods: {
    back(){
      this.$router.push({
        path:'/index',
      })
    },
    //列表跳转方法
    toTrainCheck(item) {
      let _this = this;

      localStorage.bsName = item.bsName;
      localStorage.bsType = item.bsType;
      if (item.bsType == 2) {
        this.$router.push({
          path: "/goodsTest",
          query: {
            item: item,
          },
        });
      } else {
        //请求考核列表、员工必学列表，没有列表给出提示，直接开始做题。
        let params = {
          userId: localStorage.userId,
          taskType: 1,
          bsCode: localStorage.brandIdGDY,
          bsType: localStorage.bsType,
          page: 1,
          pageSize: 8,
        };
        //判断是获取那个数据
        if(localStorage.bsType == 1||localStorage.bsType == 3){
          params.taskType = 2
        }
        if(localStorage.bsType == 2){
          params.taskType = 1
        }
        let jsonParam = this.GLOBAL.g_paramJson(params);
        _this.$axios
          .post("/task/task/getTaskList", jsonParam)
          .then((res) => {
            _this.checkLoading = false;
            // console.log("根据用户id获取任务列表", res.data);
            if (res.status == "200") {
              if(res.data.body.count < 1 && localStorage.bsType != 1 && localStorage.bsType != 3){
                // 到测一测页面
                this.$router.push({
                  path:"/goodsTestDetail",
                  query:{
                    ceyice:1,
                  }
                });
              }else{
                this.$router.push({
                  path: "/checkTask",
                  query: {
                    item: item,
                  },
                });
              }
            } else {
              _this.$toast(res.data.message);
            }
          })
          .catch(function (error) {
            console.log(error);
            // _this.$toast("接口调用失败");
          });
      }
    },

  },
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/commom.css";
@import "../../../assets/pageCss/myTrainCheck";
</style>
