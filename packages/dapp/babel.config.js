module.exports = api => {
  api.cache(true);
  // 开发环境
  const modeDev = process.env.NODE_ENV === 'development';
  return {
    presets: [
      [
        'minify',
        {
          // 移除打console
          removeConsole: !modeDev,
          // 移除debugger
          removeDebugger: !modeDev,
          builtIns: false,
        },
      ],
      '@babel/preset-env',
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',

      [
        '@babel/plugin-transform-runtime',
        {
          absoluteRuntime: false,
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false,
        },
      ],
      ['import', { libraryName: 'antd', style: 'css' }],
    ],
  };
};
