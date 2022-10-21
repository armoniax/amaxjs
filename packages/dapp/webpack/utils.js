const os = require('os');
/**
 * 获取服务器ip
 */
function getNetworkIp() {
  let needHost = ''; // 打开的host
  try {
    // 获得网络接口列表
    const network = os.networkInterfaces();
    for (const dev in network) {
      const iface = network[dev];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          needHost = alias.address;
        }
      }
    }
  } catch (e) {
    needHost = 'localhost';
  }
  return needHost;
}

function getArgList() {
  let argvs;
  const res = {};
  // 下面的步骤就是获取命令行参数。
  try {
    argvs = JSON.parse(process.env.npm_config_argv).original;
  } catch (ex) {
    argvs = process.argv; // 返回命令脚本中各个参数所组成的数组
  }
  const index = argvs.findIndex(str => str.startsWith('--'));
  if (index < 0) {
    return res;
  }
  const argv = argvs.slice(index);
  for (const i in argv) {
    const key = argv[i].match(/--(\S*)=/)[1];
    const value = argv[i].split('=')[1];
    res[key] = value;
  }
  return res;
}
module.exports = {
  getNetworkIp: getNetworkIp,
  getArgList: getArgList,
};
