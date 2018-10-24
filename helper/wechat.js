import { api } from '../global'
import platformHelper from "./platform"
import httpHelper from './http'

const wechatSdk = require('../assets/jweixin-1.2.0')

const wechatHelper = {
  shareConfig: false,
  ready: false,
  init() {
    wechatSdk.ready(function() {
      wechatHelper.ready = true
      if (wechatHelper.shareConfig) {
        wechatHelper.share(wechatHelper.shareConfig)
      }
    });
    const url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search

    httpHelper.post("/operator/wx/share", {
      data: url,
      success(data) {
        let config = {
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.noncestr, // 必填，生成签名的随机串
          signature: data.sign, // 必填，签名，见附录1
          //debug: true,
          jsApiList: [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ]
        }
        //alert(JSON.stringify(data))
        wechatSdk.config(config)
        return false;
      }
    })

    // Vue.http.get(api.wx_config, { params: data }).then(response => {
    //   if (!response.ok || response.status != "200") {
    //     return false
    //   }
    //   let data = response.data
    //   if (data.code == 100 && data.result) {
    //     let config = {
    //       appId: data.result.appId, // 必填，公众号的唯一标识
    //       timestamp: data.result.timestamp, // 必填，生成签名的时间戳
    //       nonceStr: data.result.noncestr, // 必填，生成签名的随机串
    //       signature: data.result.sign, // 必填，签名，见附录1
    //       jsApiList: [
    //         "onMenuShareTimeline",
    //         "onMenuShareAppMessage",
    //         "onMenuShareQQ",
    //         "onMenuShareWeibo",
    //         "onMenuShareQZone"
    //       ]
    //     }
    //     wechatSdk.config(config)
    //     return false;
    //   }
    //   errorHelper.showErrorMsg(1004);
    //   if (typeof params.failed == "function") {
    //     return false
    //   }
    // }, response => {
    //   errorHelper.showErrorMsg(1004);
    //   if (typeof params.failed == "function") {
    //     return false
    //   }
    // });
  },
  share(config) {
    this.shareConfig = config
    if (!this.ready) {
      return false;
    }
    wechatSdk.onMenuShareTimeline(this.shareConfig)
    wechatSdk.onMenuShareAppMessage(this.shareConfig)
    wechatSdk.onMenuShareQQ(this.shareConfig)
    wechatSdk.onMenuShareWeibo(this.shareConfig)
  }
}

export default wechatHelper