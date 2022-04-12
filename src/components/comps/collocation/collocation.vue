<template>
  <!-- <div style="position:relative;top:0px;">
      <div class="head_tab">
          <div class="head_tab_wrapper" ref="head_tab_wrapper">
              <mt-navbar v-model="selected" class="head_tab_bar" ref="head_tab_bar">
                <mt-tab-item v-for="(item, index) in headTabs" :key="index" :id="item.id">{{item.fitOccasionName}}</mt-tab-item>
              </mt-navbar>
          </div>
      </div>
      <div class="head_tab_container">
        <div class="row" id="tabemplyee">
          <div class="e_tab">
            <div class="menu_scroll_wrapper" ref="menu_scroll_wrapper">
              <div>
                <ul class="e_navbar">
                  <li class="e_navbar_item"
                    v-for="(item, index) in situationList"
                    :class="{'active':item.id===liselected}"
                    @click="choose(item)" v-bind:key="index">{{item.fitOccasionName}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="session_view">
            <div class="loading-box" :class="{'loading':loadingIn,'out':loadingOut}">
              <vue-loading type="spin" color="#00a4ff" :size="{ width: '1rem', height: '1rem' }" ref="loading"></vue-loading>
            </div>
            <div class="session_img_box session_scroll_wrapper" ref="session_scroll_wrapper">
              <div class="session_scroll_content">
                <div class="series_box" v-for="(item,index) in viewList" :key="index"
                  @click="goCollection(item.id)">
                  <img :src="item.occCover"/>
                  <p>{{item.fitOccasionName}}</p>
                </div>
                <div class="white_box">
                </div>
              </div>
            </div>
        </div>
      </div>
  </div> -->
  <div class="">

  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      selected: 0,
      tabs:[
        {name:"日常",value:0},
        {name:"商务",value:0},
        {name:"活动",value:0},
      ],
      liselected:0,
      liselectedValue:"",
      headTabs:[
        {name:"18春夏",value:0},
        {name:"18秋冬",value:1},
        {name:"19春夏",value:2},
        {name:"19秋冬",value:3}
      ],
      situationList:{},
      viewList:[],
      loadingIn:false,
      loadingOut:false,
    };
  },
  components: {
  },
  methods: {
    goCollection(val){
      let _this=this;
      let route = {
        path:"/style",
        query:{
          id:_this.liselected,
          sId:val,
          title:_this.liselectedValue
        }
      }
      _this.$router.push(route);
    },
    choose: function(item) {
      this.liselected = item.id;
      this.viewList = item.subList;
      this.liselectedValue = item.fitOccasionName;
    },
    initAndReloadScroll(){
      let _this = this;
      _this.$nextTick(()=>{
        if(!_this.headTabScroll){
          _this.headTabScroll = new _this.$BScroll(_this.$refs.head_tab_wrapper,{
            scrollX:true,
            scrollY:false,
            click:true,
            bounce:{
              left:false,
              right:false
            }
          });
        }else{
          _this.headTabScroll.refresh();
        }
        if(!_this.menuScroll){
          _this.menuScroll = new _this.$BScroll(_this.$refs.menu_scroll_wrapper,{
            click:true
          });
        }else{
          _this.menuScroll.refresh();
        }
        if(!_this.sessionScroll){
            _this.sessionScroll = new _this.$BScroll(_this.$refs.session_scroll_wrapper,{
            click:true
          });
        }else{
          _this.sessionScroll.refresh();
        }
      });
    },
    getSeasonList(){
      let _this =  this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":1
      }
      _this.$axios.post("/api/dic/normalList",params)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            _this.headTabs=data.data;
            if(!_this.selected){
              _this.selected = _this.headTabs[0].id;
            }
          }
          _this.$refs.head_tab_bar.$el.style.width = 4* _this.headTabs.length +"rem";
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    getSituation(){
      let _this = this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":3
      }
      _this.$axios.post("/api/dic/situationTree",params)
      .then(function(res){
        let data = res.data;
        if(data.code=="200"){
          _this.situationList = data.data;
          if(_this.liselected==""){
            _this.liselected = parseInt(_this.situationList[0].id);
            _this.viewList = _this.situationList[0].subList;
          }
        }
      })
      .catch(function(error){
        console.log(error);
      });
    },

  },
  updated(){
    this.initAndReloadScroll();
  },
  mounted() {
    let _this = this;
    _this.getSeasonList();
    _this.getSituation();
    _this.initAndReloadScroll();
  },
  watch:{
    liselected:function(newV,oldV){
      let _this = this;
      if(!_this.loadingIn){
        _this.loadingIn=true;
        setTimeout(function(){
          _this.loadingIn=false;
        },800);
      }
    },
    selected:function(newV,oldV){
      let _this = this;
      if(!_this.loadingIn){
        _this.loadingIn=true;
        setTimeout(function(){
          _this.loadingIn=false;
        },800);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.session_scroll_content{
  overflow: hidden;
  margin-top:1rem;
}
.menu_scroll_wrapper{
  overflow: hidden;
}
.session_view{
  float: left;
  width: 70%;
  height: 15.3rem;
  background-color: #fff;
}






* {
  padding: 0;
  margin: 0;
}
.head_tab_container{
    width:100vw;
    margin-top:2px;
}
.head_tab_bar{
    width:24rem;
    font-size:7px;
}
#tabemplyee {
  width: 30%;
  height: 14.4rem;
  margin: 0 auto;
  /* background-color: #f0f0f1; */
  float: left;
  font-size: 6px;
}
.mt_tab_container{
  height: 15.3rem;
}
.e_tab {
  height: 100%;
  background-color: #f0f0f1;
  padding: 0;
  width: 100%;
}
.e_tab ul li {
  display: block;
  text-align: center;
  cursor: pointer;
  line-height: 1.2rem;
  border-bottom: transparent;
  font-size: 0.38rem;
}
.e_tab ul li .e_tab_bd {
  margin: 3%;
}
.e_navbar_item.active {
  background-color: #fff;
  color: #00a4ff;
}
/*切换动画*/
.fade-transition {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave {
  opacity: 0;
}
#tabcontainer {
  float: left;
  width: 70%;
  height: 15.3rem;
  background-color: #fff;
}
.tab_item {
  display: none;
}
.tab_item.active {
  display: block;
}
.session_info{
  margin: 10px;
  border: 0.5px solid #dfd5d5;
  padding-top: 7px;
  padding-left: 10px;
  text-align: left;
  border-radius: 7px;
  font-size: 0.5rem;
}
.session_info div{
  margin-bottom: 7.5px;
}
.session_info_row{
  font-size: 0.3rem;
}
.session_img_box{
  padding-left: 19px;
  overflow: hidden;
  height:14.5rem;
}
.series_box{
  float: left;
  margin-right: 20px;
  margin-bottom: 15px;
  font-size: 0.36rem;
}
.series_box img{
  width: 100px;
  height:60px;
}
.series_box p{
  text-align: center;
}
.white_box{
  float: left;
  width:100%;
  height: 1.2rem;
}
.menu_scroll_wrapper{
  height: 100%;
}
.loading-box{
  overflow: hidden;
  height:0rem;
}
.loading-box.loading{
  animation: fadeInOut 1.2s;
}

@keyframes fadeInOut
{
  0% {height: 0rem;}
  50% {height: 1rem;}
  100% {height:0rem;}
}

.head_tab_wrapper{
  width: 100vw;
  overflow: hidden;
}
</style>
