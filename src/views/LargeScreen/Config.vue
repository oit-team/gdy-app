<template>
  <div class="flex flex-col overflow-hidden h-screen bg-gray-100 config">
    <Header title="设备列表">
      <div slot="after" @click="addAppPublishDeviceAds">
        发布
      </div>
    </Header>

    <div class="flex-1 flex flex-col overflow-hidden">
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

      <div class="flex-1 overflow-hidden pt-2 pb-3 flex justify-around items-center">
        <van-icon name="arrow-left" class="text-5xl text-[#cccccc]" @click="changeDev(devIndex <= 0 ? devList.length - 1 : devIndex - 1)" />
        <van-icon name="arrow" class="order-3 text-5xl text-[#cccccc]" @click="changeDev(devIndex >= devList.length - 1 ? 0 : devIndex + 1)" />
        <div v-if="config.length > 0" class="flex items-center h-full">
          <Preview ref="swiper" :config="config" :file-map="fileMap" @change="configIndex = $event"></Preview>
        </div>
        <div v-else>
          <van-empty description="暂无预览，请从下方添加展示内容" />
        </div>
      </div>

      <div>
        <van-tabs v-model="tabIndex" type="card">
          <van-tab title="信息"></van-tab>
          <van-tab title="列表"></van-tab>
          <van-tab title="配置"></van-tab>
        </van-tabs>
      </div>

      <div class="h-160px flex flex-col py-2">
        <div v-if="tabIndex === 0" class="flex-1 overflow-auto mb-2">
          <van-cell-group inset>
            <van-cell title="在线状态">
              <span :class="{'text-green-500': +devInfo.devState === 1}">{{ ['离线', '在线'][devInfo.devState] }}</span>
            </van-cell>
            <van-cell title="设备名称" :value="devInfo.devSerialNum" />
            <van-cell title="发布时间" :value="devInfo.releaseTime" />
            <van-cell title="探测时间" :value="devInfo.detecTime" />
          </van-cell-group>
        </div>

        <div v-if="tabIndex === 1" class="flex-1 flex flex-col justify-center">
          <ConfigList v-model="config" :file-map="fileMap" @push="selectCollocation" @select="(e) => $refs.swiper.swipeTo(e)" @remove="config.splice($event, 1)" />
        </div>

        <div v-else-if="tabIndex === 2" class="flex-1">
          <van-cell-group inset v-if="config[configIndex]">
            <van-field
              :value="config[configIndex].duration / 1000"
              type="digit"
              label="停留时间"
              @input="config[configIndex].duration = $event * 1000"
            >
              <span slot="right-icon">秒</span>
            </van-field>
          </van-cell-group>
        </div>

        <div class="flex gap-3 px-3">
          <van-button class="!h-10" type="info" block round plain>选择模板</van-button>
          <van-button v-if="hasDraft" class="!h-10" type="info" block round plain @click="getRollbackAdverts()">回退</van-button>
          <van-button class="!h-10" type="info" block round @click="addAdvertsTemp()">保存草稿</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import ConfigList from './components/ConfigList.vue'
import Preview from './components/Preview.vue'
import { getDevState, getAppDevList, addAppPublishDeviceAds, addAdvertsTemp, getRollbackAdverts, getAppDevInfo } from '@/api/largeScreen'
import { SELECT_COLLOCATION } from './constant'

let configCache = ''
const HAS_DRAFT = 2

export default {
  components: {
    Header,
    ConfigList,
    Preview,
  },

  data: () => ({
    drag: false,
    tabIndex: 0,
    configIndex: 0,
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

      try {
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
      } catch (error) {
        this.$toast(error.head.msg)
      }
    },
    selectCollocation() {
      this.$router.push('/large-screen/collocation')
      this.$root.$once(SELECT_COLLOCATION, (data) => {
        const max = 15
        for (const item of data) {
          if (this.config.length >= max) {
            this.$toast(`最多添加${max}个搭配图`)
            return
          }
          this.$set(this.fileMap, item.resId, {
            resUrl: item.resUrl
          })
          this.config.push({
            _tempId: Math.random(),
            items: [
              {
                srcId: item.resId,
                type: 'image',
                fit: 'cover'
              }
            ],
            divider: 1,
            duration: 5000,
          })
        }
      })
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
    getConfig() {
      const resId = new Set()

      const config = this.config.map(item => {
        item = { ...item }
        delete item._tempId
        item.items.forEach(({ srcId }) => resId.add(srcId))
        return item
      })

      return {
        config,
        resId: [...resId],
      }
    },
    setConfig(config) {
      const configParsed = JSON.parse(config)
      this.config = configParsed.map(item => ({
        _tempId: Math.random(),
        ...item,
      }))

      this.saveConfigCache()
    },
    async getRollbackAdverts() {
      await this.$dialog.confirm({
        title: '提示',
        message: '是否要回退为上一次发布的配置？',
      })

      const res = await getRollbackAdverts(this.devId)
      const data = res.body.advertsRes
      this.hasDraft = false
      // 配置文件地址映射
      Object.keys(data.resEntityMap).forEach(key => {
        this.$set(this.fileMap, key, data.resEntityMap[key])
      })
      this.setConfig(data.rotationRules)
    },
    async getAppDevInfo() {
      const res = await getAppDevInfo(this.devId)
      const { advertsRes, devInfo, isDraft } = res.body
      this.hasDraft = isDraft === HAS_DRAFT
      this.configIndex = 0
      this.setConfig(advertsRes.rotationRules)
      this.fileMap = advertsRes.resEntityMap
    },
    async changeDev(index) {
      await this.checkNotSaved()
      this.configIndex = 0
      this.devIndex = index
    },
    async checkNotSaved() {
      if (JSON.stringify(this.config) !== configCache) {
        const confirm = await this.$dialog.confirm({
          title: '提示',
          message: '是否要保存当前配置？',
        }).catch(() => false)

        confirm && await this.addAdvertsTemp()
      }
    },
    saveConfigCache() {
      configCache = JSON.stringify(this.config)
    },
    async checkConfig() {
      const check = this.config.length > 0
      if (!check) {
        this.$toast('未添加任何内容')
        return Promise.reject(check)
      }
      return check
    },
  },
}
</script>

<style lang='scss' scoped>
</style>
