webpackJsonp([38],{"59j1":function(t,s){},"6tmq":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});e("XmAh");var a=e("il3B"),i=e("SQ1s"),n=e("tdg1"),o={name:"newsPage",components:{backHeader:i.a,noGood:n.a},data:function(){return{newsType:[],activeType:2,currentPage:1,pageSize:10,msgList:[],newsTotal:0,newsLoading:!1}},created:function(){},mounted:function(){this.getNewsType(),this.getNewsList()},activated:function(){this.getNewsType()},watch:{$route:function(t,s){if("/msgDetail"==s.path)for(var e=0;e<this.msgList.length;e++)this.msgList[e].id==s.query.msg.id&&(this.msgList[e].isRead=1)}},methods:{back:function(){this.$router.go(-1)},getNewsType:function(){var t=this,s=(localStorage.getItem("userId"),{brandId:localStorage.brandId,userId:localStorage.userId});t.$axios.post("/api/msg/getMsgTypes",s).then(function(s){var e=s.data;"200"==e.code?t.newsType=e.data.data:t.$toast("请求失败！")}).catch(function(s){console.log(s),t.$toast("请求失败！")})},clickTab:function(t){this.activeType=t,this.currentPage=1,this.msgList=[],this.newsLoading=!0,this.getNewsList()},getNewsList:function(){var t=this,s=(localStorage.getItem("userId"),{brandId:localStorage.brandId,userId:localStorage.userId,currentPage:t.currentPage,pageSize:t.pageSize,type:t.activeType});t.$axios.post("/api/msg/getMsgList",s).then(function(s){t.newsLoading=!1;var e=s.data;"200"==e.code?(t.newsTotal=e.data.total,1==t.currentPage?t.msgList=e.data.list:t.msgList=t.msgList.concat(e.data.list)):t.$toast("请求失败！")}).catch(function(s){console.log(s),t.$toast("请求失败！")})},newsRefresh:function(){this.currentPage=1,this.getNewsList()},newsLoadMore:function(){this.msgList.length<this.newsTotal?(this.currentPage++,this.getNewsList()):this.$refs.newsConScroll.update(!0)},toNewsDetail:function(t){console.log("详情----",t),this.$router.push({path:"/msgDetail",query:{msg:t}})},deleteMsg:function(t,s){var e=this;console.log("删除消息id===",t,s),a.a.confirm({title:"提示",message:"确认删除该条消息吗？"}).then(function(){var a=e,i={msgId:t,userId:localStorage.userId};console.log("删除消息",i),a.$axios.post("/api/msg/delMsg",i).then(function(t){a.msgList.splice(s,1),a.getNewsType()}).catch(function(t){console.log(t)})}).catch(function(){})}}},c={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"newsPage"}},[e("div",{staticClass:"headBox"},[e("backHeader",{attrs:{title:"消息"}},[e("span",{staticClass:"head-class f-l",attrs:{slot:"left"},on:{click:t.back},slot:"left"},[t._t("default",[e("img",{staticClass:"back-icon",attrs:{src:"static/images/dev/back@2x.png",alt:""}})])],2),t._v(" "),e("span",{staticClass:"head-class place-label",attrs:{slot:"right"},slot:"right"})])],1),t._v(" "),e("div",{staticClass:"tabBox"},t._l(t.newsType,function(s,a){return e("div",{key:a,staticClass:"tabItem",class:t.activeType==s.type?"active":"",on:{click:function(e){t.clickTab(s.type)}}},[e("span",[t._v(t._s(s.msgTypeRemark))]),t._v(" "),e("span",[t._v("("+t._s(s.count)+")")])])})),t._v(" "),1==t.newsLoading?e("div",[e("van-loading",{attrs:{color:"#00a2ea"}})],1):t._e(),t._v(" "),e("Scroll",{ref:"newsConScroll",staticClass:"newsConBox",attrs:{"update-data":[t.msgList],"refresh-data":[],listenScroll:!0,autoUpdate:!1,scrollX:!1,scrollY:!0},on:{pullingDown:t.newsRefresh,pullingUp:t.newsLoadMore}},[t.msgList.length>0?e("div",{staticClass:"msgList"},t._l(t.msgList,function(s,a){return e("div",{key:a,on:{click:function(e){t.toNewsDetail(s)}}},[e("van-swipe-cell",[e("div",{staticClass:"newsItem"},[e("div",{staticClass:"newsIcon"},[s.isRead?e("img",{attrs:{src:"static/images/icon/read-no.png",alt:""}}):e("img",{attrs:{src:"static/images/icon/readed.png",alt:""}})]),t._v(" "),e("div",{staticClass:"msgBrief"},[e("div",{staticClass:"inner",domProps:{innerHTML:t._s(s.content)}}),t._v(" "),e("div",{staticClass:"time"},[t._v(t._s(s.createDate))])])]),t._v(" "),1!=t.activeType&&2!=t.activeType?e("template",{slot:"right"},[e("van-button",{attrs:{square:"",type:"danger",text:"删除"},on:{click:function(e){t.deleteMsg(s.id,a)}}})],1):t._e()],2)],1)})):e("div",{staticStyle:{"padding-top":"0.5px"}},[e("noGood")],1)])],1)},staticRenderFns:[]};var l=e("VU/8")(o,c,!1,function(t){e("59j1")},"data-v-37a1ddf5",null);s.default=l.exports}});