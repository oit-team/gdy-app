<template>
  <VueActions data="largeScreen" class="flex flex-col overflow-hidden h-screen bg-gray-100 config">
    <Header>
      <div slot="title" class="flex justify-center items-center">
        设备列表
      </div>

      <div slot="after" class="flex items-center" @click="isShow">
        <van-icon name="ellipsis" size="18"></van-icon>
      </div>
    </Header>

    <div>
      <van-tabs
        v-model="active"
        swipe-threshold="2"
        @click="changeDev"
        color="rgb(25, 137, 250)"
        line-width="110"
      >
        <van-tab
          v-for="item in devList"
          :key="item.devId"
        >
          <template #title>
            <div class="flex items-center justify-around">
              <div
                class="devStateCircle mx-1 inline-block"
                :class="item.devState == 0 ? 'devOffLine':'devOnLine'"
              ></div>
              {{ item.devSerialNum }}
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <Config
      ref="config"
      arrow
      :devState="devInfo.devState"
      @addAdvertsTemp="addAdvertsTemp()"
      @getRollbackAdverts="getRollbackAdverts()"
    >
      <template slot="top-actions">
        <van-button
          v-if="showKeep"
          class="!h-8 w-120px"
          type="info"
          block
          round
          @click="addAdvertsTemp"
          v-actions:addAdvertsTemp.click
        >保存草稿{{ hasDraft ? '(1)' : '' }}
        </van-button>
        <van-button v-if="hasDraft" class="!h-8 w-80px ml-1" type="info" block round plain @click="getRollbackAdverts">
          回退
        </van-button>
      </template>
      <template slot="tab-after">
        <van-tab class="overflow-y-auto">
          <template #title>
            <div v-actions:messageTab.click key="message">信息</div>
          </template>
          <div>
            <van-cell-group inset>
              <van-cell title="发布时间" :value="devInfo.releaseTime"/>
              <van-cell title="探测时间" :value="devInfo.detecTime"/>
            </van-cell-group>
          </div>
        </van-tab>
      </template>
      <template slot="actions">
        <van-button
          class="!h-10"
          type="info"
          block
          round
          plain
          @click="selectTemplate()"
          v-actions:selectTemplate.click
        >
          {{ modulesTitle ? `模板(${modulesTitle})` : '选择模板' }}
        </van-button>
        <van-button
          round
          block
          type="info"
          class="!h-10"
          @click="addAppPublishDeviceAds"
          v-actions:appPublish.click
        >
          发布
        </van-button>
      </template>
    </Config>

    <van-popup
      ref="popup"
      v-model="showPop"
      round
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-popup
      ref="popup"
      v-model="showPop2"
      round
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="columns2"
        @confirm="onConfirm2"
      />
    </van-popup>
  </VueActions>
</template>

<script>
import Header from '../../components/comps/header/header'
import ConfigList from './components/ConfigList.vue'
import Preview from './components/Preview.vue'
import Config from './components/Config.vue'
import {
  getDevState,
  getAppDevList,
  addAppPublishDeviceAds,
  addAdvertsTemp,
  getRollbackAdverts,
  getAppDevInfo,
  getAdvertsShopById,
  sendCommandToDevice,
} from '@/api/largeScreen'
import { SELECT_TEMPLATE } from './constant'
import { keyBy } from 'lodash-es'

const HAS_DRAFT = 2

