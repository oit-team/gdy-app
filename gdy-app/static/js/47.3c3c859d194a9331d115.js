webpackJsonp([47],{JhgG:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});a("Au9i");var e=a("Ylnc"),o=a("SQ1s"),i=a("tdg1"),c={name:"taskTest",components:{Header:e.a,backHeader:o.a,noGood:i.a},data:function(){return{goodsTestDetailLoading:!0,goodsTestDetailList:{vResult:[{subTitle:""}]},goodsClassify:[],activeId:3,displayName:"2020冬",title:"Z9",query:"",model:"2",params:"",bsType:"",goodsTestList:{},dateName:"",scopeList:[{cKey:"BAND",cValue:657}],subList:[{subNum:10,subType:"1"}],ceyice:"",fromPath:"",courseId:null}},created:function(){},mounted:function(){},activated:function(){("taskGoodsTask"==localStorage.toTestPath||"checkRecord"==localStorage.toTestPath&&"1"==localStorage.goodsTest)&&(this.fromPath=localStorage.toTestPath,this.dateName=localStorage.dateName,this.getTestTopicList()),("classList"==localStorage.toTestPath||"checkRecord"==localStorage.toTestPath&&"1"==localStorage.classTest)&&(this.fromPath=localStorage.toTestPath,this.dateName=localStorage.dateName,this.courseId=localStorage.courseId,this.getCourseTestBaseInfo(),this.getCourseTopicList()),"taskCheckTask"!=localStorage.toTestPath&&"taskBatch"!=localStorage.toTestPath||(this.fromPath=localStorage.toTestPath,this.dateName=localStorage.dateName,this.getTaskTopicList()),this.bsType=localStorage.bsType,localStorage.ceyice=this.$route.query.ceyice?this.$route.query.ceyice:"",this.ceyice=localStorage.ceyice},watch:{},methods:{getCourseTestBaseInfo:function(){var t=this;this.scopeList[0].cValue=localStorage.dateId;var s={bsCode:localStorage.brandIdGDY,userId:localStorage.userId,courseId:this.courseId,scopeList:[{cKey:"COURSE",cValue:this.courseId}],subList:[{subNum:10,subType:"1"}]},a=this.GLOBAL.g_paramJson(s);t.$axios.post("/task/task/addTaskByUser",a).then(function(s){0==s.data.head.status?t.goodsTestDetailList=s.data.body:t.$toast(s.data.head.msg)}).catch(function(t){})},getCourseTopicList:function(){var t=this,s={bsCode:localStorage.brandIdGDY,userId:localStorage.userId,courseId:this.courseId,scopeList:[{cKey:"COURSE",cValue:this.courseId}],subList:[{subNum:10,subType:"1"}]},a=this.GLOBAL.g_paramJson(s);t.$axios.post("/task/task/addCourseTask",a).then(function(s){t.classLoading=!1,"0"==s.data.head.status?(t.goodsTestList=t.goodsTestDetailList,t.goodsTestDetailList=s.data.body,t.$set(t.goodsTestDetailList,"questionCount",t.goodsTestList.questionCount),t.$set(t.goodsTestDetailList,"checkingTime",t.goodsTestList.checkingTime),t.$set(t.goodsTestDetailList,"bestScore",t.goodsTestList.bestScore)):t.$toast(s.data.head.msg)}).catch(function(t){console.log(t)})},getTestTopicList:function(){var t=this;this.scopeList[0].cValue=localStorage.dateId;var s={bsCode:localStorage.brandIdGDY,userId:localStorage.userId,scopeList:this.scopeList,subList:this.subList},a=this.GLOBAL.g_paramJson(s);t.$axios.post("/task/task/addTaskByUser",a).then(function(s){0==s.data.head.status?t.goodsTestDetailList=s.data.body:t.$toast(s.data.head.msg)}).catch(function(t){console.log(t)})},getTaskTopicList:function(){var t=this,s={taskId:localStorage.taskId,issuanceNumber:localStorage.issuanceNumber,model:this.model},a=this.GLOBAL.g_paramJson(s);t.$axios.post("/task/task/getInstance",a).then(function(s){0==s.data.head.status?t.goodsTestDetailList=s.data.body:t.$toast(s.data.head.msg)}).catch(function(t){console.log(t)})},back:function(){localStorage.removeItem("ceyice"),this.$router.go(-1)},startTesting:function(){var t=this;if(localStorage.analy&&localStorage.removeItem("analy"),localStorage.curTestNum=0,this.ceyice){this.scopeList[0].cValue=localStorage.dateId;var s={bsCode:localStorage.brandIdGDY,userId:localStorage.userId,scopeList:this.scopeList,subList:this.subList},a=this.GLOBAL.g_paramJson(s);t.$axios.post("/task/task/addTaskWithInstance",a).then(function(s){0==s.data.head.status?(t.goodsTestList=t.goodsTestDetailList,t.goodsTestDetailList=s.data.body,t.$set(t.goodsTestDetailList,"questionCount",t.goodsTestList.questionCount),t.$set(t.goodsTestDetailList,"checkingTime",t.goodsTestList.checkingTime),t.$set(t.goodsTestDetailList,"bestScore",t.goodsTestList.bestScore),localStorage.taskId=s.data.body.taskId,localStorage.issuanceNumber=s.data.body.issuanceNumber,t.goodsTestDetailList.vResult&&t.goodsTestDetailList.vResult.length>0?(localStorage.testFlag="true",setTimeout(function(){localStorage.removeItem("testFlag")},3e3),t.$router.push({path:"./taskTestTopic",query:{kaotiList:t.goodsTestDetailList,of:1,stamp:(new Date).getTime()}})):t.$toast("小易绞尽脑汁也未能发现题目,请稍后再试")):t.$toast(s.data.head.msg)})}else localStorage.testFlag="true",setTimeout(function(){localStorage.removeItem("testFlag")},3e3),this.goodsTestDetailList.taskId&&(localStorage.taskId=this.goodsTestDetailList.taskId),localStorage.issuanceNumber=this.goodsTestDetailList.issuanceNumber,t.goodsTestDetailList.vResult&&t.goodsTestDetailList.vResult.length>0?this.$router.push({path:"./taskTestTopic",query:{kaotiList:this.goodsTestDetailList,of:1,stamp:(new Date).getTime()}}):t.$toast("小易绞尽脑汁也未能发现题目,请稍后再试")}}},l={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{attrs:{id:"taskTest"}},[a("div",{staticClass:"headBox",staticStyle:{height:"1.2rem"}},[a("backHeader",{attrs:{title:t.dateName}},[a("span",{staticClass:"head-class f-l",attrs:{slot:"left"},on:{click:t.back},slot:"left"},[t._t("default",[a("img",{staticClass:"back-icon",attrs:{src:"static/images/dev/back@2x.png",alt:""}})])],2),t._v(" "),a("span",{staticClass:"head-class place-label",attrs:{slot:"right"},slot:"right"})])],1),t._v(" "),a("Scroll",{ref:"goodsTestDetailScroll",staticClass:"goodsTestDetailCon",attrs:{probeType:3,listenScroll:!0,autoUpdate:!1,scrollX:!1,scrollY:!0,pullDown:!1,pullUp:!1}},[a("div",{staticClass:"bodys"},[a("div",{staticClass:"bodysTop"},[a("div",{staticClass:"lists"},[a("div",{staticClass:"listsTop"},[a("img",{attrs:{src:"static/images/icon/ti.png"}})]),t._v(" "),a("div",{staticClass:"listsBom"},[a("span",{staticClass:"tspan"},[t._v("考题数量")]),t._v(" "),a("span",{staticClass:"bspan"},[t._v(t._s(t.goodsTestDetailList.questionCount)+"道")])])]),t._v(" "),a("div",{staticClass:"lists"},[a("div",{staticClass:"listsTop"},[a("img",{attrs:{src:"static/images/icon/shijian.png"}})]),t._v(" "),a("div",{staticClass:"listsBom"},[a("span",{staticClass:"tspan"},[t._v("考核时间")]),t._v(" "),a("span",{staticClass:"bspan"},[t._v(t._s(t.goodsTestDetailList.checkingTime/60)+"分钟")])])]),t._v(" "),a("div",{staticClass:"lists"},[a("div",{staticClass:"listsTop"},[a("img",{attrs:{src:"static/images/icon/mingci.png"}})]),t._v(" "),a("div",{staticClass:"listsBom"},[a("span",{staticClass:"tspan"},[t._v("最好成绩")]),t._v(" "),a("span",{staticClass:"bspan"},[t._v(t._s(t.goodsTestDetailList.bestScore?t.goodsTestDetailList.bestScore:0)+"分")])])])])])]),t._v(" "),a("div",{staticClass:"footer"},[a("van-button",{staticClass:"startBtn",attrs:{round:"",type:"info"},on:{click:t.startTesting}},[t._v("开始测试")])],1)],1)},staticRenderFns:[]};var d=a("VU/8")(c,l,!1,function(t){a("edkv")},"data-v-1c377ba3",null);s.default=d.exports},edkv:function(t,s){}});