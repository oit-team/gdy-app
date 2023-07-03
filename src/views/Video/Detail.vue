<script>
export default {
  data: () => ({
    data: {},
    commentsList: [],
    commentContent: '',
    pageNum: 1,

    playing: false,
    showComment: false,
    showShare: false,
  }),
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.loadData()
    const player = this.$refs.player
    player.controls = false
    player.play()

    player.addEventListener("play", () => {
      this.playing = true
    })

    player.addEventListener("pause", () => {
      this.playing = false
    })
  },
  methods: {
    async loadData() {
      const res = await this.$post('/liveBroadcast/videoAssociation/getVideoAssociationById', {
        videoZoneId: this.id
      })
      this.data = res.body
    },
    togglePlay() {
      const player = this.$refs.player
      player.paused ? player.play() : player.pause()
    },
    async like(item) {
      await this.$post('/liveBroadcast/videoAssociation/addVideoLikeCount', {
        videoZoneId: this.id,
        likeType: [1, 2][item.isLike]
      })
      item.isLike = +!item.isLike
      item.likeCount += item.isLike ? 1 : -1
    },
    async share(item) {
      const res = await this.$post('/system/file/getSchemaUrl', {
        videoZoneId: this.id,
        title: item.displayName,
        videoPath: item.videoUrl
      })
      window.open(res.body.schemaUrl)
    },
    async getVideoComment({ pageNum }) {
      const res = await this.$post('/liveBroadcast/videoComment/getVideoComment', {
        videoZoneId: this.id,
        pageNum,
        pageSize: 10,
      })
      this.commentsList = pageNum === 1 ? res.body.resultList : [...this.commentsList, ...res.body.resultList]
      return this.commentsList.length === res.body.count
    },
    async addComment() {
      await this.$post('/liveBroadcast/videoComment/addVideoComment', {
        videoZoneId: this.id,
        commentContent: this.commentContent,
      })
      this.pageNum = 1
      this.$refs.list.reload()
      this.commentContent = ''
    },
    async toggleCollect() {
      const url = this.data.isCollect ? '/liveBroadcast/collectVideo/deleteCollectVideo' : '/liveBroadcast/collectVideo/addCollectVideo'
      await this.$post(url, {
        videoZoneId: this.id,
      })
      this.data.isCollect = +!this.data.isCollect
      this.data.collectCount += this.data.isCollect ? 1 : -1
    }
  },
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <div class="absolute top-3 left-0 right-0 px-3 z-10 flex justify-between color-white">
      <van-icon name="arrow-left" class="text-2xl" @click="$router.back()" />
      <van-icon name="share-o" class="text-2xl" @click="showShare = true" />
    </div>

    <van-icon v-if="!playing" name="play" class="fixed top-1/2 left-1/2 -translate-1/2 text-6xl color-white" />
    <video :src="data.videoUrl" class="w-full h-full bg-black" ref="player" @click="togglePlay()" loop autoplay :controls="false"></video>

    <div class="absolute bottom-0 w-full color-white">
      <div class="flex items-center gap-2 px-3">
        <img :src="data.headPortrait" class="w-8 h-8 rounded-full">
        <span class="font-bold">{{ data.createIdName }}</span>
      </div>
      <div class="py-2 px-3">
        {{ data.displayName }}
      </div>
      <div class="flex items-center justify-around bg-black bg-opacity-30 py-3">
        <div class="flex items-center gap-2" @click="like(data)">
          <van-icon :name="data.isLike ? 'good-job' : 'good-job-o'" class="text-3xl"/>
          <span>{{ data.likeCount }}</span>
        </div>
        <div class="flex items-center gap-2" @click="toggleCollect()">
          <van-icon :name="data.isCollect ? 'star' : 'star-o'" class="text-3xl"/>
          <span>{{ data.collectCount }}</span>
        </div>
        <div class="flex items-center gap-2" @click="showComment = true">
          <van-icon name="comment-o" class="text-3xl"/>
          <span>{{ data.commentCount }}</span>
        </div>
      </div>
    </div>

    <van-popup v-model="showComment" position="bottom" class="h-3/5" round>
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-auto">
          <vc-list ref="list" pull-refresh load-more :promise="getVideoComment" immediate finished-text="暂无评论">
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
            @keydown.enter="addComment"
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
              title: '抖音'
            }
          ]"
          @click="share(data)"
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
