import { cdnDomain } from "../global"
/**
 * 图片路径相关
 */
const cdnHelper = {
  getCdnImg(file, w, h) {
    let url = cdnDomain + file
    if (w) {
      url += "?imageView2/1/w/" + w
    }
    if (h) {
      url += "/h/" + h
    }
    return url
  }
}

export default cdnHelper
