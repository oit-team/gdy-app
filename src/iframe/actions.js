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
  }
}
