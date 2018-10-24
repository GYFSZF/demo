/**
 * 翻页相关helper
 */
const pagingHelper = {

  getDefaultModel() {
    return {
      list: {
        default: [],
        mergeType: "append"
      },
      count: {
        default: 0
      },
    }
  },

  page: 1,
  pageSize: 10,
  total: 0,

  init() {
    this.page = 1
    this.pageSize = 10
  },

  canLoadMore() {
    if (this.page == 1) {
      return true
    }
    if (this.total > this.pageSize * (this.page - 1)) {
      return true
    }
    return false
  },

  paging() {
    if (!this.canLoadMore()) {
      return false
    }

    let data = {
      page: this.page,
      pageSize: this.pageSize,
    }

    this.page++;
    return data
  }
}

export default pagingHelper