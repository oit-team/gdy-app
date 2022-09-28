<template>
  <div class="body" style="background-color:#fff;" >
    <mt-header :title="title">
      <span @click="back" slot="left">
        <mt-button icon="back">返回</mt-button>
      </span>
      <!-- <mt-button icon="more" slot="right"></mt-button> -->
    </mt-header>
    <div class="head_first_tab first_tab_wrapper" ref="first_tab_wrapper">
      <ul class="first_navbar" ref="firstNavbar">
        <li class="first_navbar_item"
        :class="{'active':item.id===firstSelected}"
        v-for="(item, index) in firstTabs"
        :key="index" @click="firstClick(item.id)">{{item.fitOccasionName}}</li>
      </ul>
    </div>
    <div class="head_second_tab second_tab_wrapper" ref="second_tab_wrapper">
      <ul class="second_navbar" ref="secondNavBar">
        <li class="second_navbar_item"
        :class="{'active':item.id===secondSelected}"
        v-for="(item, index) in secondTabs"
        :key="index" @click="secondClick(item.id)">{{item.fitOccasionName}}</li>
      </ul>
    </div>
    <div class="style_list_box style_wrapper" ref="style_wrapper">
      <div class="style_list_content">
        <div class ="style_box"
          v-for="(item, index) in collList" :key="index" @click="goStyle(item.id)">
          <img :src="item.imgUrl"/>
          <div>{{item.collName}}</div>
        </div>
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
      title: "日常",
      firstSelected: "",
      secondSelected: "",
      firstTabs: [
        { name: "家居装", value: 0 },
        { name: "休闲运动", value: 1 },
        { name: "旅行度假", value: 2 },
        { name: "旅行度假", value: 3 }
      ],
      secondTabs: [
        { name: "全部", value: 0 },
        { name: "外套", value: 1 },
        { name: "上下装", value: 2 },
        { name: "连衣裙", value: 3 },
        { name: "短裙", value: 4 }
      ],
      collList:[]
    };
  },
  methods: {
    back(){
      this.$router.go(-1)
    },
    initOrLoadScrollView() {
      let _this = this;
      _this.$nextTick(() => {
        if (!_this.first_tab_wrapper) {
          _this.first_tab_wrapper = new _this.$BScroll(
            _this.$refs.first_tab_wrapper,
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
            _this.$refs.second_tab_wrapper,{
              scrollX: true,
              scrollY: false,
              click: true,
              bounce:{
                left:false,
                right:false
              }
            }
          )
        }else{
          _this.second_tab_wrapper.refresh();
        }
        if(!_this.style_wrapper){
          _this.style_wrapper = new _this.$BScroll(
            _this.$refs.style_wrapper,{
              scrollX: false,
              scrollY: true,
              click: true
            }
          );
        }
      });
    },
    firstClick(val) {
      this.firstSelected = val;
    },
    secondClick(val) {
      this.secondSelected = val;
    },
    goStyle(val){
      let _this = this;
      _this.$router.push({path:"/styleDetail",query:{"collId":val}});
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
        let data = res.data;
        if(data.code=="200"){
          _this.firstTabs = data.data;
          _this.$refs.firstNavbar.style.width = _this.firstTabs.length * 3.3 + "rem";
          if(_this.firstSelected==""){
            _this.firstSelected = parseInt(subId);
          }
        }
      })
      .catch();
    },
    getClassifyList(){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":2
      }
      _this.$axios.post("/api/dic/normalList",params)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            _this.secondTabs=data.data;
            if(_this.secondSelected==""){
              _this.secondSelected = _this.secondTabs[0].id;
            }

          }
          _this.$refs.secondNavBar.style.width = _this.secondTabs.length * 2.5+ "rem";
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
        "modeId":_this.secondSelected
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
    }
  },
  mounted() {
    let _this = this;
    let id = _this.$route.query.id;
    let sId = _this.$route.query.sId;
    _this.title=_this.$route.query.title;
    _this.getSituationList(id,sId);
    _this.getClassifyList();
    _this.initOrLoadScrollView();
  },
  watch:{
    firstSelected:function(newV,oldV){
      this.getCollectionList();
    },
    secondSelected:function(newV,oldV){
      this.getCollectionList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.first_navbar {
  overflow: hidden;
  height: 1.4rem;
  background-color: #fff;
  font-size: 0.4rem;
  line-height: 1rem;
}
.first_navbar_item {
  list-style: none;
  float: left;
  width: 3.1rem;
  text-align: center;
  display: block;
  margin: 0.1rem;
}
.first_navbar_item.active {
  background-color: #00a4ff;
  color: #fff;
}
.second_navbar {
  overflow: hidden;
  font-size: 0.38rem;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
}
.second_navbar_item {
  float: left;
  background-color: #91c11f;
  width: 2.5rem;
  color: #fff;
}
.second_navbar_item.active {
  background: #fff;
  color: #000;
}
.style_list_box{
  overflow:hidden;
  height:14.6rem;
  /* margin-top: 0.8rem; */
}
.style_list_content{
  overflow: hidden;
  width: 90%;
  margin: 0rem auto;
  /* padding-bottom: 3rem; */
}
.style_box{
  float:left;
  text-align: center;
  font-size:0.4rem;
  margin-right: 0.48rem;
  margin-bottom: 0.6rem;
  margin-top:0.4rem;
}
.style_box img{
  width: 4rem;
  height: 4rem;
}
</style>
