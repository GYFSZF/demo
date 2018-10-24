import Vue from 'vue'
import { AppRouter } from '../router'
import { payApi } from '../global'
import userHelper from './user'
import httpHelper from './http'
import errorHelper from "./error"

/**
 * 用户测评相关
 */
const appraisalHelper = {
  getQuestion(callBack) {
    userHelper.isLogin({
      success() {
        httpHelper.post("questionnaire", {
          needLogin: true,
          success: callBack,
          fail() {
            AppRouter.replace({ name: "personal" })
          }
        });
      }
    }, true);
  },
  submit(data, callBack) {
    httpHelper.post("questionnaire_submit", {
      needLogin: true,
      success: callBack,
      data,
    });
  },
  getResult(callBack) {
    userHelper.isLogin({
      success() {
        httpHelper.post("appraisal_result", {
          needLogin: true,
          success: callBack,
          fail(data) {
            AppRouter.replace({ name: "personal" })
          }
        });
      }
    });
  }
}

export default appraisalHelper