import Vue from 'vue'
import { AppRouter } from '../router'

import { h5Domain } from '../global'

import userHelper from './user'
import shareHelper from './share'
/**
 * 平台相关
 */

const platformHelper = {
  info: null,
  vue: {},
  IOSReady: false,
  IOSVer: 0,
  isApp() {
    if (this.info.indexOf("ETL-ios") > -1 || this.info.indexOf("ETL-android") > -1) {
      return true
    }
    return false
  },
  isIOS() {
    if (this.info.indexOf("ETL-ios") > -1) {
      return true
    }
    return false
  },
  isAndroid() {
    if (this.info.indexOf("ETL-android") > -1) {
      return true
    }
    return false
  },
  isWx() {
    if (this.info.toLowerCase().indexOf("micromessenger") > -1) {
      return true
    }
    return false
  },
  isQQ() {
    if (this.info.toLowerCase().indexOf("qq") > -1) {
      return true
    }
    return false
  },
  getPlatformInfo() {
    if (this.info) {
      return true
    }
    if (navigator.userAgent) {
      this.info = navigator.userAgent
    }
  },
  AppInfo: false,
  setAppInfo(obj) {
    this.handleAppInfo(obj)
    if (!this.AppInfo) {
      return false
    }
    if (!this.isApp()) {
      const ShareInfo = {
        title: this.AppInfo.title,
        desc: this.AppInfo.subTitle,
        imgUrl: this.AppInfo.imgUrl,
        link: this.AppInfo.contentUrl,
      }
      shareHelper.share(ShareInfo);
      return false
    }

    let json = JSON.stringify(this.AppInfo);

    if (this.isIOS()) {
      if (!this.IOSReady || this.IOSVer < 1) {
        return false
      }
      WebViewJavascriptBridge.callHandler('setAppInfo', json)
    } else if (this.isAndroid()) {
      //alert("调用js" + window.JsInterface.setWebViewStyleAndTitleAndTime)
      window.JsInterface.setAppInfo(json)
    }
  },
  handleAppInfo(obj) {
    if (!obj) {
      return false
    }

    if (obj.subTitle && obj.subTitle) {
      obj.subTitle = obj.subTitle.substr(0, 500)
    }

    let cdnDomain = "http://images.etiaolong.com/"
    this.AppInfo = {
      title: obj.title,
      subTitle: obj.subTitle,
      imgUrl: obj.imgUrl ? cdnDomain + obj.imgUrl : "http://images.etiaolong.com/yunying/logo.jpg",
      contentUrl: obj.contentUrl ? h5Domain + "#" + obj.contentUrl : h5Domain,
    }
  },
  callShare(obj) {
    if (!this.isApp()) {
      return false
    }
    let json = JSON.stringify(obj);
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('callShare', json)
    } else if (this.isAndroid()) {
      if (!json) {
        window.JsInterface.callShare()
        return false
      }
      window.JsInterface.callShare(json)
    }
  },
  gardenRodToList() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('jumpToNative', { 'type': 1 })
    } else if (this.isAndroid()) {
      window.JsInterface.goToInvest()
    }
  },
  appraisalAgain() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('appraisalAgain')
    } else if (this.isAndroid()) {
      window.JsInterface.appraisalAgain()
    }
  },
  toInvest() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('goToInvest')
    } else if (this.isAndroid()) {
      window.JsInterface.goToInvest()
    }
  },
  gardenRodToDetail(bidid) {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('jumpToNative', { 'type': 2, param: { 'bid': bidid } })
    } else if (this.isAndroid()) {
      window.JsInterface.gardenRodToDetail('artGallery/')
    }
  },
  gardenRodToAward() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('jumpToNative', { 'type': 3 })
    } else if (this.isAndroid()) {
      window.JsInterface.goToAward()
    }
  },
  creatPreorder(obj) {
    if (!this.isApp()) {
      return false
    }
    if (!userHelper.isLoginInApp()) {
      this.callLogin()
      return false
    }
    let json = JSON.stringify(obj);
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('onLineBook', json)
    } else if (this.isAndroid()) {
      window.JsInterface.onLineBook(json)
    }
  },
  creatOrder(obj) {
    if (!this.isApp()) {
      return false
    }
    if (!userHelper.isLoginInApp()) {
      this.callLogin()
      return false
    }
    let json = JSON.stringify(obj);
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('buyGoodsNow', json)
    } else if (this.isAndroid()) {
      window.JsInterface.buyGoodsNow(json)
    }
  },
  callLogin(json) {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('goToLogin', json)
    } else if (this.isAndroid()) {
      let str = JSON.stringify(json)
      window.JsInterface.goToLogin(str)
    }
  },
  changeGoodsDetailContent(type) {
    if (!this.isApp()) {
      return false
    }
    let json = JSON.stringify(type)
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('DidScorllToChangeNavigationButStatus', json)
    } else if (this.isAndroid()) {
      window.JsInterface.DidScorllToChangeNavigationButStatus(json)
    }
  },
  toCart() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('goToShoppingCard')
    } else if (this.isAndroid()) {
      window.JsInterface.goToShoppingCard()
    }
  },
  logOut() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('webViewTokenPastDue')
    } else if (this.isAndroid()) {
      window.JsInterface.webViewTokenPastDue()
    }
  },
  to404() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('webView404')
    } else if (this.isAndroid()) {
      window.JsInterface.webView404()
    }
  },
  ready() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      WebViewJavascriptBridge.callHandler('ready', {})
    } else if (this.isAndroid()) {
      return false
    }
  },
  setVue(obj) {
    //alert(obj)
    this.vue = obj
  },
  toDepositFund() {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      if (this.IOSVer < 1) {
        return false
      }
      WebViewJavascriptBridge.callHandler('jumpToNative', { 'type': 6 })
    } else if (this.isAndroid()) {
      window.JsInterface.goToDepositFund()
    }
  },
  finishDepositOperate(type) {
    if (!this.isApp()) {
      return false
    }
    if (this.isIOS()) {
      if (this.IOSVer < 2) {
        return false
      }
      WebViewJavascriptBridge.callHandler('finishDepositOperate', type)
    } else if (this.isAndroid()) {
      window.JsInterface.finishDepositOperate(type)
    }
  },
  /**
   * App调用同步用户信息
   * [_syncLoginInfo description]
   * @param  {[type]} userObj [description]
   * @return {[type]}         [description]
   */
  _syncLoginInfo(userObj) {
    if (!userObj) {
      userHelper.logOut()
      if (platformHelper.vue && typeof platformHelper.vue.reloadData == "function") {
        platformHelper.vue.reloadData()
      }
      return false
    }
    if (this.isIOS()) {
      userObj = JSON.parse(userObj)
    }
    if (userObj.SESSIONID) {
      docCookies.setItem("SESSION", userObj.SESSIONID, null, '/', '.etiaolong.com')
    }

    userHelper.setUserInfoForApp(userObj)
    if (platformHelper.vue && typeof platformHelper.vue.reloadData == "function") {
      platformHelper.vue.reloadData()
    }
  }
}

