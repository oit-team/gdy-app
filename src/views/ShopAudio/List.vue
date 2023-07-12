<template>
  <div class="w-full flex flex-col bg-gray-100">
    <van-sticky>
      <Header>
        <div slot="title">
          <span>音频设置</span>
        </div>
      </Header>
    </van-sticky>
    <div class="w-full flex-1 overflow-hidden overflow-y-auto">
      <div v-if="!showEmpty" class="w-full h-full px-2 mt-2 box-border">
        <div v-for="(item, index) in shopAudioList" :key="index" class="p-2 bg-white rounded-md flex items-center mb-2" @click="updateAudioContent(item)">
          <div class="flex flex-col text-sm w-full">
            <div class="w-full flex justify-between items-center">
              <div class="text-base font-bold">
                {{ item.remark }}
              </div>
              <div class="p-2" @click.stop="audioPlay(item.audioUrl)">
                <van-icon name="volume" class="" />
              </div>
            </div>
            <div class="text-gray-500">
              {{ item.textContent || '暂无' }}
            </div>
            <!-- <audio controls :src="item.audioUrl"></audio> -->
          </div>
        </div>
        <div v-if="shopAudioList.length > 10" class="text-xs text-gray-500 pb-2 flex justify-center">
          没有更多了~
        </div>
      </div>
      <van-empty v-else description="暂无数据" />
    </div>

    <van-popup
      position="bottom"
      round
      class="p-2 box-border"
      :style="{ height: '50%' }"
      v-model="show"
      @close="onClose"
    >
      <van-field
        :value="textContent"
        type="textarea"
        placeholder="请输入文本内容"
        :autosize="{ minHeight: 200 }"
        :maxlength="30"
        @input="textContent = $event"
      />
      <div class="flex justify-end text-gray-500 text-xs mr-4">
        *最多30字
      </div>
      <div class="flex justify-around items-center">
        <van-button
          plain
          size="small"
          type="default"
          round
          class="w-20"
          @click="updateCancel"
        >
          取消
        </van-button>
        <van-button size="small" round class="w-20" type="info" @click="updateConfirm()">
          保存
        </van-button>
      </div>
    </van-popup>

    <van-popup
      v-model="showAudio"
      position="center"
      class="rounded"
      @close="closeAudio()"
    >
      <div class="w-full h-full flex justify-around items-center py-4 px-2 box-border">
        <audio controls :src="audioUrl"></audio>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { addOrModifyShopAudioInfo, getShopAudioList } from '@/api/shopAudio'
import {Toast} from 'vant'

export default {
  components: {
  },
  data() {
    return {
      show: false,
      showEmpty: true,
      shopAudioList: [],
      textContent: '',
      currentItem: {},
      devId: '',
      progress: 0,
      audioContext: null,
      isPlay: false,
      showAudio: false,
      isAnimation: false, // 重播样式
      audioUrl: '',
    }
  },
  activated() {
    this.devId = this.$route.query.devId
    this.textContent = ''
    this.getData()
  },
  methods: {
    async getData() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      })
      const res = await getShopAudioList({
        devId: this.devId,
      }).finally(() => Toast.clear())
      this.shopAudioList = res.body.resultList
      this.showEmpty = this.shopAudioList.length === 0
    },

    updateAudioContent(item) {
      this.show = true
      this.currentItem = item
      this.textContent = item.textContent
    },

    async addOrModifyShopAudioInfo() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      await addOrModifyShopAudioInfo({
        shopAudioId: this.currentItem.shopAudioId,
        textContent: this.textContent,
        textType: this.currentItem.textType,
        devId: this.devId,
      }).finally(() => Toast.clear())
      Toast.success('编辑成功')
    },

    onClose() {
      this.show = false
    },

    updateCancel() {
      this.show = false
      this.textContent = ''
    },
    async updateConfirm() {
      await this.addOrModifyShopAudioInfo()
      this.show = false
      this.textContent = ''
      await this.getData()
    },
    audioPlay(src) {
      // this.audioContext = uni.createInnerAudioContext()
      // this.audioContext.autoplay = false
      // this.audioContext.loop = false
      // this.audioContext.src = src
      // this.audioContext.onEnded(() => {
      //   this.audioContext.stop()
      //   this.isPlay = false
      // })
      if (src) {
        this.audioUrl = src
        this.showAudio = true
      }
      else
        Toast.fail('暂无音频')
    },
    // closeAudio() {
    //   this.audioContext.pause()
    //   this.isPlay = false
    //   this.showAudio = false
    // },
    // playChange() {
    //   if (this.isPlay) {
    //     this.isPlay = false
    //     this.audioContext.pause()
    //   }
    //   else {
    //     this.audioContext.play()
    //     this.isPlay = true
    //   }
    // },
    // replay() {
    //   this.isAnimation = true
    //   this.audioContext.stop()
    //   setTimeout(() => {
    //     this.isAnimation = false
    //     this.audioContext.currentTime = 0
    //     this.audioContext.play()
    //     this.isPlay = true
    //   }, 1000)
    // },
  },
}
</script>


<style lang="scss" scoped>
.replay-icon {
  animation: rotate 2s infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
