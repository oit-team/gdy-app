<script>
import FinishingRateEcharts from './components/FinishingRateEcharts.vue'
import StatisticsData from './components/statisticsData.vue'
import ShareContent from './components/ShareContent.vue'
import ShareItem from './components/ShareItem.vue'
import NearlySevenDay from './components/nearlySevenDay.vue'
import { upload } from '@uxuip/axios-upload'
import axios from 'axios'
import iframe from '@/iframe'
import { Toast } from 'vant'

function transformRequest(data) {
  const { file } = data

  return {
    ...data,
    totalSize: file.raw.size,
    startPos: file.start,
    endPos: file.end,
    noThumb: file.end === file.raw.size ? 0 : 101,
    fileType: 0,
    userId: localStorage.userId,
    fname: `${Date.now()}.png`,
  }
}

export default {
  components: {
    ShareItem,
    ShareContent,
    FinishingRateEcharts,
    StatisticsData,
    NearlySevenDay,
  },
  data: () => ({
    editable: false,
    showShare: false,

    options: [
      { name: '微信', icon: 'http://res.oitor.com:8099/upload/15000985612/2021/2/3db93b5eee414d62a400d18bb622a049.png' },
      { name: '朋友圈', icon: 'http://res.oitor.com:8099/upload/15000985612/2021/2/0695fe7d5b9a452fb3c2818a0fab8099.png' },
      { name: '保存图片', icon: '/static/images/icon/download.png' },
    ],
  }),
  created() {
  },
  methods: {
    async share({ name }) {
      try {
        Toast.loading({
          message: '图片生成中...',
          duration: 0,
          forbidClick: true,
        })
        const blob = await this.$refs.share.screenshot()
        const res = await this.upload(blob)
        console.log(res)
        switch(name) {
          case '微信':
            iframe.actions.shareImage(res.data.fileUrl, {
              shareType: 2,
            })
            break
          case '朋友圈':
            iframe.actions.shareImage(res.data.fileUrl, {
              shareType: 3,
            })
            break
          case '保存图片':
            iframe.actions.saveImageLocal(res.data.fileUrl)
            break
        }
      } finally {
        Toast.clear()
      }
    },
    upload(blob) {
      return new Promise((resolve, reject) => {
        upload({
          action: `/system/file/upVideoOrAudio`,
          headers: {
            token: localStorage.accessToken,
            userId: localStorage.userId,
          },
          chunkSize: 5 * 1024 * 1024,
          transformRequest: [transformRequest, axios.defaults.transformRequest[0]],
          file: blob,
          onSuccess: resolve,
          onError: reject,
        })
      })
    },
  },
}
</script>

<template>
  <div>
    <van-sticky>
      <Header title="分享">
        <div slot="after" class="flex gap-3">
          <span @click="editable = !editable">{{editable ? '完成' : '编辑' }}</span>
          <span @click="showShare = true" v-if="!editable">生成</span>
        </div>
      </Header>
    </van-sticky>
    <ShareContent class="flex flex-col gap-2" ref="share" :editable="editable">
      <ShareItem>
        <div class="flex justify-between p-1">
          <span class="title !p-0">7月业绩</span>
          <span class="text-xs">
            202307第<span class="text-base">2</span>名
          </span>
        </div>
        <!-- 左侧数据 -->
        <div class="flex justify-between items-center bg-gray-100 rounded">
          <StatisticsData />
          <!-- 右侧图表 -->
          <FinishingRateEcharts />
        </div>
      </ShareItem>

      <ShareItem>
        <div class="title">店铺今日销售</div>
        <!-- 近七天下方销售额 -->
        <NearlySevenDay class="bg-gray-100 rounded"/>
      </ShareItem>

      <ShareItem>
        <div class="flex">
          <div class="flex-1">
            <div class="title">店铺当日销售排名Top15</div>
            <table>
              <tr>
                <th>仓库名称</th>
                <th>销件数</th>
              </tr>
              <tr v-for="i of 15">
                <td>电商NP天猫旗舰店</td>
                <td class="color-red-600 font-bold">321</td>
              </tr>
            </table>
          </div>
          <div class="flex-1">
            <div class="title">本月累计销售排名Top15</div>
            <table>
              <tr>
                <th>仓库名称</th>
                <th>销件数</th>
              </tr>
              <tr v-for="i of 15">
                <td>电商NP天猫旗舰店</td>
                <td class="color-red-600 font-bold">321</td>
              </tr>
            </table>
          </div>
        </div>
      </ShareItem>

      <ShareItem>
        <div>
          <div class="title">店铺当日销售排名Top15</div>
          <table>
            <tr>
              <th>系列</th>
              <th>款号</th>
              <th>款图</th>
              <th>零售</th>
            </tr>
            <tr v-for="i of 5">
              <td>N1</td>
              <td>XNHIA6419AM</td>
              <td>
                <img src="/static/imgs/clo1.jpg" class="w-8 h-8">
              </td>
              <td class="color-red-600 font-bold">321</td>
            </tr>
          </table>
        </div>
      </ShareItem>

      <ShareItem>
        <div>
          <div class="title">VIP情况</div>
          <table>
            <tr>
              <th>预约</th>
              <th>实际到店</th>
              <th>VIP客单数</th>
              <th>VIP消费件数</th>
              <th>VIP消费金额</th>
            </tr>
            <tr>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td class="color-red-600 font-bold">5555</td>
            </tr>
          </table>
        </div>
      </ShareItem>
    </ShareContent>

    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="share"
    />
  </div>
</template>

<style scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  padding: 4px;
}

table {
  font-size: 14px;
  width: 100%;
  text-align: center;
}

th {
  background: #7f7f7f;
  color: white;
  padding: 4px;
}
</style>
