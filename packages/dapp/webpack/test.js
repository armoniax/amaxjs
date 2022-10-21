/**
 * 测试环境
 * 不同与其它环境的配置
 */
const merge = require('webpack-merge');
const production = require('./production');

module.exports = merge(production, {
  output: {
    publicPath: '/',
  },
});
