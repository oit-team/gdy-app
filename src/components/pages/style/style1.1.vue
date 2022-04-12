<template>
  <div class="main" @touchmove.prevent>
    <div class=header>
      <div  @click="back"><img src="static/images/dev/back@2x.png"></div>
      <span>{{title}}</span>
      <div @click="toSearch"><img src="static/images/collocation/select@2x.png" ></div>
    </div>
    <div class="hd_container" ref = "head_tab_wrapper">
      <ul class="hd_tab_wrap" >
        <li
          v-for="(item, index) in firstTabs" :key="index" :id="item.id"
          class="hd_tab_item"
          :class="{active: item.id == firstSelected}"
          @click="firstClick(item.id,$event)"
        >
          {{item.fitOccasionName}}
        </li>
        <i class="cursor" ref="cursor"></i>
      </ul>
    </div>
    <div class="content">
      <!-- 左侧导航 -->
      <div class="left_tab" ref="leftTabScroll">
        <ul>
          <li
            v-for="(item, key) in secondTabs"
            :key="key"
            :class="{active:item.id==secondSelected}"
            class="left_tab_item"
            @click="secondClick(item.id)"
          >
            <p>{{item.fitOccasionName}}</p>
          </li>
        </ul>
      </div>
      <!-- 右侧内容 -->
      <div class="right_content"  ref="contentScroll">
        <ul class="goods_list">
          <li v-for="(item, index) in collList" :key="index" @click="goStyle(item.id)">
            <img :src="item.imgUrl">
            <span>{{htmlToStr(item.collInterpretation)}}</span>
            <span>{{item.collName}}</span>
          </li>
          <div v-if="collList.length===0">
            暂无搭配
          </div>
          <!-- <li v-for="(item, index) in (1,200)" :key="index" @click="goStyle(item.id)">
            <img src="http://res.oitor.com:8099/upload/0/2018/11/45c6c5f3ac98460c9eed4ac3f60c6e90.jpg">
            <span>都市白领，简约成熟舒适</span>
            <span>简约时尚</span>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/assets/js/util.js"
