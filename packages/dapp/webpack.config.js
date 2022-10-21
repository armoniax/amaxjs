const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const utils = require('./webpack/utils');

// 开发环境
const isDev = process.env.NODE_ENV === 'development';

const sassLoader = {
  loader: 'sass-loader',
  options: {
    data: `@import 'src/styles/variable.scss';`,
  },
};

module.exports = merge(
  {
    entry: {
      index: path.resolve(__dirname, 'src/index.tsx'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    // mini-css-extract-plugin
    // 提取到一个文件中
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        minSize: 3000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          // vendors: {
          //   name: 'chunks-vendors',
          //   test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-redux|redux|web3|swiper|moment|ethereumjs-util|eth-sig-util|eth-crypto|dva-core)[\\/]/,
          //   minChunks: 1,
          //   priority: 20,
          // },
          // ui: {
          //   name: 'chunks-ui',
          //   test: /[\\/]node_modules[\\/](antd|antd\-mobile|bignumber\.js|axios|dva-loading)[\\/]/,
          //   minChunks: 1,
          //   priority: 15,
          // },
          styles: {
            name: 'styles',
            test: /\.(scss|css)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader',
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          exclude: [path.resolve(__dirname, 'node_modules')],
        },
        { parser: { System: false } },
        {
          test: /\.jsx?$/,
          exclude: [path.resolve(__dirname, 'node_modules')],
          loader: 'babel-loader',
        },
        {
          test: /\.tsx?$/,
          exclude: [path.resolve(__dirname, 'node_modules')],
          loader: 'ts-loader',
          options: {
            // 指定特定的ts编译配置，为了区分脚本的ts配置
            // configFile: path.resolve(__dirname, "./tsconfig.json"),
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory([
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'lib',
                    style: 'css',
                  },
                ]),
              ],
            }),
            compilerOptions: {
              module: 'es2015',
            },
          },
        },

        {
          test: /\.(scss|css)$/,
          use: [
            isDev
              ? 'style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: process.env.NODE_ENV === 'development',
                    reloadAll: true,
                  },
                },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: /^(?!.*node_modules\/antd)/i,
                  localIdentName: isDev
                    ? '[path][name]__[local]'
                    : '[hash:base64:3]',
                },
              },
            },
            {
              loader: 'px2rem-loader',
              options: {
                remUni: 75,
                remPrecision: 8,
              },
            },
            'postcss-loader',
            sassLoader,
          ],
        },
        {
          test: /\.svg$/,
          include: [path.resolve(__dirname, `src/assets/svgs`)],
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                // esModule: false,
                // extract: true,
                symbolId: 'icon-[name]', // filePath => path.basename(filePath)
                // runtimeCompat: true
              },
            },
            'svgo-loader',
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          exclude: [path.resolve(__dirname, `src/assets/svgs`)],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './',
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.(gif|png|ico|jpe?g|svg)$/i,
          // 排除自身的svg
          // 排除自身外的assets_XXX目录，不然其它app的assets依旧会被打包
          exclude: path.resolve(__dirname, `src/assets/svgs`),
          use: [
            {
              loader: 'file-loader',
              options: {
                name(resourcePath, resourceQuery) {
                  if (process.env.NODE_ENV === 'development') {
                    return '[path][name].[ext]';
                  }

                  return '[contenthash].[ext]';
                },
                outputPath: './',
              },
            },
            // 图片压缩
            // {
            //   loader: 'image-webpack-loader',
            //   options: {
            //     mozjpeg: {
            //       progressive: true,
            //       quality: 65,
            //     },
            //     optipng: {
            //       enabled: false,
            //     },
            //     pngquant: {
            //       quality: [0.65, 0.9],
            //       speed: 4,
            //     },
            //     gifsicle: {
            //       interlaced: false,
            //     },
            //   },
            // },
          ],
        },
      ],
    },
    resolve: require('./webpack/resolve'),
    plugins: [
      new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
      // 处理HTML
      new HtmlWebpackPlugin({
        filename: 'index.html',
        hash: isDev,
        template: path.resolve(__dirname, 'src/index.hbs'),
        favicon: path.resolve(__dirname, 'src/assets/images/favicon.ico'),
      }),
      // 设置环境变量信息
      new webpack.DefinePlugin({
        'process.env': {
          BUILD_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new ScriptExtHtmlWebpackPlugin({
        inline: /runtime~.+\.js$/,
      }),
      // new HardSourceWebpackPlugin(),
    ],
    devtool: isDev ? 'source-map' : false,
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    //   axios: 'axios',
    //   'react-router-dom': 'ReactRouterDOM',
    //   'js-cookie': 'Cookies',
    // },
  },
  /**
   * 跟据环境加载不同配置
   * production 生产环境
   * development 开发环境
   */
  require(path.resolve('webpack', process.env.NODE_ENV)),
);
