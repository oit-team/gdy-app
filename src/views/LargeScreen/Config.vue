<template>
  <div class="flex flex-col overflow-hidden h-screen bg-gray-100">
    <Header title="设备列表"></Header>

    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex">
        <div class="text-sm text-gray-500 pt-1 px-2">
          <span>在线设备：5台</span>
          <span>离线设备：1台</span>
        </div>
      </div>

      <div class="flex-1 overflow-hidden pt-2 pb-3">
        <div class="aspect h-full mx-auto shadow-md rounded overflow-hidden">
          <van-swipe class="h-full" ref="swiper">
            <van-swipe-item v-for="(image, index) in images" :key="image">
              <van-image class="h-full" :src="image" fit="cover" />
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>

      <div class="h-210px">
        <ConfigList
          v-model="images"
        />

        <div class="grid grid-cols-3 gap-3 px-3 mt-1">
          <van-button class="!h-10" type="info" block round plain>选择模板</van-button>
          <van-button class="!h-10" type="info" block round plain>保存设置</van-button>
          <van-button class="!h-10" type="info" block round>发布</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import ConfigList from './components/ConfigList.vue'

export default {
  components: {
    Header,
    ConfigList,
  },

  data: () => ({
    images: [
      'https://img01.yzcdn.cn/vant/apple-1.jpg',
      'https://img01.yzcdn.cn/vant/apple-2.jpg',
      'https://img01.yzcdn.cn/vant/apple-3.jpg',
      'https://img01.yzcdn.cn/vant/apple-4.jpg',
      'https://img01.yzcdn.cn/vant/apple-5.jpg',
      'https://img01.yzcdn.cn/vant/apple-6.jpg',
    ],
    drag: false,
  }),

  methods: {
    test(e) {
      console.log(e)
    }
  },
}
</script>

<style lang='scss' scoped>
#app {
  overflow: hidden;
}

.aspect {
  aspect-ratio: 9/16;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
