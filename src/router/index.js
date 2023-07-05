import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const routes = [
  {
    name: "login",
    path: "/",
    meta: {
      index: 0
    },
    component: () => import('../components/pages/login/login1.3.vue')
  },
  {
    path: "/HelloWorld",
    meta: {
      index: 0
    },
    component: () => import('@/components/HelloWorld')
  },
  {
    path: "/login",
    meta: {
      index: 0
    },
    component: () => import('../components/pages/login/login1.3.vue')
  },
  {
    name: 'index',
    path: "/index",
    meta: {
      index: 1
    },
    component: () => import('../components/pages/index/index.vue')
  },
  {
    path: "/coll",
    component: () => import('../components/comps/collocation/collocation.vue')
  },
  {
    name: "series",
    path: "/series",
    meta: {
      index: 2
    },
    component: () => import('../components/pages/series/series1.1.vue')
  },
  {
    path: "/keyStyle",
    meta: {
      index: 2
    },
    component: () => import('../components/pages/series/keyStyle.vue')
  },
  {
    name: "goodsDetail",
    path: "/goodsDetail",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/goodsDetail/goodsDetail1.3.vue')
  },
  {
    name: "goodsDetailex",
    path: "/goodsDetailex",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/goodsDetail/goodsDetail1.3ex.vue')
  },
  {
    path: "/style",
    meta: {
      index: 2
    },
    component: () => import('../components/pages/style/style1.1.vue')
  },
  {
    name: "styleDetail",
    path: "/styleDetail",
    meta: {
      index: 3
    },
    component: () => import('../components/pages/styleDetail/styleDetail1.2.vue')
  },
  {
    name: "shopCollDetail",
    path: "/shopCollDetail",
    meta: {
      index: 3
    },
    component: () => import('../components/pages/styleDetail/shopCollDetail.vue')
  },
  {
    name: "shopCollComment",
    path: "/shopCollComment",
    meta: {
      index: 3
    },
    component: () => import('../components/pages/styleDetail/shopCollComment.vue')
  },
  {
    path: "/search",
    meta: {
      index: 99
    },
    component: () => import('../components/pages/search/search1.1.vue')
  },
  {
    path: "/colltest",
    meta: {
      index: 2
    },
    component: () => import('../components/util/collocation/index.vue')
  },
  {
    path: "/detailtest",
    meta: {
      index: 2
    },
    component: () => import('../components/util/goodsDetails/index.vue')
  },
  {
    path: "/setup",
    meta: {
      index: 99
    },
    component: () => import('../components/pages/setup/setUp.vue')
  },
  {
    name: "mine",
    path: "/main",
    meta: {
      index: 99
    },
    component: () => import('../components/pages/main/main.vue')
  },
  {
    path: "/about",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/about/about1.1.vue')
  },
  {
    path: "/feedback",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/feedback/feedback.vue')
  },
  {
    name: "serviceAggrement",
    path: "/serviceAggrement",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/about/serviceAggrement.vue')
  },
  {
    name: "privacyPolicy",
    path: "/privacyPolicy",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/about/privacyPolicy.vue')
  },
  {
    path: "/secret",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/secret/secret.vue')
  },
  {
    path: "/searchResult",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/searchResult/searchResult1.1.vue')
  },
  {
    path: "/demo",
    meta: {
      index: 100
    },
    component: () => import('../components/demo.vue')
  },
  {
    path: "/userInfo",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/userInfo/userInfo.vue')
  },
  {
    path: "/updateInfo",
    meta: {
      index: 100
    },
    component: () => import('../components/pages/userInfo/updateInfo.vue')
  },
  {
    name: "goodsDetail2",
    path: "/goodsDetail2",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/goodsDetail/goodsDetail2.vue')
  },
  {
    path: "/myCircle",
    meta: {
      index: 99
    },
    component: () => import('../components/pages/main/myCircle.vue')
  },
  {
    path: "/newsDetail",
    meta: {
      index: 99
    },
    component: () => import('../components/pages/main/newsDetail.vue')
  },
  {
    name: "taskBatch",
    path: "/taskBatch",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/taskBatch.vue')
  },
  {
    name: "taskGoodsTask",
    path: "/taskGoodsTask",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/taskGoodsTask.vue')
  },
  {
    name: "checkRecord",
    path: "/checkRecord",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/checkRecord.vue')
  },
  {
    name: "taskTest",
    path: "/taskTest",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/taskTest.vue')
  },
  {
    name: "taskTestTopic",
    path: "/taskTestTopic",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/taskTestTopic.vue')
  },
  {
    name: "taskTopicCatalog",
    path: "/taskTopicCatalog",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/taskTopicCatalog.vue')
  },
  {
    name: "taskReport",
    path: "/taskReport",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/taskReport.vue')
  },
  {
    name: "taskCheckTask",
    path: "/taskCheckTask",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/train/taskCheckTask.vue')
  },
  {
    name: "tryCollacation",
    path: "/tryCollacation",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/goodsDetail/tryCollacation.vue')
  },
  {
    name: "addCollocation",
    path: "/addCollocation",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/workGroup/addCollocation.vue')
  },
  {
    name: "addSingle",
    path: "/addSingle",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/workGroup/addSingle.vue')
  },
  {
    name: "searchSingle",
    path: "/searchSingle",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/workGroup/searchSingle.vue')
  },
  {
    name: "myCollocation",
    path: "/myCollocation",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/workGroup/myCollocation.vue')
  },
  {
    name: "newsPage",
    path: "/newsPage",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/index/news.vue')
  },
  {
    name: "msgDetail",
    path: "/msgDetail",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/index/msgDetail.vue')
  },
  {
    name: "shopKeep",
    path: "/shopKeep",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/workGroup/shopKeep.vue')
  },
  {
    name: "classList",
    path: "/classList",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/classRoom/classList.vue')
  },
  {
    name: "classDetailPage",
    path: "/classDetailPage",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/classRoom/classDetailPage.vue')
  },
  {
    name: "runKing",
    path: "/runKing",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/classRoom/runKing.vue')
  },
  {
    name: "classRecord",
    path: "/classRecord",
    meta: {
      index: 101
    },
    component: () => import('../components/pages/classRoom/classRecord.vue')
  },
  {
    name: "SwitchUser",
    path: "/switch-user",
    meta: {
      index: 101
    },
    component: () => import('../views/Account/SwitchUser.vue')
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
    name: "VideoSwipe",
    path: "/video/swipe",
    meta: {
      index: 101
    },
    component: () => import('../views/Video/Swipe.vue')
  }
]

function transformName(name) {
  return `path${name}`.replace(/[/:]/g, '-')
}

function routesWrapper(routes) {
  return routes.map(route => {
    const importComponent = route.component
    route.component = async (resolve) => {
      const component = await importComponent(resolve)
      component.default.name = component.default.name || route.name || transformName(route.path)
      return component
    }
    return route
  })
}

export default new Router({
    routes: routesWrapper(routes)
})
