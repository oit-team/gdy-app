webpackJsonp([39],{RYrZ:function(t,s){},hwwt:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});a("Au9i");var e=a("Ylnc"),o=a("SQ1s"),i=a("tdg1"),l=(a("LOkV"),{name:"taskGoodsTask",components:{Header:e.a,backHeader:o.a,noGood:i.a},data:function(){return{bigList:[],selected:"",loadingFlag:!0,seriesList:[],labelName:"",headTabs:[],goodsTestList:[],season:[],date:[],testLoadingFlag:!0,isActive:0}},created:function(){},mounted:function(){},activated:function(){localStorage.removeItem("dateName"),localStorage.removeItem("score"),this.getSeasonList()},watch:{selected:function(t,s){for(var a=0;a<this.headTabs.length;a++)if(t==this.headTabs[a].id){this.labelName=this.headTabs[a].fitOccasionName;break}this.seriesList=[],this.getBandBySeasonId(t)}},methods:{back:function(){localStorage.removeItem("season"),this.$router.push({path:"/index"})},getSeasonList:function(){var t=this,s={brandId:localStorage.brandId,typeId:1};t.$axios.post("/api/dic/normalList",s).then(function(s){"200"==s.data.code&&(t.headTabs=s.data.data,localStorage.season?t.selected==localStorage.season?(t.selected=localStorage.season,t.getBandBySeasonId(t.selected)):t.selected=localStorage.season:t.selected=t.headTabs[0].id)}).catch(function(t){console.log(t)})},set_tab_index:function(t,s){this.selected!=t&&(this.isActive!=s&&(this.isActive<s?this.$refs.goodsScroll.scrollToElement(event.currentTarget,500):event.currentTarget.previousElementSibling?this.$refs.goodsScroll.scrollToElement(event.currentTarget.previousElementSibling,500):this.$refs.goodsScroll.scrollToElement(event.currentTarget,500)),this.isActive=s,this.testLoadingFlag=!0,this.selected=t,this.listType=1)},getBandBySeasonId:function(t){var s=this,a=localStorage.brandId,e={bsCode:localStorage.brandIdGDY,brandId:a,seasonId:t,userId:localStorage.userId};s.$axios.post("/api/series/getGoodsTestResult",e).then(function(t){if(s.testLoadingFlag=!1,"200"==t.data.code){var a=t.data.data;s.bigList=a.bandList}}).catch(function(t){console.log(t)})},taskBtn:function(t){localStorage.removeItem("tpName"),localStorage.season=this.selected,localStorage.dateId=t.id,localStorage.dateName=this.labelName+" "+t.bandName,localStorage.toTestPath="taskGoodsTask",this.$router.push({path:"/taskTest",query:{ceyice:1}})},goodsTestShow:function(t){localStorage.score=t.obj.maxFraction,localStorage.season=this.selected,localStorage.dateId=t.id,localStorage.dateName=this.labelName+" "+t.bandName,this.$router.push({path:"/checkRecord"})}}}),c={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{attrs:{id:"taskGoodsTask"}},[a("div",{staticClass:"headBox",staticStyle:{height:"1.2rem"}},[a("backHeader",{attrs:{title:"商品自测"}},[a("span",{staticClass:"head-class f-l",attrs:{slot:"left"},on:{click:t.back},slot:"left"},[t._t("default",[a("img",{staticClass:"back-icon",attrs:{src:"static/images/dev/back@2x.png",alt:""}})])],2),t._v(" "),a("span",{staticClass:"head-class place-label",attrs:{slot:"right"},slot:"right"})])],1),t._v(" "),a("Scroll",{ref:"goodsScroll",staticClass:"goods-box",attrs:{probeType:3,scrollX:!0,scrollY:!1,autoUpdate:!0,pullDown:!1,pullUp:!1}},[a("div",{staticClass:"goods-ul"},t._l(t.headTabs,function(s,e){return a("div",{key:e,staticClass:"goods-item",class:{active:s.id==t.selected},attrs:{id:s.id},on:{click:function(a){t.set_tab_index(s.id,e)}}},[t._v("\n        "+t._s(s.fitOccasionName)+"\n      ")])}))]),t._v(" "),1==t.testLoadingFlag?a("div",[a("van-loading",{attrs:{color:"#00a2ea"}})],1):a("Scroll",{ref:"goodsBodyScroll",staticClass:"goodsBody",attrs:{probeType:3,bounceTime:0,listenScroll:!0,pullDown:!1,pullUp:!1}},[t.bigList&&t.bigList.length>0?a("div",{staticClass:"scrollCon"},t._l(t.bigList,function(s,e){return a("div",{key:e,staticClass:"scrollTestItem"},[a("div",{staticClass:"goodsListTop"},[a("div",{staticClass:"odiv"}),t._v(" "),a("div",{staticClass:"seriesName"},[t._v(t._s(s.bandName))])]),t._v(" "),a("div",{staticClass:"goodsListBom"},[a("div",{staticClass:"liTop"},[a("div",{staticClass:"tesk"},[a("span",{staticClass:"teskNums"},[t._v("测试次数:")]),a("span",{staticClass:"Num"},[t._v(t._s(s.obj.testCount)+" 次")])]),t._v(" "),a("div",{staticClass:"best"},[a("span",{staticClass:"bestGrade"},[t._v("最好成绩:")]),a("span",{staticClass:"grade"},[t._v(t._s(s.obj.maxFraction)+" 分")])])]),t._v(" "),a("div",{staticClass:"odiv"}),t._v(" "),a("div",{staticClass:"liBom"},[s.obj.testCount&&s.obj.testCount>0?a("div",{staticClass:"taskLiLeft",on:{click:function(a){t.goodsTestShow(s)}}},[a("img",{attrs:{src:"static/images/icon/lishi.png",alt:""}}),t._v(" "),a("span",[t._v("查历史")])]):a("div",{staticClass:"taskLiLeft"}),t._v(" "),a("div",{staticClass:"taskLiRight",on:{click:function(a){t.taskBtn(s)}}},[a("img",{attrs:{src:"static/images/icon/ceyice.png ",alt:""}}),t._v(" "),a("span",[t._v("测一测")])])])])])})):a("div",{staticStyle:{"padding-top":"0.5px"}},[a("noGood")],1)])],1)},staticRenderFns:[]};var n=a("VU/8")(l,c,!1,function(t){a("RYrZ")},"data-v-367adb94",null);s.default=n.exports}});