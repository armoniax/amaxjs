/**
 * 开发环境独有配置
 * 不同与其它环境的配置
 */
const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const argv = require('yargs').argv;
const utils = require('./utils');

module.exports = {
  // 环境变量
  mode: 'development',
  output: {
    publicPath: `/`,
  },
  // 服务器配置
  devServer: require('./devServer'),
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 分析工具 需要时开启
    // new BundleAnalyzerPlugin(),
  ],
};
