/**
 * 深合并对象
 * 不同于 Object.assign浅合并，这个是深合并
 * @example ({}, {a:1,b:{a:3,c:1}}, {b:{a:1}}) => {a:1,b:{a:1,c:1}}
 */
const deepAssign = (...args) => {
  const target = args.shift();
  const isObject = obj => typeof obj === 'object';
  if (!isObject(target)) {
    return target;
  }
  for (const obj of args) {
    for (const key of Object.keys(obj)) {
      if (isObject(obj[key])) {
        if (isObject(target[key])) {
          target[key] = deepAssign(target[key], obj[key]);
        } else {
          target[key] = obj[key];
        }
      } else {
        target[key] = obj[key];
      }
    }
  }
  return target;
};

/**
 * 将一个对像转成参数字符串
 * @param obj // 原始对像
 * @param isEncode 是否使用encodeURIComponent编码
 * @example ({a:1,b:2}) => &a=1&b=2
 */
export const objectToParam = (obj: object, isEncode = true) => {
  let ParamStr = '';
  for (let key of Object.keys(obj)) {
    ParamStr += `&${key}=${isEncode ? encodeURIComponent(obj[key]) : obj[key]}`;
  }
  return ParamStr;
};

/**
 * 将一个对像的所有值进行转码
 * @param obj
 * @example ({a: "我="}) => {a: "%E6%88%91%3D"}
 */
export const objectEncode = (obj: object) => {
  for (let key of Object.keys(obj)) {
    obj[key] = encodeURIComponent(obj[key]);
  }
  return obj;
};

/**
 * 参数操作方法集合
 */
export const param = {
  /**
   * 添加一个参数
   * @param url 原始url
   * @param obj 要添加的参数对象
   * @param isReplace 相同的参数是否要替换
   * @example ("http://www.baidu.com?a=1", { a: 2, c: 1 }) => "http://www.baidu.com?a=2&c=1"
   * @example ("http://www.baidu.com?a=1", { a: 2, c: 1 }, false) => "http://www.baidu.com?a=1&a=2&c=1"
   */
  add(url: string, obj: object, isReplace: boolean = true): string {
    let newParamStr = objectToParam(obj, true);
    const indexof = url.indexOf('?');
    // 如果url中没有参数
    if (indexof === -1) {
      return url + '?' + newParamStr.substring(1);
    } else {
      if (isReplace) {
        const oldParamObj = {};
        const oldParamArr = url.substring(indexof + 1).split('&');
        url = url.substring(indexof + 1, -1);
        for (var i = 0, len = oldParamArr.length; i < len; i++) {
          const item = oldParamArr[i].split('=');
          oldParamObj[item[0]] = item[1];
        }
        newParamStr = objectToParam(
          deepAssign(oldParamObj, objectEncode(obj)),
        ).substring(1);
      }
      return url + newParamStr;
    }
  },
  /**
   * 获取一个url中的某个参数的值
   * @param url
   * @param key
   * @example ("https://www.baidu.com/?tn=news", "tn") => "news"
   * @example ("https://www.baidu.com/?tn=%E6%88%91", "tn") => "我"
   */
  get(url: string, key: string): any {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i');
    const [, searchStr] = url.split('?');
    if (!searchStr) {
      return null;
    }
    const r = searchStr.match(reg);
    if (r !== null) {
      return decodeURIComponent(r[2]);
    }
    return null;
  },
  /**
   * 解析参数，生成一个参数对象
   * @param url
   * @example ("https://www.baidu.com/?tn=%E6%88%91") => {tn: "我"}
   */
  parse(url: string): object {
    const [, searchStr] = url.split('?');
    const obj = {};
    if (searchStr) {
      for (const str of searchStr.split('&')) {
        const [name, value] = str.split('=');
        obj[name] = decodeURIComponent(value);
      }
    }
    return obj;
  },
  del(url: string, key: string): string {
    const obj = this.parse(url);
    delete obj[key];
    return this.add(url, obj);
  },
};

export default param;
