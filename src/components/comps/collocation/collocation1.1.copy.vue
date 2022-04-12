<template>
  <div class="main" @touchmove.prevent>
    <div class="hd_container" ref = "head_tab_wrapper">
      <ul class="hd_tab_wrap" >
        <li
          v-for="(item, index) in headTabs" :key="index" :id="item.id"
          class="hd_tab_item"
          :class="{active: item.id == selected}"
          @click="set_tab_index(item.id,$event)"
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
            v-for="(item, key) in tabs "
            :key="key"
            :class="{active:item.id==liselected}"
            class="left_tab_item"
            @click="choose(item.id)"
          >
            <p>{{item.fitOccasionName}}</p>
          </li>
        </ul>
      </div>
      <!-- 右侧内容 -->
      <div class="right_content"  ref="contentScroll">
        <div class="scroll_content">
          <p class="top">
            <span></span>&nbsp;{{labelName}}系列&nbsp;<span></span>
          </p>
          <ul class="goods_list">
            <li
              v-for="(item, index) in viewList"
              :key="index" @click="goCollection(item.id)"
            >
              <div class="img_wrap">
                <img
                  height="100%"
                  :src="item.occCover"
                  alt=""
                >
              </div>
              <p class="goods_name">{{item.fitOccasionName}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      selected: 0,
      tabs:[
      ],
      liselected:0,
      liselectedValue:"",
      headTabs:[
      ],
      tabs:{},
      viewList:[],
      labelName:""
    };
  },
  components: {
  },
  methods: {
    set_tab_index(val){
      let _this = this;
      if(_this.selected!=val){
        if(val>_this.selected){
          _this.headTabScroll.scrollToElement(event.currentTarget,500);
        }else{
          if(!!event.currentTarget.previousElementSibling){
            _this.headTabScroll.scrollToElement(event.currentTarget.previousElementSibling,500);
          }else{
            _this.headTabScroll.scrollToElement(event.currentTarget,500);
          }
        }
        _this.selected=val;
        localStorage.removeItem('goodsSecondSel');
      }
    },
    goCollection(val){
      let _this=this;
      localStorage.collFirstSel = _this.selected;
      localStorage.collSecondSel = _this.liselected;
      let route = {
        path:"/style",
        query:{
          id:_this.liselected,
          sId:val,
          title:_this.liselectedValue,
          seasonId:_this.selected,
          stamp:new Date().getTime()
        }
      }
      _this.$router.push(route);
    },
    choose: function(id) {
      let _this = this;
      if(id!=_this.liselected){
        _this.liselected = id;
      }
    },
    initAndReloadScroll(){
      let _this = this;
      _this.$nextTick(()=>{
        if(!_this.headTabScroll){
          _this.headTabScroll = new _this.$BScroll(_this.$refs.head_tab_wrapper,{
            scrollX:true,
            scrollY:false,
            click:true,
            bounce:false
          });
        }else{
          _this.headTabScroll.refresh();
        }
        if(!_this.menuScroll){
          _this.menuScroll = new _this.$BScroll(_this.$refs.leftTabScroll,{
            click:true
          });
        }else{
          _this.menuScroll.refresh();
        }
        if(!_this.sessionScroll){
            _this.sessionScroll = new _this.$BScroll(_this.$refs.contentScroll,{
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
            _this.selected=localStorage.collFirstSel==null?_this.headTabs[0].id:localStorage.collFirstSel;
          }
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
          _this.tabs = data.data;
          _this.liselected = localStorage.collSecondSel==null?_this.tabs[0].id:localStorage.collSecondSel;
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
    selected:function(newV){
      let _this = this;
      for(var i =0;i<_this.headTabs.length;i++){
        if(newV==_this.headTabs[i].id){
          let num = i*100;
          _this.$refs.cursor.style.transform= 'translateX('+num+'%)';
          _this.labelName = _this.headTabs[i].fitOccasionName;
          break;
        }
      }
    },
    liselected:function(newV){
      let _this = this;
      for(var i=0;i<_this.tabs.length;i++){
        if(_this.tabs[i].id==newV){
          _this.viewList = _this.tabs[i].subList;
          _this.liselectedValue = _this.tabs[i].fitOccasionName;
          break;
        }
      }
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
.hd_container {
  width: 90%;
  overflow: hidden;
  border-bottom: 0.5px solid #ebebeb;
  flex-shrink: 0;
  border:0.5px solid #000;
}
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
  /* height: 100%; */
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
  margin-top: 21px;
}
.goods_list li {
  width: 33.33%;
  padding-bottom: 25px;
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