export default {
  components: {
    Header,
    ConfigList,
    Preview,
    Config,
  },

  data: () => ({
    devIndex: 0,
    devState: {},
    devList: {},
    config: [],
    fileMap: {},
    devId: null,
    hasDraft: false,
    active: 0,
    modulesTitle: '',
    showKeep: false, // 是否显示保存草稿
    showPop: false,
    showPop2: false,
    columns: ['探测', '模式切换'],
    columns2: ['交互模式', '轮播模式'],
  }),

  watch: {
    devList() {
      const index = this.devList.findIndex(item => item.devId === this.devId)
      this.devId = this.devList[index === -1 ? 0 : index].devId
    },
    devIndex() {
      this.devId = this.devList[this.devIndex].devId
    },
    devId: 'getAppDevInfo',
  },

  computed: {
    devInfo() {
      return this.devList[this.devIndex] || {}
    },
  },

  mounted() {
    this.getAppDevList()
    this.getDevState()
  },

  methods: {
    onConfirm(event) {
      this.showPop = false
      if (event === '探测') {
        this.getDevState(true)
      } else {
        this.showPop2 = true
      }
    },
    async onConfirm2(event) {
      this.showPop2 = false
      await sendCommandToDevice({
        devId: this.devId,
        cmd: event === '交互模式' ? 9 : 10,
        mod: 1, // 来源：1（小程序）
      })
      this.$toast('切换成功')
    },
    isShow() {
      this.showPop = true
    },
    async getDevState(check = false) {
      check && await this.checkNotSaved()
      const res = await getDevState()
      this.devState = res.body
      this.devList = res.body.resultList
      this.$toast('探测完成')
    },
    async getAppDevList() {
      const res = await getAppDevList()
      this.devList = res.body.resultList
    },
    async addAppPublishDeviceAds() {
      await this.$dialog.confirm({
        title: '提示',
        message: '确定要发布吗？',
      })
      const { resId, config, goods } = this.getConfig()
      await addAppPublishDeviceAds({
        devId: this.devId,
        describe: 'APP',
        advertsType: 0,
        defaults: '0',
        state: 0,
        advertsStyle: goods,
        rotationRules: JSON.stringify(config),
        resId,
      })
      this.modulesTitle = ''
      this.hasDraft = false
      this.saveConfigCache()

      this.$toast('发布成功')
    },
    async addAdvertsTemp() {
      await this.checkConfig()
      const { resId, config, goods } = this.getConfig()
      await addAdvertsTemp({
        devId: this.devId,
        rotationRules: JSON.stringify(config),
        advertsTempStyles: goods,
        describe: '',
        resId,
      })
      this.hasDraft = true

      this.saveConfigCache()

      this.$toast('保存成功')
    },
    async getRollbackAdverts() {
      await this.$dialog.confirm({
        title: '提示',
        message: '是否要回退为上一次发布的配置？',
      })

      const res = await getRollbackAdverts(this.devId)
      const data = res.body.advertsRes
      this.hasDraft = false
      this.setFileMap(data.resEntityMap)
      this.setConfig(data.rotationRules)
    },
    async getAppDevInfo() {
      const res = await getAppDevInfo(this.devId)
      const { advertsRes, devInfo, isDraft } = res.body
      this.modulesTitle = ''
      this.hasDraft = isDraft === HAS_DRAFT
      this.$refs.config.swipeTo(0, { immediate: true })
      this.setConfig(advertsRes.rotationRules)
      this.setFileMap(advertsRes.resEntityMap)
      this.showKeep = !this.$refs.config.checkSaved()
    },
    async changeDev(index) {
      await this.checkNotSaved()
      this.$refs.config.swipeTo(0, { immediate: true })
      this.devIndex = index
    },
    async checkNotSaved() {
      if (!this.$refs.config.checkSaved()) {
        const confirm = await this.$dialog.confirm({
          title: '提示',
          message: '是否要保存当前配置？',
        }).catch(() => false)

        confirm && await this.addAdvertsTemp()
      }
    },
    selectTemplate() {
      this.$router.push('/large-screen/template')
      this.$root.$on(SELECT_TEMPLATE, async (id) => {
        const res = await getAdvertsShopById({
          advertsShopId: id,
        })
        this.modulesTitle = res.body.describe
        this.setFileMap(keyBy(res.body.resEntityList, 'id'))
        this.setConfig(res.body.rotationRules, false)
      })
    },
    saveConfigCache() {
      this.$refs.config.saveConfigCache()
    },
    checkConfig() {
      return this.$refs.config.checkConfig()
    },
    getConfig() {
      return this.$refs.config.getConfig()
    },
    setConfig(config, cache) {
      this.$refs.config.setConfig(config, cache)
    },
    setFileMap(map) {
      this.$refs.config.setFileMap(map)
    },
  },
}
</script>

<style lang='scss' scoped>
.van-tab__text {
  flex: 1;
  text-align: center;
}

.devStateCircle {
  width: 8px;
  height: 8px;
  border-radius: 50px;
}

.devOffLine {
  background-color: gray;;
}

.devOnLine {
  background-color: #a0f377;
}
</style>
