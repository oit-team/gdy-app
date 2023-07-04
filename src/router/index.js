import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [
      {
        name: "login",
        path: "/",
        meta: {
          index: 0
        },
        component: resolve => require(['../components/pages/login/login1.3.vue'], resolve)
      },
      {
        name: "temp:/HelloWorld",
        path: "/HelloWorld",
        meta: {
          index: 0
        },
        component: resolve => require(['@/components/HelloWorld'], resolve)
      },
      {
        name: "temp:/login",
        path: "/login",
        meta: {
          index: 0
        },
        component: resolve => require(['../components/pages/login/login1.3.vue'], resolve)
      },
      {
        name: 'index',
        path: "/index",
        meta: {
          index: 1
        },
        component: resolve => require(['../components/pages/index/index.vue'], resolve)
      },
      {
        name: "temp:/coll",
        path: "/coll",
        component: resolve => require(['../components/comps/collocation/collocation.vue'], resolve)
      },
      {
        name: "series",
        path: "/series",
        meta: {
          index: 2
        },
        component: resolve => require(['../components/pages/series/series1.1.vue'], resolve)
      },
      {
        name: "temp:/keyStyle",
        path: "/keyStyle",
        meta: {
          index: 2
        },
        component: resolve => require(['../components/pages/series/keyStyle.vue'], resolve)
      },
      {
        name: "goodsDetail",
        path: "/goodsDetail",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/goodsDetail/goodsDetail1.3.vue'], resolve)
      },
      {
        name: "goodsDetailex",
        path: "/goodsDetailex",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/goodsDetail/goodsDetail1.3ex.vue'], resolve)
      },
      {
        name: "temp:/style",
        path: "/style",
        meta: {
          index: 2
        },
        component: resolve => require(['../components/pages/style/style1.1.vue'], resolve)
      },
      {
        name: "styleDetail",
        path: "/styleDetail",
        meta: {
          index: 3
        },
        component: resolve => require(['../components/pages/styleDetail/styleDetail1.2.vue'], resolve)
      },
      {
        name: "shopCollDetail",
        path: "/shopCollDetail",
        meta: {
          index: 3
        },
        component: resolve => require(['../components/pages/styleDetail/shopCollDetail.vue'], resolve)
      },
      {
        name: "shopCollComment",
        path: "/shopCollComment",
        meta: {
          index: 3
        },
        component: resolve => require(['../components/pages/styleDetail/shopCollComment.vue'], resolve)
      },
      {
        name: "temp:/search",
        path: "/search",
        meta: {
          index: 99
        },
        component: resolve => require(['../components/pages/search/search1.1.vue'], resolve)
      },
      {
        name: "temp:/colltest",
        path: "/colltest",
        meta: {
          index: 2
        },
        component: resolve => require(['../components/util/collocation/index.vue'], resolve)
      },
      {
        name: "temp:/detailtest",
        path: "/detailtest",
        meta: {
          index: 2
        },
        component: resolve => require(['../components/util/goodsDetails/index.vue'], resolve)
      },
      {
        name: "temp:/setup",
        path: "/setup",
        meta: {
          index: 99
        },
        component: resolve => require(['../components/pages/setup/setUp.vue'], resolve)
      },
      {
        name: "mine",
        path: "/main",
        meta: {
          index: 99
        },
        component: resolve => require(['../components/pages/main/main.vue'], resolve)
      },
      {
        name: "temp:/about",
        path: "/about",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/about/about1.1.vue'], resolve)
      },
      {
        name: "temp:/feedback",
        path: "/feedback",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/feedback/feedback.vue'], resolve)
      },
      {
        name: "serviceAggrement",
        path: "/serviceAggrement",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/about/serviceAggrement.vue'], resolve)
      },
      {
        name: "privacyPolicy",
        path: "/privacyPolicy",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/about/privacyPolicy.vue'], resolve)
      },
      {
        name: "temp:/secret",
        path: "/secret",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/secret/secret.vue'], resolve)
      },
      {
        name: "temp:/searchResult",
        path: "/searchResult",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/searchResult/searchResult1.1.vue'], resolve)
      },
      {
        name: "temp:/demo",
        path: "/demo",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/demo.vue'], resolve)
      },
      {
        name: "temp:/userInfo",
        path: "/userInfo",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/userInfo/userInfo.vue'], resolve)
      },
      {
        name: "temp:/updateInfo",
        path: "/updateInfo",
        meta: {
          index: 100
        },
        component: resolve => require(['../components/pages/userInfo/updateInfo.vue'], resolve)
      },
      {
        name: "goodsDetail2",
        path: "/goodsDetail2",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/goodsDetail/goodsDetail2.vue'], resolve)
      },
      {
        name: "temp:/myCircle",
        path: "/myCircle",
        meta: {
          index: 99
        },
        component: resolve => require(['../components/pages/main/myCircle.vue'], resolve)
      },
      {
        name: "temp:/newsDetail",
        path: "/newsDetail",
        meta: {
          index: 99
        },
        component: resolve => require(['../components/pages/main/newsDetail.vue'], resolve)
      },
      {
        name: "taskBatch",
        path: "/taskBatch",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/taskBatch.vue'], resolve)
      },
      {
        name: "taskGoodsTask",
        path: "/taskGoodsTask",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/taskGoodsTask.vue'], resolve)
      },
      {
        name: "checkRecord",
        path: "/checkRecord",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/checkRecord.vue'], resolve)
      },
      {
        name: "taskTest",
        path: "/taskTest",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/taskTest.vue'], resolve)
      },
      {
        name: "taskTestTopic",
        path: "/taskTestTopic",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/taskTestTopic.vue'], resolve)
      },
      {
        name: "taskTopicCatalog",
        path: "/taskTopicCatalog",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/taskTopicCatalog.vue'], resolve)
      },
      {
        name: "taskReport",
        path: "/taskReport",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/taskReport.vue'], resolve)
      },
      {
        name: "taskCheckTask",
        path: "/taskCheckTask",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/train/taskCheckTask.vue'], resolve)
      },
      {
        name: "tryCollacation",
        path: "/tryCollacation",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/goodsDetail/tryCollacation.vue'], resolve)
      },
      {
        name: "addCollocation",
        path: "/addCollocation",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/workGroup/addCollocation.vue'], resolve)
      },
      {
        name: "addSingle",
        path: "/addSingle",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/workGroup/addSingle.vue'], resolve)
      },
      {
        name: "searchSingle",
        path: "/searchSingle",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/workGroup/searchSingle.vue'], resolve)
      },
      {
        name: "myCollocation",
        path: "/myCollocation",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/workGroup/myCollocation.vue'], resolve)
      },
      {
        name: "newsPage",
        path: "/newsPage",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/index/news.vue'], resolve)
      },
      {
        name: "msgDetail",
        path: "/msgDetail",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/index/msgDetail.vue'], resolve)
      },
      {
        name: "shopKeep",
        path: "/shopKeep",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/workGroup/shopKeep.vue'], resolve)
      },
      {
        name: "classList",
        path: "/classList",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/classRoom/classList.vue'], resolve)
      },
      {
        name: "classDetailPage",
        path: "/classDetailPage",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/classRoom/classDetailPage.vue'], resolve)
      },
      {
        name: "runKing",
        path: "/runKing",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/classRoom/runKing.vue'], resolve)
      },
      {
        name: "classRecord",
        path: "/classRecord",
        meta: {
          index: 101
        },
        component: resolve => require(['../components/pages/classRoom/classRecord.vue'], resolve)
      },
      {
        name: "SwitchUser",
        path: "/switch-user",
        meta: {
          index: 101
        },
        component: resolve => require(['../views/Account/SwitchUser.vue'], resolve)
      },
      {
        name: "Voice",
        path: "/voice",
        meta: {
          index: 101
        },
        component: () => import('@/views/Voice')
      },
      {
        name: "LargeScreenConfig",
        path: "/large-screen/config",
        meta: {
          index: 101
        },
        component: () => import('@/views/LargeScreen/Config')
      },
      {
        name: "LargeScreenTemplate",
        path: "/large-screen/template",
        meta: {
          index: 101
        },
        component: () => import('../views/LargeScreen/Template/List.vue')
      },
      {
        name: "LargeScreenTemplateConfig",
        path: "/large-screen/template/config",
        meta: {
          index: 101
        },
        component: () => import('../views/LargeScreen/Template/Config.vue')
      },
      {
        name: "Collocation",
        path: "/large-screen/collocation",
        meta: {
          index: 101
        },
        component: () => import('../views/LargeScreen/Collocation.vue')
      },
      {
        name: "FittingList",
        path: "/fitting-records/fittingList",
        meta: {
          index: 101
        },
        component: () => import('../views/FittingRecords/FittingList.vue')
      },
      {
        name: "SaleList",
        path: "/shop-sale/saleList",
        meta: {
          index: 102
        },
        component: () => import('../views/ShopSale/index.vue')
      },
      {
        name: "AddSale",
        path: "/shop-sale/addSale",
        meta: {
          index: 103
        },
        component: () => import('../views/ShopSale/components/AddSale.vue')
      },
      {
        name: "SelectProduct",
        path: "/shop-sale/selectProduct",
        meta: {
          index: 104
        },
        component: () => import('../views/ShopSale/components/SelectProduct.vue')
      },
      {
        name: "VideoList",
        path: "/video/list",
        meta: {
          index: 101
        },
        component: () => import('../views/Video/List.vue')
      },
      {
        name: "VideoDetail",
        path: "/video/detail/:id",
        meta: {
          index: 101
        },
        component: () => import('../views/Video/Detail.vue')
      },
      {
        name: "VideoSwipe",
        path: "/video/swipe",
        meta: {
          index: 101
        },
        component: () => import('../views/Video/Swipe.vue')
      }
    ]
})
// 为了路由跳转动画正常工作，务必提供name属性
