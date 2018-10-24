import Vue from 'vue'
import App from './App.vue'

import platformHelper from 'Helper/platform'
import wechatHelper from './helper/wechat'
import shareHelper from './helper/share'
import commonHelper from './helper/common'
import storageHelper from './helper/storage'

import { AppRouter, VueRouter } from './router'
import { MessageBox } from 'mint-ui'

import Vuex from 'vuex'

// 样式
import 'mint-ui/lib/style.css'
import 'swiper/src/less/swiper.less'
import FastClick from 'fastclick/lib/fastclick'

import userHelper from "Helper/user"

let isEnter = true

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}
// 引入echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.prototype.$common = commonHelper

Vue.use(Vuex)
Vue.use(VueRouter);
const store = new Vuex.Store({
  state: {
    mainNav: true,
    navTitle: "",
    navType: 0,
    clientHeight: 0,
    clientWidth: 0,
    normalCover: false,
    tabList: [{
        name: '首页',
        src: 'index',
        icon: 'newicon/home',
        active: true
      }, {
        name: '产品',
        src: 'investment',
        icon: 'newicon/list',
        active: false
      }, {
        name: '我的',
        src: 'personal',
        icon: 'newicon/user',
        active: false
      },
      {
        name: '更多',
        src: 'more',
        icon: 'newicon/conten',
        active: false
      }
    ]
  }
});

(function(doc, win, store) {
  var docEl = doc.documentElement,
    resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
    recalc = function() {
      store.state.clientHeight = docEl.clientHeight;
      store.state.clientWidth = docEl.clientWidth;
      let clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window, store)

AppRouter.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV == "production") {
    //window._hmt = [];
    //百度发送页面记录
    window._hmt.push(['_trackPageview', '/#' + to.fullPath]);
    //友盟发送页面记录
    if (isEnter) {
      isEnter = false
      let ref = window.document.referrer.length > 0 ? window.document.referrer : ""
      window._czc.push(["_trackPageview", '/#' + to.fullPath, ref]);
    } else {
      window._czc.push(["_trackPageview", '/#' + to.fullPath, '/#' + from.fullPath]);
    }
  }

  let channel = to.query.utm_source || to.query.channel
  if (channel) storageHelper.setJson("channel", channel, "session");

  MessageBox.close(false);

  if (to.meta.title) {
    store.state.navTitle = to.meta.title;
  } else {
    store.state.navTitle = ""
  }

  if (to.meta.navType) {
    store.state.navType = to.meta.navType;
  } else {
    store.state.navType = 0
  }

  if (to.meta.index || to.name) {
    for (var i of store.state.tabList) {
      if (i.src == to.meta.index || i.src == to.name) {
        i.active = true
      } else {
        i.active = false
      }
    }
  }

  let nextObj = {}
  if (to.matched.some(record => record.meta.needLogin)) {
    if (platformHelper.isApp() && to.matched.some(record => record.meta.appUse)) {
      next()
      return
    }
    userHelper.isLogin({
      success() {
        next()
        window.scrollTo(0, 0)
      },
      fail() {
        if (from.name == "login") {
          nextObj = { name: 'index' }
        } else {
          nextObj = {
            name: 'login',
            query: { redirect: to.fullPath },
            params: { to }
          }
        }
        next(nextObj)
        window.scrollTo(0, 0)
      }
    })
    return true
  }
  next()
  window.scrollTo(0, 0)
})

if (process.env.NODE_ENV == "production") {
  //百度统计初始化
  window._hmt = window._hmt || [];
  window._hmt.push(['_setAutoPageview', false]);
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?7ac3b26e881b71ff718c15f4ee4fa34e";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();

  //友盟统计初始化
  window._czc = window._czc || [];
  //绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
  window._czc.push(["_setAccount", "1273631223"]);
  window._czc.push(['_setAutoPageview', false]);
  var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");

  window.document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_1273631223'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s22.cnzz.com/z_stat.php%3Fid%3D1273631223' type='text/javascript'%3E%3C/script%3E"));
}

if (platformHelper.isWx()) {
  wechatHelper.init();
}

let channel = commonHelper.getQueryString("utm_source") || commonHelper.getQueryString("channel")
if (channel) storageHelper.setJson("channel", channel, "session");

new Vue({
  router: AppRouter,
  el: '#app',
  store,
  render: h => h(App)
})