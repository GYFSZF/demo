/**
 * 常用方法
 */
const commonHelper = {
  // 格式化钱
  formatCurrency(num) {
    if (!num) {
      return 0;
    }
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3));
    if (cents != 0) {
      return (((sign) ? '' : '-') + num + '.' + cents);
    } else {
      return (((sign) ? '' : '-') + num);
    }
  },
  // 格式化钱
  formatCurrencys(num) {
    if (!num) {
      return 0;
    }
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
  },
  // 处理银行卡号只显示后四位星号
  blank(card) {
    var cardNum = card;
    return new Array(16).join('*') + cardNum.slice(12);
  },
  // 处理银行卡号只显示后四位点
  blanks(card) {
    var cardNum = card;
    return new Array(4).join('.') + cardNum.slice(12);
  },
  // 格式化时间--天
  getLocalTime(now, type) {
    var d = new Date(now);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (date < 10) {
      date = '0' + date;
    }
    if (!type) {
      return year + "-" + month + "-" + date
    } else {
      return year + "年" + month + "月" + date + '日'
    }
  },
  // 格式化时间--秒
  getLocalTimeSecond(now) {
    if (!now) {
      return ""
    }
    var d = new Date(now);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    if (month < 10) {
      month = '0' + month;
    }
    if (date < 10) {
      date = '0' + date;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  },
  getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
  // ProgressBar(obj1, obj2, obj3) {
  //   $(obj1).each(function() {
  //     var _this = $(this);
  //     var num = $(_this).find(obj2).text() + "%";
  //     setTimeout(function() {
  //       $(_this).find(obj3).css("width", num);
  //     }, 100);
  //   })
  // };
}

export default commonHelper