<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <div class="flex-1 overflow-hidden pt-2 pb-3 flex justify-around items-center">
      <template v-if="arrow">
        <van-icon name="arrow-left" class="text-5xl text-[#cccccc]" @click="$emit('prev')" />
        <van-icon name="arrow" class="order-3 text-5xl text-[#cccccc]" @click="$emit('next')" />
      </template>
      <div v-if="config.length > 0" class="flex items-center h-full">
        <Preview ref="swiper" :config="config" :file-map="fileMap" @change="configIndex = $event"></Preview>
      </div>
      <div v-else>
        <van-empty description="暂无预览，请从下方添加展示内容" />
      </div>
    </div>

    <div class="h-200px flex flex-col py-2">
      <van-tabs class="flex-1 flex flex-col overflow-hidden" v-model="tabIndex" type="card">
        <van-tab title="内容" name="list" class="flex items-center">
          <ConfigList
            v-model="config"
            :file-map="fileMap"
            @push="selectCollocation"
            @select="(e) => $refs.swiper.swipeTo(e)"
            @remove="config.splice($event, 1)"
          />
        </van-tab>
        <van-tab title="配置" name="config">
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
          <div v-else class="h-full grid place-content-center text-gray-500">
            暂无内容
          </div>
        </van-tab>
        <slot name="tab-after"></slot>
      </van-tabs>

      <div class="flex gap-3 px-3">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import ConfigList from '../components/ConfigList.vue'
import Preview from '../components/Preview.vue'
import { SELECT_COLLOCATION } from '../constant'

let configCache = ''

export default {
  components: {
    Header,
    ConfigList,
    Preview,
  },

  props: {
    arrow: Boolean,
  },

  data: () => ({
    drag: false,
    tabIndex: 0,
    configIndex: 0,
    config: [],
    fileMap: {},
  }),

  mounted() {
  },

  methods: {
    selectCollocation() {
      this.$router.push('/large-screen/collocation')
      this.$root.$once(SELECT_COLLOCATION, (data) => {
        const max = 15
        for (const item of Object.values(data)) {
          if (this.config.length >= max) {
            this.$toast(`最多添加${max}个搭配图`)
            return
          }
          this.$set(this.fileMap, item.resId, item)
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
    setConfig(config, cache = true) {
      const configParsed = typeof config === 'string' ? JSON.parse(config) : config
      this.config = configParsed.map(item => ({
        _tempId: Math.random(),
        ...item,
      }))

      cache && this.saveConfigCache()
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
    setFileMap(map) {
      this.fileMap = map
    },
    checkSaved() {
      return JSON.stringify(this.config) === configCache
    },
    swipeTo(index, options) {
      if (this.$refs.swiper)
        this.$refs.swiper.swipeTo(index, options)
    },
  },
}
</script>

<style lang="scss" scoped>
>>> {
  .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }

  .van-tab__pane {
    height: 100%;
    padding: 8px 0;
  }
}
</style>
