/**
 * cookie相关操作
 */
// 把对像转成cookie字符串
export const parse = (obj) => {
  let str = "";
  for (let [key, value] of Object.entries(obj)) {
    str += `${key}=${value};`;
  }
  return str;
};
export const cookie = {
  //设置cookie
  set: function (name, value, days) {
    var domain, domainParts, date, expires, host;

    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    else {
      expires = "";
    }

    host = window.location.host;
    // if (host.split('.').length === 1) {
    document.cookie = name + "=" + value + expires + "; path=/";
    // } else {
    domainParts = host.split('.');
    domainParts.shift();
    domain = '.' + domainParts.join('.');
    document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
    // }
  },
  //获取cookie
  get: function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return unescape(c.substring(name.length, c.length));
      }
    }
    return "";
  },
  //删除cookie
  remove: function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.get(name);
    if (cval !== null) {
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
      const host = window.location.host;
      const domainParts = host.split('.');
      domainParts.shift();
      const domain = '.' + domainParts.join('.');
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/; domain=" + domain;
    }
  }
};
export default {
  parse,
  cookie
};
