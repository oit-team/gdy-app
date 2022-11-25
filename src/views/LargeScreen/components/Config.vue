<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!--    轮播 + 选择图片-->
    <div class="overflow-hidden px-2 pt-2 pb-3 flex  bg-white relative box-border" :class="config.length <= 0 ? 'justify-center' : 'justify-between'">
      <div v-if="config.length > 0" class="mx-3 h-full relative overflow-hidden max-w-202px">
        <Preview ref="swiper" :config="config" :file-map="fileMap" @change="configIndex = $event"></Preview>
      </div>
      <!--  Config    -->
      <div v-if="config.length > 0" class="flex flex-col justify-between pt-2 pb-3 box-border absolute top-0 right-0 h-full w-125px">
        <ConfigList
          v-model="config"
          :file-map="fileMap"
          class="overflow-hidden overflow-y-auto"
          @select="(e) => $refs.swiper.swipeTo(e)"
          @remove="config.splice($event, 1)"
          v-actions:contentTab.duration
        />
      </div>
      <div v-else class="mx-3 aspect-9/16 h-358px">
        <van-empty description="暂无内容" />
      </div>
      <!--      按钮-->
      <div class="flex justify-between items-center w-full absolute bg-white bg-opacity-50 bottom-3 left-0 z-10 py-1 px-3 box-border">
        <div class="w-3/5 flex justify-center">
          <slot name="top-actions"></slot>
        </div>
        <van-button
          class="!h-8 w-100px"
          icon="plus"
          block
          round
          type="default"
          @click="selectCollocation"
          v-actions:appPublish.click
        />
      </div>
    </div>

    <div class="bottom-info flex-1 min-h-175px flex flex-col pt-4 pb-2 bg-white">
      <van-tabs class="flex-1 flex flex-col overflow-hidden px-2" v-model="tabIndex">
        <van-tab name="config">
          <template #title>
            <div v-actions:configTab.click key="config">配置</div>
          </template>
          <van-cell-group inset v-if="config[configIndex]">
            <van-field
              :value="config[configIndex].duration / 1000"
              type="digit"
              label="停留时间"
              @input="config[configIndex].duration = $event * 1000"
              v-actions:configTab.duration
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
</template>0

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
    devStateActive: 0
  }),
  mounted() {
  },

  methods: {
    selectCollocation() {
      this.$router.push('/large-screen/collocation')
      this.$root.$once(SELECT_COLLOCATION, (res) => {
        const max = 15
        for (const item of Object.values(res)) {
          if (this.config.length >= max) {
            this.$toast(`最多添加${max}个搭配图`)
            return
          }
          this.$set(this.fileMap, item.resId, item)
          this.config.push({
            _tempId: Math.random(),
            goods: item.goods.map(({ id }) => id),
            items: [
              {
                srcId: item.resId,
                type: 'image',
                fit: 'cover'
              }
            ],
            divider: 1,
            duration: 8000,
          })
        }
      })
    },
    getConfig() {
      const resId = []
      const goodsIds = []

      const config = this.config.map(item => {
        item = { ...item }
        delete item._tempId
        item.items.forEach(({ srcId }) => {
          resId.push(srcId)
        })
        item.goods && item.goods.forEach(item =>{
          item && goodsIds.push(item)
        })
        return item
      })

      return {
        config,
        resId: [...new Set(resId)],
        goods: [...new Set(goodsIds)],
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

  .van-tab__text {
    flex: 1;
    text-align: center;
  }
  .bottom-info .van-tabs__wrap{
    border-bottom: 3px solid rgb(25, 137, 250);
  }
  .bottom-info .van-tabs__line{
    display: none !important;
  }
  .bottom-info .van-tab--active{
    color: rgb(25, 137, 250);
  }
}
</style>
