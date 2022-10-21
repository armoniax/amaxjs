/**
 * 轮询操作
 * 如果add方法是同步方法，则直接执行
 * 如果是异步方法，会等上一个执行完在执行下一次
 * 如果异步方法连续失败3次，中止执行
 */

export type TasksType = {
  [key: string]: (...args: Array<any>) => void | Promise<any>;
};
export type StatusType = {
  [key: string]: {
    count: number; // 连续错误次数
    status: 'pending' | 'fulfilled' | 'rejected';
  };
};

class Polling {
  constructor() {
    // 任务对像
    this.tasks = {};
    this.status = {};
  }

  tasks: TasksType;
  status: StatusType;
  timer: any;

  setStatus(key, status) {
    let obj = this.status[key];
    if (!obj) {
      obj = {
        count: 0,
        status,
      };
    }
    obj.status = status;
    if (status === 'rejected') {
      obj.count += 1;
    } else if (status === 'fulfilled') {
      // 成功一次就清零
      obj.count = 0;
    }
    if (obj.count >= 3) {
      this.del(key);
    }
    this.status[key] = obj;
  }

  run() {
    // 1秒轮询一次
    this.timer = setInterval(() => {
      for (const [key, fn] of Object.entries(this.tasks)) {
        if (['AsyncFunction'].includes(fn.constructor.name)) {
          // 如果上一个异步方法还在执行，则本次不执行
          if (this.status[key]) {
            if (this.status[key].status === 'pending') {
              return;
            }
          }
          // 异步方法
          this.setStatus(key, 'pending');
          fn()
            ?.then(() => {
              this.setStatus(key, 'fulfilled');
            })
            .catch(e => {
              this.setStatus(key, 'rejected');
            });
        } else {
          // 同步方法
          fn();
        }
      }
    }, 6000);
  }
  add(key: string, fn: (...args: Array<any>) => void, ...args: Array<any>) {
    if (this.tasks[key]) {
      console.error(`[polling]: key ${key} 已经存在`);
    } else {
      if (typeof fn === 'function') {
        if (args.length) {
          this.tasks[key] = fn.bind(null, ...args);
        } else {
          this.tasks[key] = fn;
        }
      } else {
        console.error(`[polling]: ${fn} 不是一个函数`);
      }
    }
  }
  del(key) {
    return delete this.tasks[key];
  }
  close() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export default new Polling();
