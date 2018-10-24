import { AppRouter } from '../router'
import Vue from 'vue'

import { api, h5Domain } from '../global'

const qqHelper = {
  qqSdk: false,
  init() {
    this.qqSdk = require('../assets/qqapi')
  },
  share(config) {
    if (!this.qqSdk) {
      this.init()
    }
    if (config.link) {
      config.share_url = config.link
    }
    config.image_url = config.imgUrl
    window.mqq.data.setShareInfo(config);
  }
}

export default qqHelper