<template>
  <VueActions class="goodsMain" data="goods" @touchmove.prevent>
    <!-- 头部导航 -->

    <Scroll
        :refreshData="[bigList]"
        class="goodTopScroll"
        ref="TopScroll"
        :probeType='3'
        :scrollX='true'
        :scrollY='false'
        :autoUpdate="true"
        :pullDown="false"
        :pullUp="false"
    >
      <!-- 滚动的内容 -->
      <div class="topNavBox">
        <div
            v-for="(item, index) in headTabs" :key="index" :id="item.id"
            class="navItem"
            :class="{active: item.id == selected}"
            @click="set_tab_index(item.id,$event)"
            v-actions:headTabs.click
        >
          {{ item.fitOccasionName }}
        </div>
      </div>
    </Scroll>

    <div class="season-banner select-none">
      <img :src="labelImg" mode="widthFix">
    </div>

    <div class="tabBox">
      <div class="item" :class="{active: listType == 1}" @click="clickSeriesBtn(1)" v-actions:seriesList.click>系列列表</div>
      <div class="item" :class="{active: listType == 2}" @click="clickSeriesBtn(2)" v-actions:cateList.click>品类列表</div>
    </div>

    <Scroll
        class="goodsBody"
        ref="goodsBodyScroll"
        :probeType='3'
        :bounceTime="0"
        :listenScroll='true'
        :pullDown="false"
        :pullUp="false"
    >
      <div
          class="scrollCon" @click="clickScroll"
          @touchstart="getTouchStart"
          @touchend="getTouchEnd"
      >
        <div v-for="(series,index) in bigList" :key="index">
          <div class="oneName">{{ series.bandName }}</div>
          <div v-if="listType == 1" class="seriesBox" key="1">
            <div
                class="secName"
                v-for="(item,index) in series.result"
                :key="index"
                v-actions:seriesItem.click
                @click="goGoods(series.bandName,item,series)"
            >
              <span class="name">{{ item.seriesName }}</span> <span class="count">({{ item.count }})</span>
            </div>
          </div>
          <div v-if="listType == 2" class="kindBox" key="2">
            <div
                class="secName"
                v-for="(item,index) in series.result"
                :key="index"
                v-actions:cateItem.click
                @click="goKeyStyle(bigList,series,item)"
            >
              <span class="name">{{ item.seriesName }}</span> <span class="count">({{ item.count }})</span>
            </div>
          </div>
        </div>

      </div>
    </Scroll>

  </VueActions>
</template>

<script>
import util from '@/assets/js/util.js'

