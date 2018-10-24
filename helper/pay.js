import Vue from 'vue'

import { payApi } from '../global'
import userHelper from './user'
import errorHelper from "./error"

/**
 * 支付相关
 */
const payHelper = {
  alipay(params) {

  },
  wxpay(params) {
    if (!params.orderCodes || !params.totalPrice) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let userInfo = userHelper.info()
    if (!userInfo) {
      errorHelper.showErrorMsg(2008);
      return false
    }
    let userId = userInfo.id
    let url = payApi[`wxpay`] + userId

    Vue.http.post(url, params).then(response => {
      if (!response.ok || response.status != "200") {
        errorHelper.showErrorMsg(1004);
        return false
      }
      let data = response.data
      if (data.code == 100 && data.result) {
        window.location.href = data.result
      } else {
        errorHelper.showErrorMsg(data.msg);
        //errorHelper.error404(1000);
        return false
      }
    }, response => {
      errorHelper.showErrorMsg(1004);
      return false
    });
  }
}

export default payHelper
