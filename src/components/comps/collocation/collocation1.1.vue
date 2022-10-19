<template>
  <VueActions class="main" @touchmove.prevent data="collMain">
    <div class="head-list-box">
      <div class="hd_container" ref = "head_tab_wrapper">
        <ul class="hd_tab_wrap" >
          <li
            v-for="(item, index) in headTabs" :key="index" :id="item.id"
            class="hd_tab_item select-none"
            :class="{active: item.id == selected}"
            @click="set_tab_index(item.id,$event)"
            v-actions:fitOccasion.click
          >
            {{item.fitOccasionName}}
          </li>
          <!-- <i class="cursor" ref="cursor"></i> -->
        </ul>
      </div>
      <div class="funnel-icon-box select-none" @click="showSelectBox()" v-actions:showSelect.click>
        <img src="../../../../static/images/icon/funnel.png" alt="">
      </div>
    </div>

    <!-- <div v-show="collocationList.length>0 " class="right_content"  ref="contentScroll">
      <div class="scroll_content">
        <ul class="goods_list select-none" >
          <li
            v-for="(item, index) in collocationList"
            :key="index" @click="goCollocationDetail(item.id)">
            <div class="img_wrap ">
              <img height="100%" loaded :src="item.imgUrl" alt="" @load="imgLoad">
            </div>
            <p class="goods_name select-none">{{item.collName}}</p>
          </li>

          <div v-if="isOver" class="bottom-tip select-none">
            <span class="hr_block"></span>
            <span class="no-desc">我是有底线的</span>
            <span class="hr_block"></span>
          </div>

        </ul>
      </div>
    </div>
    <div v-if="collocationList.length<=0" class="empty_box select-none">
      <img src="static/images/icon/search_icon_empty.png">
      <div>没有筛选到合适搭配，再去试试吧</div>
    </div> -->


    <div class="coll-loading-box" v-if="collLoading == true">
      <van-loading color="#00a2ea"  />
    </div>
    <div v-show="collLoading == false" class="right_content"  ref="contentScroll">
      <div v-if="collocationList.length > 0" class="scroll_content" ref="collConBody" key="collList">
        <ul class="goods_list select-none" >
          <li
            v-for="(item, index) in collocationList"
            :key="index" @click="goCollocationDetail(item.id)" v-actions:goCollDetail.click>
            <div class="img_wrap ">
              <!-- <img loaded :src="item.imgUrl" alt="" @load="imgLoad"> -->
              <img height="100%" loaded v-lazy="item.imgUrl" alt="" @load="imgLoad">
            </div>
            <p class="goods_name select-none">{{item.collName}}</p>
          </li>

        </ul>
        <div v-if="isOver" class="bottom-tip select-none">
          <loadAll></loadAll>
        </div>
        <div style="height:0.5px;background:transprant;"></div>
      </div>
      <div v-else class="empty_box select-none">
        <img src="static/images/icon/search_icon_empty.png">
        <div class="no-result">没有筛选到合适搭配，再去试试吧</div>
      </div>
    </div>

    <!-- 右侧弹出框 -->
    <transition name="fade">
      <div class="mask-bg" v-show="showSelect" @click="hideMask" v-actions:hideMask.click></div>
    </transition>

    <transition name="slideCon">
      <div  class="select-list-box" v-show="showSelect">
        <div class="cancel-block" @click="hideMask" v-actions:hideMsk.click>
          <img src="../../../../static/images/icon/back.png" alt="" class="back-icon">
          <span>搭配筛选</span>
        </div>

        <div class="list-box"  ref="selectScrollWrap">
          <div class="list-container">
            <!-- 系列 -->
            <div class="select-item" v-if="seriesList.length>0" key="selectItem">
              <div class="tit-box">
                <span class="item-dot"></span>
                <span class="item-tit">系列</span>
              </div>
              <div class="series-box">
                <div class="series-item clear">
                  <div class="series-item-name fl"
                    v-for="(item, index) in seriesList"
                    :class="{active:item.id==seriesSelected}"
                    :key="index"
                    @click="chooseSeries(item.id)"
                    v-actions:chooseSeries.click>
                    {{item.seriesName}}
                  </div>
                </div>
              </div>
            </div>

            <!-- 场合 -->
            <div class="select-item">
              <div class="tit-box">
                <span class="item-dot"></span>
                <span class="item-tit">场合</span>
              </div>
              <div class="series-box">
                <div class="series-item clear">
                  <div class="series-item-name fl"
                    v-for="(item, key) in tabs "
                    :key="key"
                    :class="{active:item.id==liselected}"
                    @click="choose(item.id)"
                    v-actions:choose.click>
                    {{item.fitOccasionName}}
                  </div>
                </div>
              </div>
            </div>
            <!-- 风格 -->
            <div class="select-item" v-if="viewList.length != 0" key="selectStyle">
              <div class="tit-box">
                <span class="item-dot"></span>
                <span class="item-tit">风格</span>
              </div>
              <div class="series-box">
                <div class="series-item clear">
                  <div class="series-item-name fl"
                    v-for="(item, index) in viewList"
                    :class="{active:item.id==viewListSelected}"
                    :key="index" @click="goCollection(item.id)"
                    v-actions:goCollect.click
                    >
                    {{item.fitOccasionName}}
                  </div>
                </div>
              </div>
            </div>
            <!-- 品类 -->
            <div class="select-item" v-if="kindsList.length != 0" key="selectCate">
              <div class="tit-box">
                <span class="item-dot"></span>
                <span class="item-tit">品类</span>
              </div>
              <div class="series-box">
                <div class="series-item clear">
                  <div class="series-item-name kinds-item-name fl"
                    v-for="(item, index) in kindsList"
                    :class="{active:item.id==kindsListSelected}"
                    :key="index" @click="selectKind(item.id)"
                    v-actions:selectCate.click.duration>
                    {{item.fitOccasionName}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="button-box">
          <div class="reset" @click="resetSelected" v-actions:reset.click>重置</div>
          <div class="confirm active" @click="confirmSelected" v-actions:confirm.click>确定</div>
        </div>
      </div>
    </transition>

  </VueActions>
</template>

<script>
import loadAll from '../common/loadAll';
export default {
  name: "",
  components: { loadAll },
  data() {
    return {
      headTabs:[],  // 波段
      selected: -1,    // seasonId  一进来即会默认选择一个波段，不会选1
      labelName:"",
      tabs:[],    // 场合
      liselected:0,  // 被选场合,接口里面没有这个查询条件
      liselectedValue:"",
      kindsList:[],   // 品类
      kindsListSelected:-1,  // modeId
      seriesList:[],    // 系列
      seriesSelected:-1,  // seriesId
      styleName:'',     // 商品名称
      viewList:[],    //  风格
      viewListSelected:-1,  // 被选风格id,接口里的 sId 即为这一项

      // tabs:{},
      // ============
      showSelect:false,

      collocationList:[],   // 查询出来的搭配列表
      currentPage:1,
      pageSize:6,
      isLoaded:true,
      isOver:false,
      picCount:0,

      seasonRefrash:false,
      changeSeasonRefrash:false,
      confirmRefrash:false,
      scrollRefresh:false,

      collLoading:true,   // 搭配页面点击波段时请求数据的loading
      reloadFlag:true,   // 从搭配详情回来是否重新加载数据
    };
  },

  methods: {
    imgLoad(){
      this.picCount++;
    },
    showSelectBox(){
      this.showSelect = true;
      // console.log("点击筛选按钮")
      this.getSituation();
    },
    hideMask(){
      this.showSelect =false;
    },

    resetSelected(){
      let _this = this;
      _this.liselected = 0;       // 场合  接口里没有这个参数
      _this.viewListSelected = -1;   // sId
      _this.kindsListSelected = -1;   // modeId
      _this.seriesSelected = -1;
      _this.kindsList = [];
    },
    confirmSelected(){
      // 确认之后需要根据传的参数调用接口请求数据
      let _this = this;
      _this.currentPage = 1;
      _this.collocationList = [];
      _this.confirmRefrash = true;
      let seasonId = _this.selected;
      let sId = _this.viewListSelected;
      let modeId = _this.kindsListSelected;
      let seriesId = _this.seriesSelected;

      _this.getCollocationList(seasonId,sId,modeId,seriesId);
    },
    getCollocationList(seasonId,sId,modeId,seriesId){
      let _this=this;
      _this.showSelect = false;
      // console.log(_this.seasonRefrash, _this.changeSeasonRefrash, _this.confirmRefrash)
      // if(_this.seasonRefrash || _this.changeSeasonRefrash || _this.confirmRefrash){
      //     _this.collocationList = [];
      // }
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "sId": sId,                         // 风格
        "modeId":modeId,    //品类
        "seasonId": seasonId,           // 波段
        "seriesId":seriesId,
        "currentPage": _this.currentPage,
        "pageSize": _this.pageSize,
      }
      // console.log(params)
      _this.$axios.post("/api/coll/collList",params)
      .then(function (res){
        // console.log("请求搭配列表")
          let data = res.data;
          if(data.code=="200"){
            _this.collLoading = false;
            // console.log("筛选出的搭配列表为",data.data)
            if(!_this.scrollRefresh){
              _this.collocationList = [];
              // console.log("000000",_this.collocationList)
            }
            // console.log("1111",_this.collocationList)

            if(_this.currentPage == 1){
              _this.collocationList = data.data.list;
            }else{
              _this.collocationList = _this.collocationList.concat(data.data.list);
            }
            console.log("2222 ==_this.collocationList===",_this.collocationList)
            _this.isLoaded = true;
            _this.isOver = data.data.isLastPage;

          }
        // _this.$refs.contentScroll(0,200,200)
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    goCollocationDetail(val){
      let _this = this;
      _this.$router.push({path:"/styleDetail",query:{"collId":val,stemp:new Date().getTime()}});
    },

    set_tab_index(val){
      let _this = this;
      // console.log("切换波段时新波段是",val,"_this.selected为",_this.selected)
      this.scrollRefresh = false;
      // this.collocationList = [];
      if(_this.selected!=val){
        localStorage.collFirstSel = val;
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
        _this.getSeriesList();

        localStorage.collFirstSel = val;
        localStorage.removeItem('goodsSecondSel');
        _this.changeSeasonRefrash = true;
        _this.collocationList = [];
        let seasonId = _this.selected;
        let sId = -1;
        let modeId = -1;
        let seriesId = -1;
        _this.currentPage = 1;
        _this.getCollocationList(seasonId,sId,modeId,seriesId);
      }
    },
    goCollection(val){
      // console.log(val)
      let _this=this;
      localStorage.collFirstSel = _this.selected;
      // localStorage.collSecondSel = _this.liselected;

      _this.viewListSelected = val;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "typeId":2,
        "seasonId":_this.selected,
        "sId":_this.viewListSelected,
      }
      _this.$axios.post("/api/dic/normalList",params)
      .then(function (res){
          let data = res.data;
          if(data.code=="200"){
            // console.log("三级分类品类列表_this.kindsList为",data)
            _this.kindsList=data.data;
          }
      })
      .catch(function (error) {
          console.log(error);
      });

    },
    chooseSeries(id){
      let _this = this;
      if(id!=_this.seriesSelected){
        _this.seriesSelected = id;
      }
    },
    choose: function(id) {
      let _this = this;
      _this.kindsList = [];
      if(id!=_this.liselected){
        _this.liselected = id;
      }
    },

    getSeriesList(){
      let _this = this;
      let brandId = localStorage.brandId;
      let params = {
        "brandId":brandId,
        "seasonId":_this.selected,    //波段id
      }
      // console.log(params)
      _this.$axios.post("/api/series/sList",params)
      .then(function(res){
        let data = res.data;
        if(data.code=="200"){
          _this.seriesList = data.data;
          //  console.log("获取系列筛选项列表数据为",_this.seriesList)
          _this.seriesSelected = _this.seriesSelected?_this.seriesSelected:_this.seriesList[0].id;
        }
      })
      .catch(function(error){
        console.log(error);
      });
    },
    selectKind(val){
      // console.log("品类选择为",val)
      this.kindsListSelected = val
    },

    initAndReloadScroll(){
      // console.log("搭配页面初始化")
      let _this = this;
      // console.log("默认滚动111,",localStorage.defaultScrollFlag)
      if(localStorage.defaultScrollFlag == 'true'){
        // 当屏幕首次渲染时，不会触发scroll 事件，请主动调用一次事件处理程序，否则若用户不滚动则首屏的图片会一直使用懒加载的默认图片
        let seasonId = _this.selected;
        let sId = _this.viewListSelected;
        let modeId = _this.kindsListSelected;
        let seriesId = _this.seriesSelected;
        // let sId = -1;
        // let modeId = -1;
        // let seriesId = -1;
        _this.currentPage = 1;
        console.log("进入搭配页面主动触发一次事件处理函数")
        _this.getCollocationList(seasonId,sId,modeId,seriesId);
        // console.log("默认滚动222,",localStorage.defaultScrollFlag)
        localStorage.defaultScrollFlag = false;
      }

      _this.$nextTick(()=>{
        if(!_this.headTabScroll){
          _this.headTabScroll = new _this.$BScroll(_this.$refs.head_tab_wrapper,{
            scrollX:true,
            scrollY:false,
            click:true,
            bounce:false,
            useTransition:false,
          });
        }else{
          _this.headTabScroll.refresh();
        }

        if(!_this.sessionScroll){
            _this.sessionScroll = new _this.$BScroll(_this.$refs.contentScroll,{
            click:true,
            scrollX:false,
            scrollY:true,
            probeType:3,
            useTransition:false,
          });
          // console.log(_this.sessionScroll)
          // _this.$refs.collConBody.scrollTo(0,300,300);
          // _this.sessionScroll.scrollTo(0,300,300)
          _this.sessionScroll.on("scroll",(pos)=>{
            // console.log("---------------------")
            //  console.log(pos.y,_this.sessionScroll.maxScrollY)
            if(pos.y-_this.sessionScroll.maxScrollY<600 && _this.isLoaded && !_this.isOver){
              // console.log("page+++")
              _this.isLoaded=false;
              _this.scrollRefresh = true;
              _this.currentPage++;
              // console.log(_this.currentPage)

              let seasonId = _this.selected;
              let sId = _this.viewListSelected;
              let modeId = _this.kindsListSelected;
              let seriesId = _this.seriesSelected;
              _this.getCollocationList(seasonId,sId,modeId,seriesId);
            }
          });
        }else{
          _this.sessionScroll.refresh();
        }

        // 筛选条件滚动区域
        if(_this.showSelect){
          _this.$nextTick(function(){
            if(!_this.selectScroll){
              _this.selectScroll = new _this.$BScroll(_this.$refs.selectScrollWrap,{
                scrollY:true,
                click:true,
                useTransition:false,
              });
            }else{
              _this.selectScroll.refresh();
            }
          });
        }

      });

    },
    // 获取季节波段
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
            // console.log("搭配页面获取的seasonlist为,",data)
            _this.headTabs=data.data;
            // console.log(_this.headTabs)
            // console.log("缓存之前的季节波段id",localStorage.collFirstSel)
            _this.selected=(localStorage.collFirstSel==null || localStorage.collFirstSel==undefined)?_this.headTabs[0].id:localStorage.collFirstSel;
           _this.getSeriesList();
            // console.log(_this.selected)

            _this.seasonRefrash = true;


            // let seasonId = _this.selected;
            // let sId = _this.viewListSelected;
            // let modeId = _this.kindsListSelected;
            // let seriesId = _this.seriesSelected;
            // console.log("888888",seasonId,sId,modeId,seriesId)
            // _this.currentPage = 1;
            // _this.getCollocationList(seasonId,sId,modeId,seriesId);
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    },
    // 获取对应波段筛选列表
    getSituation(){
      let _this = this;
      let brandId = localStorage.brandId;
      // console.log(brandId)
      let params = {
        "brandId":brandId,
        "typeId":3
      }
      _this.$axios.post("/api/dic/situationTree",params)
      .then(function(res){
        let data = res.data;
        // console.log("获取筛选项列表数据为",data)
        if(data.code=="200"){
          _this.tabs = data.data;
          // _this.liselected = localStorage.collSecondSel==null?_this.tabs[0].id:localStorage.collSecondSel;
          // _this.liselected = _this.tabs[0].id;
          // _this.liselected = -1;

        }
      })
      .catch(function(error){
        console.log(error);
      });
    },

  },
  created(){
    this.getSeasonList();   // 获取头部季节波段列表
  },
  updated(){
    this.initAndReloadScroll();
    // ===========================
    // let img = document.getElementsByClassName('right_content')[0].getElementsByTagName('img')
    // console.log(document.getElementsByClassName('right_content')[0])
    // console.log(img)
    // let count = 0
    // let length = img.length;
    // if (length) {
    //     let timer = setInterval(() => {
    //         if (count == length) {
    //             // console.log('refresh')
    //             this.sessionScroll.refresh()
    //             clearInterval(timer)
    //         } else if (img[count].complete) {
    //             count ++
    //         }
    //     }, 100)
    // }
    // =========================
  },

  mounted() {
    // let _this = this;
    // _this.getSeasonList();   // 获取头部季节波段列表
    // _this.getSituation();     // 获取场合信息
    // _this.getSeriesList();    // 根据品牌ID获取系列列表
    // this.$refs.contentScroll.scrollTo(0,300,300);
  },
  activated(){
    // console.log("collocation====activated========");
    // this.getSeasonList();   // 获取头部季节波段列表
    // this.getSituation();
    if(this.reloadFlag){
      console.log("从其他页面进入搭配列表")
      this.getSeasonList()
    }
    // else{
    //   console.log("不重新加载搭配数据")
    // }
  },
  watch:{
    $route(from,to){
      // console.log(from.path,to.path);
      if(to.path == '/styleDetail'){
        // console.log("从搭配详情页返回到搭配页面")
        this.reloadFlag = false;
      }else{
        // console.log("从其他页面返回到搭配页面")
        this.reloadFlag = true;
      }
    },
    selected:function(newV,oldV){
      // console.log("1234567890",newV,oldV)
      if(newV != oldV){      // 波段若发生变化,筛选列表重置
        this.liselected = -1;   // 场合
        this.seriesSelected = -1;   // 系列
        this.viewListSelected = -1;   // 风格
        this.kindsListSelected = -1;
        this.viewList = [];
        this.kindsList = [];
        this.collLoading = true;
      }else{
        // console.log("点击相同波段时",newV,oldV)
        this.collLoading = false;
      }

      for(var i =0;i<this.headTabs.length;i++){
        if(newV==this.headTabs[i].id){
          let num = i*100;
          // this.$refs.cursor.style.transform= 'translateX('+num+'%)';
          this.labelName = this.headTabs[i].fitOccasionName;
          break;
        }
      }
    },
    liselected:function(newV){
      let _this = this;
      for(var i=0;i<_this.tabs.length;i++){
        if(_this.tabs[i].id==newV){
          // console.log(_this.tabs)
          _this.viewList = _this.tabs[i].subList;
          // console.log(_this.viewList)
          _this.liselectedValue = _this.tabs[i].fitOccasionName;
          break;
        }
      }
    },
    picCount:function(newV){
      // console.log("加载"+newV);
      // console.log("总共"+document.querySelectorAll("img[loaded]").length);
      if(document.querySelectorAll("img[loaded]").length<=(newV+2)){
        this.initAndReloadScroll();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../../assets/css/commom.css";
@import "../../../assets/componentCss/collacation";

.main{
  width: 100%;
  height:100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.coll-loading-box{
  // border:0.5px solid #000;
}
.van-loading, .van-loading__spinner {
  position: relative;
  left:25px;
  top:80px;
  vertical-align: middle;
}
.van-loading__spinner {
  width: 7.4rem;
  height: 1rem;
}
.no-result{
  font-size:14px;
}

.head-list-box{
  width:100%;
  border-bottom:0.5px solid #ebebeb;
}
.hd_container {
  width: 88%;
  overflow: hidden;
  flex-shrink: 0;
  // border-bottom: 0.5px solid #ebebeb;
  // border:0.5px solid #000;
}
.hd_tab_wrap {
  font-size: 16px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 17.5px;
  // padding-bottom: 2.5px;
  overflow: hidden;
  display: inline-flex;
  flex-wrap: nowrap;
  position: relative;
}
.hd_tab_item {
  /* float: left; */
  width: 2.72rem /* 204/75 */;
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #1A1A1A;
}
.hd_tab_item.active {
  position: relative;
  color: #00A2EA;
}
.content {
  flex: 1;
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
  width:100%;
  flex: 1;
  overflow: hidden;
  // border:0.5px solid #000;
}
.right_content .scroll_content{
  // background-color:pink;

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
  flex:1;
  padding-top: 15px;
  box-sizing: border-box;
  width:100%;
}
.goods_list li {
  padding:0.5px;
  width: 44%;
  margin-left:4%;
  padding-bottom: 10px;
  margin-bottom:15px;
  border:0.5px solid #f3f3f3;
}
.img_wrap {
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img_wrap img {
  width:100%;
  // height:165px;
}
.goods_name {
  font-size:14px;
  text-align: center;
  margin-top: 12px;
}

.empty_box{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:420px;
}
.empty_box img{
  width: 128px;
  height: 128px;
}
.empty_box div{
  margin-top: 20px;
  color: #bfbfbf;
}
.bottom-tip{
  margin:0 auto;
}
.select-none{
  user-select: none;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
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
  background-color: #00A2EA;
  height: 100%;
  width: 60%;
  margin: 0 auto;
  content: ""
}
</style>
