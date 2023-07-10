<template>
  <div>
    <div class="absolute py-3 left-0 right-0 px-3 z-10 flex justify-between color-white [background-image:linear-gradient(180deg,#00000090,transparent)]">
      <van-icon name="arrow-left" class="text-2xl" @click="$router.back()" />
    </div>

    <VirtualSwiper ref="swiperRef" :slides="list" class="h-screen" :initial-swipe="index" @change="swiperChange" v-if="list && list.length">
      <template #slide="{ data, index }">
        <div class="relative h-full">
          <Video :ref="`player-${index}`" :src="data.videoUrl" class="w-full h-full"></Video>

          <div class="absolute bottom-0 w-full color-white [background-image:linear-gradient(0deg,black,transparent)]">
            <div class="flex items-center gap-2 px-3">
              <div class="text-xs">
                {{ data.createTime }}
              </div>
            </div>
            <div class="py-2 px-3">
              {{ data.displayName }}
            </div>
            <div class="flex items-center justify-between p-3">
              <div class="flex items-center gap-2" @click="like(data)">
                <van-icon :name="data.isLike ? 'like color-red-500' : 'like-o'" class="text-3xl"/>
                <span>{{ data.likeCount }}</span>
              </div>
              <div class="flex items-center gap-2" @click="toggleCollect(data)">
                <van-icon :name="data.isCollect ? 'star color-orange' : 'star-o'" class="text-3xl"/>
                <span>{{ data.collectCount }}</span>
              </div>
              <div class="flex items-center gap-2" @click="showComment = true">
                <van-icon name="comment-o" class="text-3xl"/>
                <span>{{ data.commentCount }}</span>
              </div>
              <div class="flex items-center gap-2" @click="showShare = true">
                <van-icon name="share-o" class="text-3xl"/>
                <span>{{ data.shareCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </VirtualSwiper>

    <van-popup v-model="showComment" position="bottom" class="h-3/5" round :lazy-render="false">
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-auto">
          <vc-list ref="commentsList" pull-refresh load-more :promise="getVideoComment" :finished-text="commentsList.length ? '没有更多了' : '暂无评论'">
            <ul class="p-3 flex flex-col gap-3">
              <li v-for="item, index of commentsList" :key="index" class="flex">
                <img :src="item.headPortrait" class="h-8 w-8 rounded-full overflow-hidden">
                <div class="pl-2">
                  <div class="text-sm color-gray-600">{{ item.commentUserName }}</div>
                  <div>{{ item.commentContent }}</div>
                  <div class="text-xs color-gray-500">{{ item.createTime }}</div>
                </div>
              </li>
            </ul>
          </vc-list>
        </div>
        <div class="border-t p-2 border-t-gray-200">
          <input
            type="text"
            placeholder="写评论"
            class="border-none px-3 py-2 bg-gray-100 rounded-full w-full box-border"
            v-model="commentContent"
            @keydown.enter="addComment()"
          >
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showShare" position="bottom" round>
      <div class="grid grid-cols-5">
        <div
          class="flex flex-col items-center gap-1 p-3"
          v-for="item of [
            {
              icon: '/static/images/share/e4b464da46b835c27e277cbff14ce0d.jpg',
              title: '抖音',
              type: 'douyin'
            },
            {
              icon: '/static/images/share/24171b5afc9d3abcbf65ac21626c3b9.png',
              title: '小红书',
              type: 'xiaohongshu',
              disabled: true,
            },
          ]"
          :class="{'opacity-50': item.disabled}"
          @click="share(item.type)"
        >
          <img :src="item.icon" class="h-8 w-8 rounded-full overflow-hidden">
          <span class="text-xs">{{ item.title }}</span>
        </div>
      </div>
      <div class="border-t border-t-gray-200"></div>
      <van-button class="border-none" block @click="showShare = false">取消</van-button>
    </van-popup>
  </div>
</template>

<script>
import VirtualSwiper from './components/VirtualSwiper.vue'
import Video from './components/Video.vue';

export default {
  components: {
    VirtualSwiper,
    Video,
  },
  data() {
    return {
      list: [],
      index: 0,
      commentContent: '',
      commentsList: [],

      showComment: false,
      showShare: false,
    }
  },
  computed: {
    activeItem() {
      return this.list[this.index]
    },
  },
  watch: {
    index: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.$refs.commentsList.reload()
        })
      }
    },
  },
  created() {
    this.list = this.$route.params.list
    this.index = this.$route.params.index
    if (this.list === undefined) {
      this.$router.back()
    }
  },
  mounted() {
    if (this.index === 0) {
      this.getPlayer(this.index).play()
    }
  },
  methods: {
    swiperChange({ index, lastIndex }) {
      if (lastIndex !== undefined)
        this.getPlayer(lastIndex).stop()

      this.index = index
      const player = this.getPlayer(index)
      player.play()

      if (index >= this.list.length - 2) {
        this.$root.$emit('video:load')
      }
    },
    getPlayer(index) {
      return this.$refs[`player-${index}`]
    },
    async getVideoComment({ pageNum }) {
      const res = await this.$post('/liveBroadcast/videoComment/getVideoComment', {
        videoZoneId: this.activeItem.videoZoneId,
        pageNum,
        pageSize: 10,
      })
      this.commentsList = pageNum === 1 ? res.body.resultList : [...this.commentsList, ...res.body.resultList]
      return this.commentsList.length === res.body.count
    },
    async addComment() {
      await this.$post('/liveBroadcast/videoComment/addVideoComment', {
        videoZoneId: this.activeItem.videoZoneId,
        commentContent: this.commentContent,
      })
      this.$refs.commentsList.reload()
      this.activeItem.commentCount += 1
      this.commentContent = ''
    },
    async share(type) {
      switch(type) {
        case 'douyin': {
          const res = await this.$post('/system/file/getSchemaUrl', {
            videoZoneId: this.activeItem.videoZoneId,
            title: this.activeItem.displayName,
            videoPath: this.activeItem.videoUrl
          })
          window.open(res.body.schemaUrl)
          break
        }
        default:
          this.$toast('暂不支持')
          break
      }
    },
    async like(item) {
      await this.$post('/liveBroadcast/videoAssociation/addVideoLikeCount', {
        videoZoneId: item.videoZoneId,
        likeType: [1, 2][item.isLike]
      })
      item.isLike = +!item.isLike
      item.likeCount += item.isLike ? 1 : -1
    },
    async toggleCollect(item) {
      const url = item.isCollect ? '/liveBroadcast/collectVideo/deleteCollectVideo' : '/liveBroadcast/collectVideo/addCollectVideo'
      await this.$post(url, {
        videoZoneId: item.videoZoneId,
      })
      item.isCollect = +!item.isCollect
      item.collectCount += item.isCollect ? 1 : -1
    }
  },
}
</script>

<style>
</style>
