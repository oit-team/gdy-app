<template>
  <div class="voice">
    <Header title="语音训练" @back="goBack">
      <template v-if="isRequest" slot="after">
        <span @click="getRandomQuestions">换一批</span>
      </template>
    </Header>
    <div v-if="isRequest" class="content-main">
      <div v-if="isImage" class="content-image__wrap">
        <img :src="trainingData.title" alt="" class="content-image">
      </div>
      <div v-else class="content-title">{{ trainingData.title }}</div>
    </div>
    <div class="content-secondary">
      <p class="content-secondary__title">释义：</p>
      <div class="content-secondary__text">
        <p>{{ trainingData.introduce }}</p>
      </div>
    </div>
    <div class="voice-actions">
      <div class="voice-score__wrap">
        <span class="voice-score-tips">得分:</span>
        <span class="voice-score">{{ scores[selected] || 0 }}</span>
      </div>
      <div class="flex-center">
        <vc-icon size="28" @click="handleVoice">
          {{ {[PLAY_STATE.STOPPED]: 'play-circle', [PLAY_STATE.PLAYING]: 'stop-circle'}[playState] }}
        </vc-icon>
      </div>
      <div class="page-actions">
        <div class="voice-count">{{ selected + 1 }}/{{ randomData.length }}</div>
        <vc-icon v-if="selected > 0" size="18" @click="prev">chevron-circle-left</vc-icon>
        <vc-icon v-if="selected < randomData.length - 1" size="18" @click="next">chevron-circle-right</vc-icon>
      </div>
    </div>
  </div>
</template>

<script>
import VOICE_CONTENT_TYPE from '@/enums/VOICE_CONTENT_TYPE'
import storage from '@/utils/storage'
import iframe from '@/iframe'
import * as api from '@/api/voice'
import { debounce } from 'lodash'

const PLAY_STATE = {
  // 正在播放
  PLAYING: 0,
  // 已停止
  STOPPED: 1,
}

export default {
  name: 'Voice',

  data: () => ({
    randomData: [],
    trainingData: {},
    selected: 0,
    scores: [],
    playState: PLAY_STATE.STOPPED,
  }),

  computed: {
    isRequest() {
      return VOICE_CONTENT_TYPE.REQUEST === this.$route.query.type
    },
    playedData() {
      return {
        id: this.trainingData.id,
        content: this.isImage ? this.trainingData.introduce : this.trainingData.title,
      }
    },
    isImage() {
      return /^https?:\/\//.test(this.trainingData.title)
    },
  },

  watch: {
    selected() {
      this.trainingData = this.randomData[this.selected]
      this.playVoice()
    },
  },

  activated() {
    if (this.$route.query.type === VOICE_CONTENT_TYPE.INPUT) {
      const pageParams = storage.getItem('pageParams')
      if (pageParams.page === this.$route.path) {
        this.trainingData = pageParams.data
      }
    } else {
      this.getRandomQuestions()
    }
  },

  created() {
    this.PLAY_STATE = PLAY_STATE
  },

  methods: {
    goBack() {
      iframe.router.back()
    },
    getRandomQuestions() {
      api.getRandomQuestions({
        brandId: localStorage.brandId,
        type: '面料',
      }).then(res => {
        this.randomData = res.body.resultList
        this.selected = 0
        this.trainingData = this.randomData[this.selected]
        this.scores = []
        this.playVoice()
      }).catch(err => {

      })
    },
    handleVoice() {
      switch (this.playState) {
        case PLAY_STATE.PLAYING: return this.stopVoice()
        case PLAY_STATE.STOPPED: return this.playVoice()
      }
    },
    playVoice: debounce(function() {
      iframe.actions.getVoiceCurrentSubject({
        content: this.playedData.content,
        subjectId: this.playedData.id,
      }, this.trainingResults, this.playStateChanged)
    }, 500),
    stopVoice() {
      iframe.actions.setVoiceStopPlay()
    },
    trainingResults(res) {
      this.$set(
        this.scores,
        this.selected,
        parseFloat(Number(100 * res.score).toFixed(2)),
      )
    },
    playStateChanged({ status }) {
      console.log(Number(status))
      this.playState = Number(status)
    },
    prev() {
      if (this.selected === 0) return
      this.selected--
    },
    next() {
      if (this.selected === this.randomData.length - 1) return
      this.selected++
    },
  },
}
</script>

<style lang="scss" scoped>
.voice {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
  }
}

.content-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px 15px;
  white-space: pre-wrap;

  .content-title {
    font-size: 20px;
  }

  .content-image__wrap {
    text-align: center;
  }

  .content-image {
    max-width: 80%;
    max-height: 40vh;
    overflow: hidden;
  }
}

.content-secondary {
  flex: 1;
  margin: 0 15px;
  padding: 0 15px;
  white-space: pre-line;
  border-radius: 10px;
  overflow-y: auto;
  background: var(--gray);

  .content-secondary__title {
    position: sticky;
    top: 0;
    padding: 10px 0;
    background: inherit;
  }

  .content-secondary__text {
    font-size: 15px;
  }
}

.voice-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px 0;
  box-sizing: border-box;

  > * {
    width: 33%;
  }

  .voice-score__wrap {
  }

  .voice-score-tips {
    font-size: 12px;
  }

  .voice-score {
    font-size: 16px;
    font-weight: bold;
  }

  .voice-count {
    margin-right: 5px;
    font-size: 12px;
  }

  .page-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .vc-icon {
      margin-left: 5px;
    }
  }
}
</style>
