module.exports = ctx => ({
  // ident: 'postcss',
  // parser: ctx.parser ? 'sugarss' : false,
  // plugins: () => [
  //   require('postcss-px2rem-exclude')({
  //     remUnit: 37.5,
  //     exclude: /node_modules/i,
  //   }),
  //   require('autoprefixer')(),
  //   require('cssnano')(),
  //   require('postcss-import')(),
  // ],
  parser: ctx.parser ? 'sugarss' : false,
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: {
    'postcss-import': {},
    autoprefixer: {},
    cssnano: ctx.env === 'production' ? {} : false,
  },
});