export default {
  name: "",
  data() {
    return {
      title: "",
      firstSelected: "",
      secondSelected: "",
      firstTabs: [
      ],
      secondTabs: [
      ],
      collList:[]
    };
  },
  methods: {
    back(){
      localStorage.removeItem('styleFirstSel');
      localStorage.removeItem('styleSecondSel');
      this.$router.go(-1)
    },
    toSearch(){
      this.$router.push("/search");
    },
    initOrLoadScrollView() {
      let _this = this;
      _this.$nextTick(() => {
        if (!_this.first_tab_wrapper) {
          _this.first_tab_wrapper = new _this.$BScroll(
            _this.$refs.head_tab_wrapper,
            {
              scrollX: true,
              scrollY: false,
              click: true
            }
          );
        } else {
          _this.first_tab_wrapper.refresh();
        }
        if(!_this.second_tab_wrapper){
          _this.second_tab_wrapper = new _this.$BScroll(
            _this.$refs.leftTabScroll,{
              scrollX: false,
              scrollY: true,
              click: true,
              bounce:{
                top:false,
                bottom:false
              }
            }
          )
        }else{
          _this.second_tab_wrapper.refresh();
        }
        if(!_this.style_wrapper){
          _this.style_wrapper = new _this.$BScroll(
            _this.$refs.contentScroll,{
              scrollX: false,
              scrollY: true,
              click: true,
              probeType:3
            }
          );

        }else{
          _this.style_wrapper.refresh();
        }
      });
    },
    firstClick(val,event) {
      if(this.firstSelected!=val){
        this.firstSelected=val;
        this.first_tab_wrapper.scrollToElement(event.currentTarget,500);
      }
    },
    secondClick(val) {
      if(this.secondSelected!=val){
        this.secondSelected = val;
      }
    },
    goStyle(val){
      let _this = this;
      localStorage.styleFirstSel = _this.firstSelected;
      localStorage.styleSecondSel = _this.secondSelected;
      _this.$router.push({path:"/styleDetail",query:{"collId":val,stemp:new Date().getTime()}});
    },
    getSituationList(id,subId){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":3,
        "supId":id
      }
      _this.$axios.post("/api/dic/situationList",params)
      .then(function(res){
        console.log(res)
        let data = res.data;
        if(data.code=="200"){
          _this.firstTabs = data.data;
          _this.firstSelected = localStorage.styleFirstSel==null?subId:localStorage.styleFirstSel;
        }

      })
      .catch(function(err){
        console.log(err);
      });
    },
    getClassifyList(){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":2,
        "seasonId":_this.seasonId,
        "sId":_this.firstSelected,
      }
      _this.$axios.post("/api/dic/normalList",params)
      .then(function (res){
          console.log("三级分类品类列表为",res)
          let data = res.data;
          if(data.code=="200"){
            _this.secondTabs=data.data;
            _this.secondSelected = localStorage.styleSecondSel==null?_this.secondTabs[0].id:localStorage.styleSecondSel;
            _this.getCollectionList();
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    getCollectionList(){
      util.loading();
      let _this = this;

      if(_this.firstSelected=="" || _this.secondSelected==""){
        _this.collList=[];
        return;
      }
      let params = {
        "brandId":localStorage.brandId,
        "sId":_this.firstSelected,
        "modeId":_this.secondSelected,
        "seasonId":_this.seasonId
      }
      _this.$axios.post("/api/coll/list",params)
      .then(function(res){
        let data = res.data;
        if(data.code=="200"){
          _this.collList = data.data;
        }
      })
      .catch(function(error){
        console.log(error)
      })
    },
    htmlToStr(val){
      return val.split("<br>").join(" ");
    }
  },
  updated(){
    this.initOrLoadScrollView();
  },
  mounted() {
    let _this = this;
    let id = _this.$route.query.id;
    let sId = _this.$route.query.sId;
    _this.seasonId = _this.$route.query.seasonId;
    _this.title=_this.$route.query.title;
    _this.getSituationList(id,sId);


  },
  watch:{
    firstSelected:function(newV){
      let _this = this;
      for(var i =0 ;i<_this.firstTabs.length;i++){
        if(_this.firstTabs[i].id==newV){
          let num = i*100;
          _this.$refs.cursor.style.transform= 'translateX('+num+'%)';
          break;
        }
      }
      _this.getClassifyList();
      // this.getCollectionList();
    },
    secondSelected:function(newV){
      this.getCollectionList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  width: 100%;
  height:100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.header{
  height:1rem;
  /* padding:0 0.4rem; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.header div{
  padding-left:0.4rem;
  padding-right: 0.4rem;
  height: 1rem;
  display: flex;
  align-items: center;
}
.header img{
  height: 0.4rem;
}
.hd_container {
  width: 100vw;
  overflow: hidden;
  border-bottom: 0.5px solid #ebebeb;
  flex-shrink: 0;
}
/* .hd_container::-webkit-scrollbar {
  height: 0 !important;
} */
.hd_tab_wrap {
  font-size: 16px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 17.5px;
  padding-bottom: 2.5px;
  overflow: hidden;
  display: inline-flex;
  flex-wrap: nowrap;
}
.hd_tab_item {
  /* float: left; */
  width: 2.72rem /* 204/75 */;
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #999999;
}
.hd_tab_item.active {
  position: relative;
  color: #333333;
}
.content {
  flex: 1;
  display: flex;
  flex-shrink: 0;
}
/* .hd_tab_item.active::after {
  position: absolute;
  content: "";
  display: block;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 3px;
  background: #00a8c5;
} */
.left_tab {
  width: 79.5px;
  height: 100%;
  background: #f6f6f6;
  overflow: hidden;
}
.left_tab_item {
  height: 50px;
  padding: 0.5px;
}
.left_tab_item p {
  margin: 14px 8px;
  height: 22px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: rgba(51, 51, 51, 1);
}
.left_tab .active {
  background: #fff;
}
.left_tab .active p {
  background: rgba(0, 168, 197, 1);
  border-radius: 11px;
  color: #fff;
}
.right_content {
  flex: 1;
  overflow: hidden;
}
.right_content .top {
  /* background: #fff; */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 13px;
  height: 25px;
  /* line-height: 25px; */
  color: rgba(153, 153, 153, 1);
  margin-top: 10px;
}
.right_content .top span {
  width: 15px;
  height: 1.5px;
  background: rgba(153, 153, 153, 1);
}
.goods_list {
  display: flex;
  flex-wrap: wrap;
  padding-top: 21px;
  padding-left:17px;
}
.goods_list li {
  width: 119px;
  display: flex;
  flex-direction: column;
  margin-bottom: 18.5px;
}
.goods_list li:nth-of-type(odd){
  margin-right: 22px;
}
.goods_list li img{
  height:119px;
  border:0.5px solid rgba(243,243,243,1);
}
.goods_list li span:nth-child(2){
  height: 22px;
  background:rgba(246,246,246,1);
  border:0.5px solid rgba(246,246,246,1);
  font-size: 9px;
  padding:0 11.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;
}
.goods_list li span:nth-child(3){
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #666666;
  margin-top: 8.5px;
}
.img_wrap {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img_wrap img {

}
.goods_name {
  text-align: center;
  margin-top: 12px;
}




.cursor{
  height: 0.1rem;
  width: 2.72rem;
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: all 0.2s ease-in-out;
}
.cursor::after{
  display: block;
  background-color: #00a8c5;
  height: 100%;
  width: 60%;
  margin: 0 auto;
  content: ""
}



</style>
