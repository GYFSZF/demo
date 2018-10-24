import { payApi } from '../global'
import httpHelper from './http'
import errorHelper from "./error"

/**
 * 用户投资相关
 */
const investHelper = {
  prospective(data, callback) {
    if (!data.borrow_id || !data.money) {
      return false
    }
    let options = {
      data,
      needLogin: true,
      success(data) {
        if (typeof callback == "function") {
          callback(data)
        }
      }
    }
    httpHelper.post("/operator/core/advanAmt", options);
  },
}

export default investHelper