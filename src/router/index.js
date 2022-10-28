import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'login',
            meta: { index: 0 },
            component: resolve => require(['../components/pages/login/login1.3.vue'], resolve)
        },
        {
            path: '/HelloWorld',
            meta: { index: 0 },
            component: resolve => require(['@/components/HelloWorld'], resolve)
        },
        {
            path: '/login',
            meta: { index: 0 },
            component: resolve => require(['../components/pages/login/login1.3.vue'], resolve)
        },
        {
            path: '/index',
            name: 'index',
            meta: { index: 1 },
            component: resolve => require(['../components/pages/index/index.vue'], resolve)
        },
        {
            path: '/coll',
            component: resolve => require(['../components/comps/collocation/collocation.vue'], resolve)
        },
        {
            name: 'series',
            path: '/series',
            meta: { index: 2 },
            component: resolve => require(['../components/pages/series/series1.1.vue'], resolve)
        },
        {
            path: '/keyStyle',
            meta: { index: 2 },
            component: resolve => require(['../components/pages/series/keyStyle.vue'], resolve)
        },
        {
            name: "goodsDetail",
            path: '/goodsDetail',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/goodsDetail/goodsDetail1.3.vue'], resolve)
        },
        {
            name: "goodsDetailex",
            path: '/goodsDetailex',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/goodsDetail/goodsDetail1.3ex.vue'], resolve)
        },
        {
            path: '/style',
            meta: { index: 2 },
            component: resolve => require(['../components/pages/style/style1.1.vue'], resolve)
        },
        {
            name: 'styleDetail', // 搭配详情
            path: '/styleDetail',
            meta: { index: 3 },
            component: resolve => require(['../components/pages/styleDetail/styleDetail1.2.vue'], resolve)
        },
        {
            name: 'shopCollDetail', // 店铺搭配详情页
            path: '/shopCollDetail',
            meta: { index: 3 },
            component: resolve => require(['../components/pages/styleDetail/shopCollDetail.vue'], resolve)
        },
        {
            name: 'shopCollComment', // 店铺搭配评论列表页面
            path: '/shopCollComment',
            meta: { index: 3 },
            component: resolve => require(['../components/pages/styleDetail/shopCollComment.vue'], resolve)
        },
        {
            path: '/search',
            meta: { index: 99 },
            component: resolve => require(['../components/pages/search/search1.1.vue'], resolve)
        },
        {
            path: '/colltest',
            meta: { index: 2 },
            component: resolve => require(['../components/util/collocation/index.vue'], resolve)
        },
        {
            path: '/detailtest',
            meta: { index: 2 },
            component: resolve => require(['../components/util/goodsDetails/index.vue'], resolve)
        },
        {
            path: '/setup',
            meta: { index: 99 },
            component: resolve => require(['../components/pages/setup/setUp.vue'], resolve)
        },
        {
            path: '/main',
            name: "mine",
            meta: { index: 99 },
            component: resolve => require(['../components/pages/main/main.vue'], resolve)
        },
        {
            path: '/about',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/about/about1.1.vue'], resolve)
        },
        {
            path: '/feedback',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/feedback/feedback.vue'], resolve)
        },
        {
            name: 'serviceAggrement',
            path: '/serviceAggrement',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/about/serviceAggrement.vue'], resolve)
        },
        {
            name: 'privacyPolicy',
            path: '/privacyPolicy',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/about/privacyPolicy.vue'], resolve)
        },

        {
            path: '/secret',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/secret/secret.vue'], resolve)
        },
        {
            path: '/searchResult',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/searchResult/searchResult1.1.vue'], resolve)
        },
        {
            path: '/demo',
            meta: { index: 100 },
            component: resolve => require(['../components/demo.vue'], resolve)
        },
        {
            path: '/userInfo',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/userInfo/userInfo.vue'], resolve)
        },
        {
            path: '/updateInfo',
            meta: { index: 100 },
            component: resolve => require(['../components/pages/userInfo/updateInfo.vue'], resolve)
        },
        {
            name: "goodsDetail2",
            path: '/goodsDetail2',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/goodsDetail/goodsDetail2.vue'], resolve)
        },
        {
            path: '/myCircle',
            meta: {
                index: 99,
                // keepAlive:false,
            },
            component: resolve => require(['../components/pages/main/myCircle.vue'], resolve)
        },
        {
            path: '/newsDetail', // 工作圈详情
            meta: { index: 99 },
            component: resolve => require(['../components/pages/main/newsDetail.vue'], resolve)
        },
        // {
        //   name:"myTrainCheck",
        //   path: '/myTrainCheck',    //培训考核
        //   meta:{index:101},
        //   component: resolve => require(['../components/pages/train/myTrainCheck.vue'], resolve)
        // },
        {
            name: "taskBatch",
            path: '/taskBatch', //员工必备staffHave
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/taskBatch.vue'], resolve)
        },
        {
            name: "taskGoodsTask",
            path: '/taskGoodsTask', //商品测一测goodsTest
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/taskGoodsTask.vue'], resolve)
        },
        {
            name: "checkRecord",
            path: '/checkRecord', //测一测查看历史考核记录
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/checkRecord.vue'], resolve)
        },
        {
            name: "taskTest",
            path: '/taskTest', //测试首页
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/taskTest.vue'], resolve)
        },
        {
            name: "taskTestTopic",
            path: '/taskTestTopic', //测试题
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/taskTestTopic.vue'], resolve)
        },
        {
            name: "taskTopicCatalog",
            path: '/taskTopicCatalog', //题目录
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/taskTopicCatalog.vue'], resolve)
        },
        {
            name: "taskReport",
            path: '/taskReport', //报告
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/taskReport.vue'], resolve)
        },
        {
            name: "taskCheckTask",
            path: '/taskCheckTask', //考核任务checkTask
            meta: { index: 101 },
            component: resolve => require(['../components/pages/train/taskCheckTask.vue'], resolve)
        },
        {
            name: "tryCollacation",
            path: '/tryCollacation',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/goodsDetail/tryCollacation.vue'], resolve)
        },
        {
            name: "addCollocation",
            path: '/addCollocation',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/workGroup/addCollocation.vue'], resolve)
        },
        {
            name: "addSingle",
            path: '/addSingle',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/workGroup/addSingle.vue'], resolve)
        },
        {
            name: "searchSingle",
            path: '/searchSingle',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/workGroup/searchSingle.vue'], resolve)
        },
        {
            name: "myCollocation",
            path: '/myCollocation',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/workGroup/myCollocation.vue'], resolve)
        },
        {
            name: "newsPage",
            path: '/newsPage',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/index/news.vue'], resolve)
        },
        {
            name: "msgDetail", // 消息详情
            path: '/msgDetail',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/index/msgDetail.vue'], resolve)
        },
        {
            name: "shopKeep", //店务详情页
            path: '/shopKeep',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/workGroup/shopKeep.vue'], resolve)
        },
        {
            name: "classList", //微课列表页
            path: '/classList',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/classRoom/classList.vue'], resolve)
        },
        {
            name: "classDetailPage", //微课详情页
            path: '/classDetailPage',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/classRoom/classDetailPage.vue'], resolve)
        },
        {
            name: "runKing", //微课排行榜详情
            path: '/runKing',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/classRoom/runKing.vue'], resolve)
        },
        {
            name: "classRecord", //微课考核记录
            path: '/classRecord',
            meta: { index: 101 },
            component: resolve => require(['../components/pages/classRoom/classRecord.vue'], resolve)
        },
        {
            name: "SwitchUser",
            path: '/switch-user',
            meta: { index: 101 },
            component: resolve => require(['../views/Account/SwitchUser.vue'], resolve)
        },
        {
            name: "Voice",
            path: '/voice',
            meta: { index: 101 },
            component: () => import('@/views/Voice')
        },
        {
            name: "LargeScreenConfig",
            path: '/large-screen/config',
            meta: { index: 101 },
            component: () => import('@/views/LargeScreen/Config')
        },
        {
          name: "LargeScreenTemplate",
          path: '/large-screen/template',
          meta: { index: 101 },
          component: () => import('../views/LargeScreen/Template/List.vue')
        },
        {
          name: "LargeScreenTemplateConfig",
          path: '/large-screen/template/config',
          meta: { index: 101 },
          component: () => import('../views/LargeScreen/Template/Config.vue')
        },
        {
          name: "Collocation",
          path: '/large-screen/collocation',
          meta: { index: 101 },
          component: () => import('../views/LargeScreen/Collocation.vue')
        },
        {
          name: "FittingList",
          path: '/fitting-records/fittingList',
          meta: { index: 101 },
          component: () => import('../views/FittingRecords/FittingList.vue')
        },
    ]
})
