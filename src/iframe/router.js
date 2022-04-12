import util from './util'
import storage from '../utils/storage'

export default {
  /**
   * 返回上一页
   */
  back() {
    util.postMessage('goToLastPage')
  },
  /**
   * 跳转语音训练视图
   * @param {object} params
   * @param {string} params.initUrl VUE页面加载地址
   * @param {object} params.data 数据
   */
  initVoiceTrain(params) {
    storage.setItem('pageParams', {
      page: '/voice',
      data: params.data
    })

    util.postMessage('initVoiceTrain', params)
  },
}
