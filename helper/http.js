import axios from 'axios'
import { api as apiMap, domain } from "Src/global"

import errorHelper from "./error"

import userHelper from "Helper/user"
import platformHelper from './platform'

import { Indicator } from 'mint-ui';

axios.defaults.baseURL = domain

/**
 * http请求相关
 */
const httpHelper = {
  defaultOptions: {
    metaSource: "etiaolong",
    metaVersion: "1.2",
    metaType: "json",
    metaSourceType: "mobile",
    platform: "h5",
    needLogin: false,
    errorHandle: true,
    dataHandle: true,
    responseHandle: true,
    showLoading: true,
  },
  get(api, options) {
    if (!options) {
      options = {}
    }
    options.api = api
    options.method = "get"
    this.handle(options)
  },
  post(api, options) {
    if (!options) {
      options = {}
    }
    options.api = api
    options.method = "post"
    this.handle(options)
  },
  /**
   * 处理请求参数
   * @param  {object} options
   * {
   *   api 请求的api名称或者url地址
   *   method  发起请求动作
   *   data  发起请求附带的参数data
   *   extParams  其他参数
   *   needLogin 是否需要登入即请求是否需要带上cookie或者相关标识
   *   success 请求成功后的回调方法
   *   fail  请求失败的回调方法
   *   metaSource 请求参数中的meta
   *   metaVersion 请求参数中的meta
   *   metaType 请求参数中的meta
   *   platform 请求参数中的平台
   *   errorHandle 默认错误处理是否开启
   *   dataHandle  默认数据处理是否开启
   *   responseHandle 默认相应处理开启
   *   extOptions  axios相关的其他参数，比如header之类的
   *   showLoading 是否显示加载
   * }
   * @return {}         [description]
   */
  handle(options) {
    options = Object.assign({}, this.defaultOptions, options)
    let httpOptions = {
      url: this.getUrlWithApi(options.api),
      method: options.method,
      data: options.dataHandle ? this.handleData(options) : options.data
    }

    if (options.extOptions) {
      httpOptions = Object.assign(httpOptions, options.extOptions)
    }

    if (options.needLogin) {
      httpOptions.withCredentials = true
    }

    let handleOptions = {
      success: options.success ? options.success : false,
      fail: options.fail ? options.fail : false,
      errorHandle: options.errorHandle ? true : false,
      responseHandle: options.responseHandle ? true : false
    }
    if (options.showLoading) {
      Indicator.open()
    }
    axios(httpOptions)
      .then(function(response) {
        if (options.showLoading) {
          Indicator.close()
        }
        httpHelper.handleResponse(response, handleOptions)
      })
      .catch(function(error) {
        if (options.showLoading) {
          Indicator.close()
        }
        if (typeof options.fail == "function") {
          options.fail()
        }
        if (!options.errorHandle) {
          return false
        }
        console.log(error);
        httpHelper.handleError()
      })
  },
  getUrlWithApi(api) {
    return apiMap[api] ? apiMap[api] : api
  },
  handleData(options) {
    let params = {
      meta: {
        source: options.metaSource,
        version: options.metaVersion,
        type: options.metaType,
        sourceType: options.metaSourceType
      },
      platform: options.platform,
      data: options.data
    }
    if (options.extParams) {
      params = Object.assign(params, options.extParams)
    }
    return params
  },
  handleResponse(response, options) {
    let data = response.data
    if (!options.responseHandle) {
      if (typeof options.success == "function") {
        options.success(data)
      }
      return
    }
    if (data.code == 0) {
      if (typeof options.success == "function") {
        options.success(data.data)
      }
    } else {
      if (data.code == 5001) {
        if (platformHelper.isApp()) {
          platformHelper.callLogin({ "action": 'APP' })
          return false
        }
        this.handleError("登录已过期，请重新登录")
        userHelper.logOut(true)
        return false
      }
      if (options.errorHandle) {
        this.handleError(data.message)
      }
      if (typeof options.fail == "function") {
        options.fail(data)
      }
    }
  },
  handleError(msg) {
    if (msg) {
      errorHelper.showErrorMsg(msg)
    } else {
      errorHelper.showErrorMsg(1004)
    }
  }
}

export default httpHelper