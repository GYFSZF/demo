import httpHelper from 'Helper/http.js'
import { api } from "Src/global"

/**
 * 活动
 */
const activeHelper = {
  getWinnerlist(id, callBack) {
    if (!id) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let options = {
      data: {
        activityCode: id
      },
      success(data) {
        callBack(data)
      }
    }
    httpHelper.post(api.getWinnerlist, options)
  },
  lottery(obj, callBack) {
    if (!obj.activityCode) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let options = {
      data: obj,
      needLogin: true,
      success(data) {
        callBack(data)
      }
    }
    httpHelper.post(api.lottery, options)
  },
  userWinnerlist(obj, callBack) {
    if (!obj) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let options = {
      data: {
        activityCode: obj.id
      },
      extParams: {
        page: obj.page,
        pageSize: obj.pageSize
      },
      needLogin: true,
      success(data) {
        callBack(data)
      }
    }
    httpHelper.post(api.userWinnerlist, options)
  },
  details(id, callBack) {
    if (!id) {
      errorHelper.showErrorMsg(1003);
      return false
    }

    let options = {
      errorHandle: false,
      dataHandle: false,
      success(data) {
        callBack(data)
      }
    }
    httpHelper.post(api.details + '?code=' + id, options)
  },
}

export default activeHelper