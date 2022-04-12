/**
* 微信js-sdk
* 参考文档：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
*/
import wx from 'weixin-js-sdk'
import Axios from 'axios'
const wxApi = {
/**
* [wxRegister 微信Api初始化]
* @param {Function} callback [ready回调函数]
*/

  wxRegister (callback) {
    // 根据接口拿到需要的appid，timestamp，签名等信息,这边的接口请换成自己的
    Axios.post('/自己的请求接口',{ reqUrl: window.location.href }, { timeout: 5000, withCredentials: true }).then((res)=>{
      let data = JSON.parse(res.data.data)    // PS: 这里根据你接口的返回值来使用
      wx.config({
        debug: false, // 开启调试模式
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.noncestr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        // jsApiList: data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']   // 分享到好友,分享到朋友圈
      })
    }).catch((error)=>{
      console.log(error)
    })
    wx.ready(res=>{
      if(callback){
        callback()
      }
    })
  },

  /**
  * [ShareTimeline 微信分享到朋友圈]
  * @param {[type]} option [分享信息]
  * @param {[type]} success [成功回调]
  * @param {[type]} error [失败回调]
  */
  shareTimeline (option) { // 分享朋友圈
    wx.updateTimelineShareData({
      title: option.title, // 分享标题
      link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: option.imgUrl || 'https://images.ktpis.com/app_logo_new_new.png', // 分享图标
      success () {
        if (option.success) option.success()
        // 设置成功
      }
    })
  },
  /**
  * [ShareAppMessage 微信分享给朋友]
  * @param {[type]} option [分享信息]
  * @param {[type]} success [成功回调]
  * @param {[type]} error [失败回调]
  */
  shareAppMessage (option) { // 分享朋友
    wx.updateAppMessageShareData({
      title: option.title, // 分享标题
      desc: option.desc, // 分享描述
      link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: option.imgUrl || 'https://images.ktpis.com/app_logo_new_new.png', // 分享图标
      success () {
        if (option.success) option.success()
        // 设置成功
      }
    })
  }
}
export default wxApi

