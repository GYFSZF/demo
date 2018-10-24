import { AppRouter } from '../router'
import Vue from 'vue'

import { api, h5Domain } from '../global'
import { MessageBox } from 'mint-ui'

import platformHelper from "./platform"
import wechatHelper from "./wechat"
import qqHelper from "./qq"

const shareHelper = {
  share(info) {
    if (platformHelper.isWx()) {
      this.wxShare(info)
      return false
    }
    if (platformHelper.isQQ()) {
      this.qqShare(info)
      return false
    }
  },
  qqShare(info) {
    qqHelper.share(info);
    // var qqShareName = document.getElementById('qq-share-name');
    // var qqShareImg = document.getElementById('qq-share-image');
    // var qqShareDescription = document.getElementById('qq-share-description');
    // var s = document.getElementsByTagName("meta")[0];
    //
    // if (!qqShareName) {
    //   qqShareName = document.createElement("meta");
    //   qqShareName.setAttribute("id", "qq-share-name");
    //   qqShareName.setAttribute("itemprop", "name");
    //   s.parentNode.insertBefore(qqShareName, s);
    // }
    // if (!qqShareImg) {
    //   qqShareImg = document.createElement("meta");
    //   qqShareImg.setAttribute("id", "qq-share-image");
    //   qqShareImg.setAttribute("itemprop", "image");
    //   s.parentNode.insertBefore(qqShareImg, s);
    // }
    // if (!qqShareDescription) {
    //   qqShareDescription = document.createElement("meta");
    //   qqShareDescription.setAttribute("id", "qq-share-description");
    //   qqShareDescription.setAttribute("itemprop", "description");
    //   qqShareDescription.setAttribute("name", "description");
    //   s.parentNode.insertBefore(qqShareDescription, s);
    // }
    //
    // qqShareName.setAttribute("content", info.title)
    // qqShareImg.setAttribute("content", info.imgUrl)
    // qqShareDescription.setAttribute("content", info.desc)
  },
  wxShare(info) {
    wechatHelper.share(info)
  }
}

export default shareHelper