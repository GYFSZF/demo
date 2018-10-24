import { AppRouter } from 'Src/router'

import { api } from 'Src/global'

import storageHelper from 'Helper/storage.js'
import httpHelper from 'Helper/http.js'
import errorHelper from "Helper/error"
import cdnHelper from 'Helper/cdn.js'

import { Indicator } from 'mint-ui';

/**
 * 验证码相关
 */
const captchaHelper = {
  /**
   * 获取图片验证码
   * [getImgCaptcha description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getImgCaptcha(params) {
    Indicator.open()
    Vue.http.post(api.get_captcha_img, data, { emulateJSON: true }).then(response => {
      Indicator.close()
      if (!response.ok || response.status != "200") {
        errorHelper.showErrorMsg(1004);
        return false
      }
      let data = response.data
      if (data.code == 100 && data.result && data.result.key && data.result.value) {
        if (typeof params.success == "function") {
          params.success(data.result)
        }
      } else {
        if (data.msg) {
          errorHelper.showErrorMsg(data.msg);
        } else {
          errorHelper.showErrorMsg(1004);
        }
        return false
      }
    }, response => {
      Indicator.close()
      errorHelper.showErrorMsg(1004);
    });
  },
  /**
   * 检查图片验证码
   * [checkImgCaptcha description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  checkImgCaptcha(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    let data = params.data
    if (!data.key || !data.value) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    data.source = "H5"
    Indicator.open()
    Vue.http.post(api.check_captcha_img, data, { emulateJSON: true }).then(response => {
      Indicator.close()
      if (!response.ok || response.status != "200") {
        errorHelper.showErrorMsg(1004);
        return false
      }
      let data = response.data
      if (data.code == 100 && data.result) {
        if (typeof params.success == "function") {
          params.success(data.result)
        }
      } else {
        if (data.msg) {
          errorHelper.showErrorMsg(data.msg);
        } else {
          errorHelper.showErrorMsg(1004);
        }
        return false
      }
    }, response => {
      Indicator.close()
      errorHelper.showErrorMsg(1004);
    });
  },
  /**
   * 获取短信验证码(个人中心--忘记支付密码)
   * [getSmsCaptch description]
   * @return {[type]} [description]
   */
  getSmsCaptch(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1004);
      return false
    }
    let data = params.data
    if (!data.phone) {
      errorHelper.showErrorMsg(1004);
      return false
    }
    let options = {
      data: "",
      success(data) {
        if (typeof params.success == "function") {
          params.success(data)
        }
      }
    }
    httpHelper.post(api.getcode, options)
  },
  /**
   * 验证短信验证码
   * [checkSmsCaptcha description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  checkSmsCaptcha(params) {
    if (!params.data) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    let data = params.data
    if (!data.key || !data.value || !data.mobile) {
      errorHelper.showErrorMsg(1003);
      return false
    }
    data.source = "H5"
    Indicator.open()
    Vue.http.post(api.check_captcha_sms, data, { emulateJSON: true }).then(response => {
      Indicator.close()
      if (!response.ok || response.status != "200") {
        errorHelper.showErrorMsg(1004);
        return false
      }
      let data = response.data
      if (data.code == 100 && data.result) {
        if (typeof params.success == "function") {
          params.success(data.result)
        }
      } else {
        if (data.msg) {
          errorHelper.showErrorMsg(data.msg);
        } else {
          errorHelper.showErrorMsg(1004);
        }
        return false
      }
    }, response => {
      Indicator.close()
      errorHelper.showErrorMsg(1004);
    });
  }
}

export default captchaHelper
