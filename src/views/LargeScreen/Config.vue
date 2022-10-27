<template>
  <div class="flex flex-col overflow-hidden h-screen bg-gray-100 config">
    <Header :title="devInfo.devSerialNum || '设备列表'">
      <div slot="after" @click="addAppPublishDeviceAds">
        发布
      </div>
    </Header>

    <div class="flex items-center justify-between px-3 pt-2">
      <div class="text-sm text-gray-500">
        <span>在线设备：{{devState.onNum || 0}}台</span>
        <span>离线设备：{{devState.offNum || 0}}台</span>
      </div>
      <div class="flex items-center text-sm bg-primary text-white px-2 rounded-full" @click="getDevState(true)">
        <van-icon name="aim" />
        <span class="ml-1">探测</span>
      </div>
    </div>

    <Config
      ref="config"
      arrow
      @prev="changeDev(devIndex <= 0 ? devList.length - 1 : devIndex - 1)"
      @next="changeDev(devIndex >= devList.length - 1 ? 0 : devIndex + 1)"
    >
      <template slot="tab-after">
        <van-tab title="信息">
          <div class="h-full overflow-auto">
            <van-cell-group inset>
              <van-cell title="在线状态">
                <span :class="{'text-green-500': +devInfo.devState === 1}">{{ ['离线', '在线'][devInfo.devState] }}</span>
              </van-cell>
              <van-cell title="设备名称" :value="devInfo.devSerialNum" />
              <van-cell title="发布时间" :value="devInfo.releaseTime" />
              <van-cell title="探测时间" :value="devInfo.detecTime" />
            </van-cell-group>
          </div>
        </van-tab>
      </template>
      <template slot="actions">
        <van-button class="!h-10" type="info" block round plain @click="selectTemplate()">选择模板</van-button>
        <van-button v-if="hasDraft" class="!h-10" type="info" block round plain @click="getRollbackAdverts()">回退</van-button>
        <van-button class="!h-10" type="info" block round @click="addAdvertsTemp()">保存草稿{{ hasDraft ? '(1)' : '' }}</van-button>
      </template>
    </Config>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import ConfigList from './components/ConfigList.vue'
import Preview from './components/Preview.vue'
import Config from './components/Config.vue'
import { getDevState, getAppDevList, addAppPublishDeviceAds, addAdvertsTemp, getRollbackAdverts, getAppDevInfo, getAdvertsShopById } from '@/api/largeScreen'
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

      const {resId, config} = this.getConfig()
      await addAppPublishDeviceAds({
        devId: this.devId,
        describe: "APP",
        advertsType: 0,
        defaults: "0",
        state: 0,
        rotationRules: JSON.stringify(config),
        resId,
      })

      this.hasDraft = false
      this.saveConfigCache()

      this.$toast('发布成功')
    },
    async addAdvertsTemp() {
      await this.checkConfig()
      const {resId, config} = this.getConfig()
      await addAdvertsTemp({
        devId: this.devId,
        rotationRules: JSON.stringify(config),
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
      this.hasDraft = isDraft === HAS_DRAFT
      this.$refs.config.swipeTo(0, { immediate: true })
      this.setConfig(advertsRes.rotationRules)
      this.setFileMap(advertsRes.resEntityMap)
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
</style>
