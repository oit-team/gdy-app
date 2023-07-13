import util from './util'

export default {
  /**
   * 请求播放训练内容
   * @param params
   * @param {function} callback 语音识别结束
   * @param {function} stateCallback 语音播放结束或停止
   */
  getVoiceCurrentSubject(params, callback, stateCallback) {
    params.callback = 'getVoiceSubjectResult'
    params.playStatusCallback = 'getVoicePlayStatus'

    util.postMessage('getVoiceCurrentSubject', params)
    util.bindEventListener(params.callback, callback)
    util.bindEventListener(params.playStatusCallback, stateCallback)
  },
  /**
   * 停止播放
   */
  setVoiceStopPlay() {
    util.postMessage('setVoiceStopPlay')
  },
  /**
   * 保存图片
   * @param {string} src
   */
  saveImageLocal(src) {
    util.postMessage('saveImageLocal', {
      ImgUrl: src,
    })
  },
  /**
   *
   * @param {string} src
   * @param {object} options 选项
   * @param {2 | 3} options.shareType 类型 2:好友 3:朋友圈
   * @param {string} options.title 标题
   * @param {string} options.detailDesc 描述
   */
  shareImage(src, options) {
    util.postMessage('ShareImage', {
      ImgUrl: src,
      ...options,
    })
  },
}
