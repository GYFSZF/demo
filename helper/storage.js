import errorHelper from "./error"

const storageHelper = {
  setJson(key, obj, type) {
    try {
      if (type && type == "session") {
        sessionStorage[key] = JSON.stringify(obj);
      } else {
        localStorage[key] = JSON.stringify(obj);
      }
    } catch (e) {
      errorHelper.alertError(1001, e)
    }
  },
  getJson(key, type) {
    try {
      if (type && type == "session") {
        if (!sessionStorage[key]) {
          return false
        }
        return JSON.parse(sessionStorage[key])
      } else {
        if (!localStorage[key]) {
          return false
        }
        return JSON.parse(localStorage[key])
      }
    } catch (e) {
      errorHelper.alertError(1001, e)
    }
  },
}

export default storageHelper