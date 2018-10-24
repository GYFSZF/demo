import { AppRouter } from 'Src/router'

import { api } from 'Src/global'

import storageHelper from 'Helper/storage.js'
import httpHelper from 'Helper/http.js'
import errorHelper from "Helper/error"
import cdnHelper from 'Helper/cdn.js'
import platformHelper from './platform'

import { Indicator } from 'mint-ui';

const needLogin = true

/**
 * 用户相关帮助
 */
const userHelper = {

  key: "user", // storage中使用的key
  token_key: "user_token",
  expire_time_key: "expire_time_token",
  expire_time: 120,

  /**
   * 登录
   *
   * @param   {obj} data 登入所需信息
   * @return  void
   */
  login(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let data = params.data
    if (!data.phone || !data.password) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let options = {
      data: {
        phone: data.phone,
        password: data.password
      },
      needLogin,
      success(data) {
        storageHelper.setJson(userHelper.token_key, data.gestureKey);
        let expireTime = new Date().getTime() + userHelper.expire_time * 60 * 1000;
        storageHelper.setJson(userHelper.expire_time_key, expireTime);
        let callBack = ""
        if (typeof params.success == "function") {
          callBack = params.success
        }
        userHelper.getUserInfo(callBack)
      },
      fail(res) {
        if (typeof params.fail == "function") {
          params.fail(res)
        }
      }
    }
    httpHelper.post(api.login, options)
  },


  /**
   * 孩子王登录
   *
   * @param   {obj} data 登入所需信息
   * @return  void
   */
  hzwLogin(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let data = params.data
    if (!data.phone || !data.smsCode) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let options = {
      data: {
        token: data.token,
        phone: data.phone,
        smsCode: data.smsCode,
      },
      needLogin,
      success(data) {
        storageHelper.setJson(userHelper.token_key, data.gestureKey);
        let expireTime = new Date().getTime() + userHelper.expire_time * 60 * 1000;
        storageHelper.setJson(userHelper.expire_time_key, expireTime);
        let callBack = ""
        if (typeof params.success == "function") {
          callBack = params.success
        }
        userHelper.getUserInfo(callBack)
      },
      fail(res) {
        if (typeof params.fail == "function") {
          params.fail(res)
        }
      }
    }
    httpHelper.post(api.hzw_login, options)
  },

  /**
   * 获取用户信息
   * [getUserInfo description]
   * @return {[type]} [description]
   */
  getUserInfo(callBack) {
    let options = {
      needLogin,
      data: '',
      success(data) {
        storageHelper.setJson(userHelper.key, data, "session");
        storageHelper.setJson(userHelper.key, data)
        if (typeof callBack == "function") {
          callBack()
        }
      }
    }
    httpHelper.post(api.user_info, options)
  },

  /**
   * 获取用户信息
   *
   * @return  obj|false
   */
  info() {
    return storageHelper.getJson(userHelper.key, "session");
    //return storageHelper.getJson(this.key)
  },

  token() {
    return storageHelper.getJson(this.token_key)
  },

  /**
   * 判断用户是否登入
   *
   * @return  obj|false
   */
  isLogin(params, needLogin) {

    if (platformHelper.isApp()) {
      if (!this.isLoginInApp(needLogin)) {
        if (params && typeof params.fail == "function") {
          params.fail()
        }
        return false
      }
      if (params && typeof params.success == "function") {
        params.success()
      }
      return false
    }

    let token = this.token()
    let expireTime = this._getExpireTime()
    let nowTime = new Date().getTime()

    if (token) {
      if (this.info() && expireTime && expireTime > nowTime) {
        if (params && typeof params.success == "function") {
          params.success()
        }
        return true
      }

      this.exemptLogin({
        success() {

          if (params && typeof params.success == "function") {
            params.success()
          }
        },
        fail() {
          userHelper.logOut()
          console.log(needLogin)
          if (needLogin) {
            AppRouter.replace({
              name: 'login',
              query: {
                redirect: AppRouter.currentRoute.fullPath,
                back: "replace"
              },
              params: { to: AppRouter.currentRoute }
            });
            return false
          }
          if (params && typeof params.fail == "function") {
            params.fail()
          }
        }
      })
      return true
    }

    //errorHelper.showErrorMsg(2009)

    this.logOut()

    if (needLogin) {
      AppRouter.replace({
        name: 'login',
        query: {
          redirect: AppRouter.currentRoute.fullPath,
          back: "replace"
        },
        params: { to: AppRouter.currentRoute }
      });
      return false
    }
    if (params && typeof params.fail == "function") {
      params.fail()
    }
    return false
  },

  exemptLogin(params) {
    let options = {
      needLogin,
      errorHandle: false,
      data: {
        gestureKey: this.token()
      },
      success(data) {
        let expireTime = new Date().getTime() + userHelper.expire_time * 60 * 1000;
        storageHelper.setJson(userHelper.expire_time_key, expireTime);

        let callBack = ""
        if (typeof params.success == "function") {
          callBack = params.success
        }

        userHelper.getUserInfo(callBack)
      },
      fail() {
        if (typeof params.fail == "function") {
          params.fail()
        }
      }
    }
    httpHelper.post(api.exempt_login, options)
  },


  /**
   * 判断用户是否登入
   *
   * @return  obj|false
   */
  isLoginInApp(needLogin) {
    let info = this.info()
    if (info) {
      return info;
      //errorHelper.showErrorMsg(2009)
    }
    // if (needLogin) {
    //   AppRouter.replace({
    //     name: 'login',
    //     query: {
    //       redirect: AppRouter.currentRoute.fullPath,
    //       back: "replace"
    //     },
    //     params: { to: AppRouter.currentRoute }
    //   });
    // }
    return false
  },

  /**
   * 退出
   */
  logOut(jump) {
    localStorage.removeItem(userHelper.token_key);
    localStorage.removeItem(userHelper.expire_time_key);
    localStorage.removeItem(userHelper.key);
    sessionStorage.removeItem(userHelper.key);
    httpHelper.post(api.user_logout, { needLogin: true })
    if (jump) {
      AppRouter.replace({
        name: "login",
        params: {
          to: AppRouter.currentRoute,
        }
      })
    }
  },
  /**
   * 注册
   *
   * @param   {obj} params
   * @return  void
   */
  regist(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    let data = params.data
    if (!data.mobile || !data.verifyCode || !data.password) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    Indicator.open()
    Vue.http.post(api.register, data, { emulateJSON: true }).then(response => {
      Indicator.close()
      if (!response.ok || response.status != "200") {
        errorHelper.showErrorMsg(1004);
        return false
      }
      if (typeof params.success == "function") {
        params.success(response.data)
      }
    }, response => {
      Indicator.close()
      errorHelper.showErrorMsg(1004);
    });
    //let userHelper = this
  },

  /**
   * 更新用户信息
   *
   * [updateUserInfo description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  updateUserInfo({ real_status, paypwd_status, birthday }, callBack) {
    let userInfo = this.info()
    let data = {
      "id": userInfo.id,
    }
    if (paypwd_status) {
      data.paypwd_status = paypwd_status
    }
    if (real_status) {
      data.real_status = real_status
    }
    if (birthday) {
      data.birthday = birthday
    }
    Indicator.open()
    let options = {
      data: {
        "id": userInfo.id,
      },
      needLogin,
      success: this.after,
      fail: this.errater
    }
    httpHelper.post(api.user_info, options)
  },
  after(res) {
    if (res) {
      if (paypwd_status) {
        userInfo.paypwd_status = paypwd_status
        console.log(nickname)
      }
      if (real_status) {
        userInfo.real_status = real_status
      }
      if (birthday) {
        userInfo.birthday = birthday
      }
      storageHelper.setJson(this.key, data, "session");
      storageHelper.setJson(this.key, userInfo)
      if (typeof callBack == "function") {
        callBack()
      }
    }
  },
  errater() {
    Indicator.close()
    errorHelper.showErrorMsg(1004);
  },
  /**
   * 忘记密码
   * [forgetPwd description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  forgetPwd(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    let data = params.data
    if (!data.mobile || !data.verifyCode || !data.password) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    Indicator.open()
    Vue.http.post(api.forget, { params: data }).then(response => {
      Indicator.close()
      if (!response.ok || response.status != "200") {
        errorHelper.showErrorMsg(1004);
        return false
      }
      if (typeof params.success == "function") {
        params.success(response.data)
      }
    }, response => {
      Indicator.close()
      errorHelper.showErrorMsg(1004);
    });
    //let userHelper = this
  },

  /**
   * 修改密码
   * [changePwd description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  changePwd(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    let data = params.data
    if (!data.verifyCode || !data.password) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    data.userId = this.info().id
    Indicator.open()
    Vue.http.post(api.change_pwd, { params: data }, {
      headers: {
        "TH-SESSIONAUTH": userHelper.token()
      }
    }).then(response => {
      Indicator.close()
      if (!response.ok || response.status != "200") {
        errorHelper.showErrorMsg(1004);
        return false
      }
      if (typeof params.success == "function") {
        params.success(response.data)
      }
    }, response => {
      Indicator.close()
      errorHelper.showErrorMsg(1004);
    });
  },

  setUserInfoForApp(userInfo) {
    storageHelper.setJson(userHelper.key, userInfo, "session");
    //storageHelper.setJson(this.key, userInfo)
    //let expireTime = new Date().getTime() + this.expire_time * 60 * 1000;
    //storageHelper.setJson(this.expire_time_key, expireTime);
  },

  /**
   * 用户头像
   *
   * [userImg description]
   * @return {[type]} [description]
   */
  getUserAvatar() {
    if (this.info().heading) {
      //return cdnHelper.getCdnImg(this.info().heading)
      return this.info().heading
    }
    //return require("../assets/img/avatar-default.png")
  },
  _getExpireTime() {
    return storageHelper.getJson(this.expire_time_key)
  }
}

export default userHelper

// userHelper.login({
//   data: {
//     "phone": "18309276656",
//     "password": "yangtao123"
//   },
//   success() {
//     console.log(userHelper.info)
//   }
// })