platformHelper.getPlatformInfo()

if (platformHelper.isIOS()) {
  if (!window.setupWebViewJavascriptBridge) {
    window.setupWebViewJavascriptBridge = (callback) => {
      if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
      if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }

    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler('shareClickAction', function(data, responseCallback) {
        alert('JS方法被调用:' + data);
        responseCallback('js执行过了');
      })
      bridge.registerHandler('syncUserInfo', function(userObj, responseCallback) {
        platformHelper._syncLoginInfo(userObj)
        responseCallback('success');
      })
      bridge.registerHandler('ready', function(data, responseCallback) {
        if (data.version) {
          platformHelper.IOSVer = parseInt(data.version)
        }
        platformHelper.ready()
        platformHelper.IOSReady = true
        platformHelper.setAppInfo()
        responseCallback('success');
      })
      bridge.registerHandler('goodsDetailInfoDidClickGoodOrDetail', function(type, responseCallback) {
        if (!platformHelper.vue) {
          responseCallback("error")
          return false
        }
        platformHelper.vue.content = type
      })
    })
  }
}
if (platformHelper.isAndroid()) {
  if (!window.JsInterface) {
    alert("安卓APP错误，没有找到JsInterface类")
  }
  window.THAndroidJS = {
    shareClickAction(data) {
      alert('JS方法被调用:' + data);
    },
    goodsDetailInfoDidClickGoodOrDetail(type) {
      //alert(type)
      if (!platformHelper.vue) {
        return false
      }
      platformHelper.vue.content = type
    },
    syncUserInfo(userObj) {
      platformHelper._syncLoginInfo(userObj)
    }
  }
}
//JsInterface

let docCookies = {
  getItem: function(sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function(sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function(sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function() {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

export default platformHelper