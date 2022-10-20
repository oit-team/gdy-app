<template>
  <VueActions id="workIndex" data="work">
    <!-- <h1>工作组</h1> -->
    <div class="tabTitle">工作</div>
    <Scroll
        ref="workGroupScroll"
        :bounce='false'
        :listenScroll='true'
        :probeType='3'
        :pullDown="false"
        :pullUp="false"
        class="workGroup"
    >
      <!-- 滚动的内容 -->
      <div v-for="group of panelData" :key="group.title" class="workBox">
        <div class="top">{{ group.title }}</div>
        <div class="workCon">
          <div
              v-for="item of group.items"
              v-if="item.auth === undefined ? true : item.auth"
              :key="item.title"
              class="otherMenuBox circleBox"
              @click="panelAction(item)"
              v-actions:item.click
          >
            <div class="imgBox">
              <div style="position:relative;">
                <vc-icon size="28">{{ item.icon }}</vc-icon>
                <div class="numBox flex items-center" v-if="item.badge > 0">
                  <span class="nums">{{ item.badge }}</span>
                </div>
              </div>
            </div>
            <div class="desTit">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </Scroll>
  </VueActions>
</template>
<script>
import iframe from '@/iframe'
import VOICE_CONTENT_TYPE from '@/enums/VOICE_CONTENT_TYPE'
import { isIos } from '../../../utils/helper'

export default {
  name: 'workIndex',
  components: {},
  data() {
    return {
      curBrand: localStorage.brandId,
      noReadNums: 0,
      payMenus: [],

      authMenu: {
        courseList: false,
      },
    }
  },
  props: ['noReadNum1'],

  computed: {
    panelData() {
      return [
        {
          title: '门店日常',
          items: [
            {
              icon: '007b55f6d8c0af10e678d3251dee462d',
              title: '工作圈',
              click: this.toWorkCircle,
              badge: this.noReadNums,
            },
            {
              icon: '1dbe9e6707f7cf8f008c1677ad595052',
              title: '店务手册',
              click: this.shopKeeps,
            },
            {
              icon: '646fa467770dc1a85f4cbfad59844d2e',
              title: '我要搭配',
              click: this.toMyCollocation,
            },
          ],
        },
        {
          title: '学习提升',
          items: [
            {
              icon: 'b3ce32801d9e8320945c0b5ce41e9b32',
              title: '基础知识',
              click: this.classList,
              auth: this.authMenu.courseList,
            },
            {
              icon: '3f2777db3f5768c46b91712718a5e71c',
              title: '考核任务',
              click: this.taskCheck,
            },
            {
              icon: '506e40da68eeaedde694f39495ee166b',
              title: '商品自测',
              click: this.goodsCheck,
            },
            {
              icon: 'd4f5e50ab1c4a020c0af90ce1cffda8a',
              title: '话术训练',
              click: this.toVoicePage,
              auth: localStorage.brandId === '1' && isIos,
            },
          ],
        },
        {
          title: '智能管理',
          items: [
            {
              icon: '646fa467770dc1a85f4cbfad59844d2e',
              title: '互动屏',
              click: () => this.$router.push('/large-screen/template'),
            },
          ],
        },
      ]
    }
  },

  created() {
    this.getShowMenus()
  },
  mounted() {},
  watch: {
    noReadNum1(val) { // 接收父组件传来的参数名
      this.noReadNums = val
    },
    $route(to, from) {
      if (from.path == '/myCircle') {
        this.getnoReadNums()
      }
    },
  },
  activated() {

    localStorage.removeItem('assessTask')
    this.getnoReadNums()
  },
  methods: {
    toVoicePage() {
      const url = location.href.substring(0, location.href.indexOf(this.$route.fullPath))
      iframe.router.initVoiceTrain({
        initUrl: url + '/voice?type=' + VOICE_CONTENT_TYPE.REQUEST,
      })
    },
    panelAction(item) {
      if (item.click) item.click()
    },
    // 获取工作模块里该品牌下需要付费才显示的菜单
    getShowMenus() {
      let _this = this
      let params = {
        'brandId': localStorage.brandId,
      }
      let jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios.post('/system/menu/getPayMenu', jsonParam).then(function(res) {
        // console.log("工作模块里该品牌下所要显示的菜单", res.data.body);
        if (res.data.head.status == '0') {
          let resData = res.data.body.resultList
          for (let i = 0; i < resData.length; i++) {
            // 将属于app的付费菜单放到this.payMenus里，确保所有的菜单一定会被渲染，不会有空白占位
            if (resData[i].menuType == 1) {
              _this.authMenu[resData[i].menuCode] = true
            }
          }
        } else {
          _this.$toast(res.data.message)
        }
      }).catch(function(error) {
        // console.log(error);
      })
    },
    // 去我要搭配
    toMyCollocation() {
      this.$router.push({
        path: '/myCollocation',
        query: {
          stamp: new Date().getTime(),
        },
      })
    },
    // 去工作圈
    toWorkCircle() {
      this.$router.push('/myCircle')
    },
    // 去店务
    shopKeeps() {
      localStorage.loadShopFlag = 'true'
      this.$router.push('/shopKeep')
    },
    // 去微课堂
    classList() {
      localStorage.loadClassFlag = 'true'
      localStorage.bsType = 1            // bsType  参数 1 微课堂
      this.$router.push('/classList')
    },
    // 去商品测一测
    goodsCheck() {
      let _this = this
      localStorage.bsType = 2            //bsType  参数  2 商品自测
      this.$router.push({
        path: '/taskGoodsTask',
      })
    },
    // 去考核任务
    taskCheck() {
      let _this = this
      localStorage.bsType = 3            //bsType  参数  3 任务考核
      localStorage.assessTask = 1
      this.$router.push({
        path: '/taskCheckTask',
      })
    },

    // 获取未读消息数量
    getnoReadNums() {
      let _this = this
      let userid = localStorage.getItem('userId')
      let data = {
        'userId': userid,
      }
      _this.$axios.post('/api/noticeInfo/notReadNum', data).then(function(res) {
        // console.log("未读消息为:",res.data)
        if (res.data.code == 200) {
          _this.noReadNums = res.data.data
          if (_this.noReadNums == 0) {
            _this.$emit('changeTip', false)
          }
          if (_this.noReadNums > 99) {
            _this.noReadNums = '99+'
          }
        }
      }).catch(function(error) {
        _this.$toast('请求失败！')
      })
    },

  },
}
</script>
<style lang="less" scoped>
// 若加上‘.css’后缀，css可以按照正常尺寸进行设置，没有后缀，按照2倍数据设置
@import "../../../assets/workCss/workIndex";

</style>
