/*
  用例：类似jquery的on off方法，可以带命名空间

  trigger("click", {}) //正常用法
  on("click", (data)=>{})

  trigger("click",{}) //能触发下面两个
  on("click.a", (data)=>{})
  on("click", (data)=>{})

  off("click") //删除所有click
  off("click.a") //删除a click

  //可以链式写
  on("click", (data)=>{}).trigger("click", {})

  //还可以这样用
  on("data", "123123");
  trigger("data").data; //"123123"
*/

interface eventBus {
  index: number;
  events: object;
}
class eventBus {
  constructor() {
    this.index = 0;
    this.events = {
      // 存放格式
      // "click": {
      //   0: fn,
      //   "a": fn
      // }
    };
    this.trigger = this.trigger.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }
  trigger(event, data?) {
    const [key, name] = event.split('.');

    for (const k of Object.keys(this.events)) {
      if (k === key && this.events[k]) {
        const evts = this.events[k];
        for (const n of Object.keys(evts)) {
          if (name) {
            if (n == name) {
              if (evts[n] instanceof Function) {
                evts[n].call(this, data);
              } else {
                this[key] = evts[n];
              }
            }
          } else {
            if (evts[n] instanceof Function) {
              evts[n].call(this, data);
            } else {
              this[key] = evts[n];
            }
          }
        }
      }
    }
    return this;
  }
  on(event, fn) {
    const [key, name] = event.split('.');

    // 不存在则新建一个空白对象存放
    if (!this.events[key]) {
      this.events[key] = {};
    }
    // 如果有[key.name]name属性
    if (name) {
      this.events[key][name] = fn;
    } else {
      this.events[key][this.index++] = fn;
    }

    return this;
  }
  off(keys) {
    const keyArr = keys.split(' ');
    const len = keyArr.length;

    const _off = keyStr => {
      const [key, name] = keyStr.split('.');
      if (key) {
        for (const k in this.events) {
          if (k === key) {
            if (name && this.events[key]) {
              for (const n in this.events[key]) {
                if (n === name) {
                  delete this.events[key][name];
                }
              }
            } else {
              delete this.events[key];
            }
          }
        }
      } else if (typeof key === 'undefined') {
        this.events = {};
      }
    };
    for (let i = 0; i < len; i++) {
      _off.call(this, keyArr[i]);
    }
    return this;
  }
}

export default new eventBus();
