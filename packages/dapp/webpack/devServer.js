/**
 * 服务器配置
 *
 */
const path = require('path');
const utils = require('./utils');

module.exports = {
  // 告诉服务器从哪里提供内容。
  contentBase: path.resolve(__dirname, 'dist'),
  // 文件改动触发页面重新加载，设为true主要是因为html等不在entry中的文件修改需要重新刷新页面。
  // 开启后，热替换会无效。修改css会导致页面刷新。
  // 如果是单页应用，建议关闭此项，如果html修改，手动刷新一下即可。
  watchContentBase: false,
  // 一切服务都启用gzip 压缩
  // 本地开发，如果开启会导致文件下载慢，因为有些大文件需要加密解密，这种算法占用很多时间
  compress: false,
  // 指定要监听请求的端口号
  port: 8080,
  // 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。
  proxy: {
    '/api/*': {
      target: 'https://www.nftest.cc', // 'https://www.nftest.cc',
      changeOrigin: true,
    },
  },
  // 提供在服务器内部的所有其他中间件之前执行自定义中间件的能力。这可用于定义自定义处理程序，例如：
  before() {
    console.clear();
  },
  // 提供在服务器内部的所有其他中间件之后执行自定义中间件的能力。
  after() {},
  // 应用程序启用内联模式(inline mode)
  inline: true,
  // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定如下：
  host: '0.0.0.0',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Method': 'POST,GET',
  },
  // 启用 webpack 的模块热替换特性：
  hot: true,
  // 在没有页面刷新的情况下启用热模块替换（请参阅）作为构建失败时的后备。
  // hotOnly: true,
  // 被视为索引文件的文件名
  index: 'index.html',
  // 启用 noInfo 后，诸如「启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏。错误和警告仍然会显示。
  noInfo: false,
  // 启动后打开浏览器
  open: false,
  // 将运行进度输出到控制台。
  progress: true,
  // 允许浏览器使用您的本地IP打开
  useLocalIp: true,
  // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖。
  overlay: {
    warnings: true,
    errors: true,
  },
  // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过传入以下启用：
  historyApiFallback: {
    rewrites: [],
  },
  // 检测文件设置
  watchOptions: {
    // 当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位：
    aggregateTimeout: 300,
    // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。
    poll: true,
    // 对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除一些巨大的文件夹，例如 node_modules：
    ignored: ['/node_modules', '/webpack', '/charting_library'],
  },
  // 自定义要显示的日志信息
  stats: require('./stats'),
};
