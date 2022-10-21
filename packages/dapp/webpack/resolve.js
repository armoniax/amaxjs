/**
 * 这些选项能设置模块如何被解析
 *
 */
const resolve = require('path').resolve;

module.exports = {
  // 自动解析确定的扩展
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  // 目录别名
  alias: {
    '@': resolve('./src'),
    'antd-mobile': 'antd-mobile/2x',
  },
};
