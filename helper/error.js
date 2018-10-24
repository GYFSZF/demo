import { AppRouter } from '../router'

import { error } from '../global'
import { Toast } from 'mint-ui';
import { MessageBox } from 'mint-ui'

//import platformHelper from "./platform"

const errorHelper = {
  /**
   * 显示错误信息
   *
   * [showErrorMsg description]
   *
   * @param  {[type]} code [description]
   * @param  {[type]} e    [description]
   * @return {[type]}      [description]
   */
  showErrorMsg(code, e, duration, className) {
    let msg = this.handleError(code)
    let showMsg = Toast({
      message: msg,
      duration: duration ? duration : 1000,
      className: className ? "app-error-msg " + className : "app-error-msg"
    })
    if (e) {
      throw e
    }
    return showMsg
  },

  /**
   * 弹出错误信息
   *
   * [alertError description]
   *
   * @param  {[type]} code [description]
   * @param  {[type]} e    [description]
   * @return {[type]}      [description]
   */
  alertError(code, e) {
    let msg = this.handleError(code)
    let message = MessageBox({
      title: '错误',
      message: msg,
      showCancelButton: false
    })
    if (e) {
      throw e
    }
    return message
  },
  error404(code, e) {
    // if (platformHelper.isApp()) {
    //   platformHelper.to404()
    //   return false
    // }
    AppRouter.replace({ name: "error" })
    //console.dir(AppRouter)
  },
  handleError(code) {
    if (error[code]) {
      return error[code]
    } else {
      return code
    }
  }
}

export default errorHelper