export default {
  name: '',
  components: {},
  data() {
    return {
      selected: '',
      seriesList: [],
      tabs: [],
      liselected: '',   // 二期页面里都没有用到了
      headTabs: [],
      labelName: '',   // 季节波段名称
      labelImg: '../../../../static/imgs/seasonBannner1.png',  // 季波图片
      loadingFlag: true,
      cateList: [],
      // ===============================
      listType: 1,   // 1 系列列表   2 品类列表
      allData: '',
      bigList: [],   // 相应列表下要渲染的数组数据
      touchstartTime: null,
      touchendTime: null,
      duration: 0,
    }
  },

  created() {
    // console.log("----goods--------created------")
    // this.getSeasonList();
  },
  updated() {},
  mounted() {
    // console.log("goods--------mounted============")

  },
  activated() {
    // console.log("goods--------activited-------")
    this.getSeasonList()
  },

  computed: {},
  watch: {
    $route(from, to) {
      // console.log(from.path,to.path)
    },
    // 监听selected 变化
    selected: function(newV, oldV) {
      // console.log("监听头部季节波段selected 变化",newV,oldV)
      let _this = this
      for (var i = 0; i < _this.headTabs.length; i++) {
        if (newV == _this.headTabs[i].id) {
          let num = i * 100
          // _this.$refs.cursor.style.transform= 'translateX('+num+'%)';
          _this.labelName = _this.headTabs[i].fitOccasionName
          _this.labelImg = _this.headTabs[i].occCover == null ? '/static/images/dev/banner2@2x.png' : _this.headTabs[i].occCover
          break
        }
      }
      _this.seriesList = []
      _this.getBandBySeasonId(newV)
    },
    // 监听liselected 变化
    liselected: function(newV, oldV) {
      // console.log("监听左侧波段liselected 变化",newV,oldV)
      let _this = this
      if (newV == -1) {
        return
      }
      for (var i = 0; i < _this.tabs.length; i++) {
        if (_this.tabs[i].id == newV) {
          _this.liselectedName = _this.tabs[i].bandName
          break
        }
      }
      // console.log(newV)
      _this.getSeries(newV)
    },
  },
  methods: {
    getTouchStart() {
      this.touchstartTime = new Date().getTime()
    },
    getTouchEnd(e) {
      this.touchendTime = new Date().getTime()
      this.duration = this.touchendTime - this.touchstartTime
      if (this.duration > 20) {
        this.$refs.goodsBodyScroll.refresh()
      }
    },
    clickScroll() {
      this.$refs.goodsBodyScroll.refresh()
    },
    // 获取季节列表
    getSeasonList() {
      let _this = this
      let brandId = localStorage.brandId
      let params = {
        'brandId': brandId,
        'typeId': 1,
      }
      _this.$axios.post('/api/dic/normalList', params).then(function(res) {
        let data = res.data
        if (data.code == '200') {
          // console.log("商品页面获取的seasonlist为,",data)
          _this.headTabs = data.data
          const tab = _this.headTabs.find(item => item.id == localStorage.goodsFirstSel)
          if (tab) _this.selected = tab.id
          else _this.selected = _this.headTabs[0].id
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    // 点击季节导航进行内容切换
    set_tab_index(val) {
      let _this = this
      if (_this.selected != val) {
        _this.selected = val
        localStorage.removeItem('goodsSecondSel')
        _this.listType = 1
        _this.$refs.goodsBodyScroll.refresh()
        _this.$refs.goodsBodyScroll.scrollToTop()
      }
    },
    // 根据季节id和品牌ID进行系列和品类列表的查询
    getBandBySeasonId(seasonId) {
      let _this = this
      let brandId = localStorage.brandId
      let params = {
        'brandId': brandId,
        'seasonId': seasonId,
      }
      _this.$axios.post('/api/series/goodsHome', params)
          .then(function(res) {
            // console.log("请求新的商品页列表",res.data)
            if (res.data.code == '200') {
              let data = res.data.data
              _this.allData = data
              _this.bigList = data.系列列表
            }
          })
          .catch(function(error) {
            console.log(error)
          })
    },
    // 点击品类列表和系列列表进行切换
    clickSeriesBtn(val) {
      if (this.listType != val) {
        this.listType = val
        this.$refs.goodsBodyScroll.scrollToTop()
        if (val == 1) {
          this.bigList = this.allData.系列列表
        } else {
          this.bigList = this.allData.品类列表
        }
      }
    },
    // 系列列表去系列详情页
    goGoods(bandName, item, series) {
      // console.log(bandName,item,"series=====",series)
      let _this = this
      localStorage.goodsFirstSel = _this.selected
      localStorage.goodsSecondSel = _this.liselected
      _this.$router.push({
        path: '/series',
        query: {
          'bandId': item.bandId,
          'seriesId': item.id,
          'categoryName': item.seriesName,
          'bandName': bandName,
          'seasonId': this.selected,
          'seasonName': this.labelName,
          stamp: new Date().getTime(),
        },
      })
    },
    // 品类列表去品类详情页
    goKeyStyle(bigList, series, item) {
      // console.log("点击品类列表要传递的数据为====",bigList,series)
      let _this = this
      localStorage.goodsFirstSel = _this.selected
      localStorage.goodsSecondSel = _this.liselected
      this.$router.push({
        path: '/keyStyle',
        query: {
          'bigList': bigList,
          'bandId': series.bandId,
          'cateId': item.id,
          'categoryname': item.seriesName,
          'bandName': series.bandName,
          'seasonName': this.labelName,
          'cateList': series.result,
          stamp: new Date().getTime(),
        },
      })
    },

    // 动态跳转url
    goGoods1(url, params, item) {
      // console.log(url,params,item)
      // 需要判断一下,如果没有传params,直接跳转url就好
      if (params.length == 0) {
        this.$router.push({
          path: '/' + url,
          query: {
            stamp: new Date().getTime(),
          },
        })
      } else {
        // let pList = ['bandId','seriesId','bandName']
        // 传递的参数跟要跳转页面接受的参数字段名称不一致,需要更改
        let pList = params.split(',')
        let nUrl = '/' + url + '?'
        pList.forEach(element => {
          // console.log(element)
          nUrl = nUrl + element + '=' + item[element] + '&'
        })
        nUrl = nUrl.substring(0, nUrl.length - 1)
        // console.log(nUrl)
        this.$router.push({
          path: nUrl,
          query: {
            // "bandId":bandId,
            // "seriesId":seriesId,
            // "bandName":_this.liselectedName,
            stamp: new Date().getTime(),
          },
        })
      }
    },
    // 选择bandId即liselected
    choose: function(id) {
      // console.log("liselected是："+id)
      let _this = this
      if (id != _this.liselected) {
        _this.liselected = id
      }
    },

    // 根据bandId获取对应系列信息
    getSeries(bandId) {
      let _this = this
      let brandId = localStorage.brandId
      let params = {
        'brandId': brandId,
        'bandId': bandId,
      }
      _this.$axios.post('/api/series/goodList', params)
          .then(function(res) {
            let data = res.data
            if (data.code == '200') {
              _this.loadingFlag = false
              _this.seriesList = data.data
              // console.log("获取波段下的各个列表",_this.seriesList)
            }
          })
          .catch(function(error) {
            console.log(error)
          })
    },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

@import '../../../assets/css/commom.css';
@import '../../../assets/pageCss/goods1.1.less';


</style>
