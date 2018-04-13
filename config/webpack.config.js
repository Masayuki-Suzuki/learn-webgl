require('babel-polyfill')

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SiteData = require('../assets/siteData')

const DEV = !process.argv.includes('--env.prod')

const publicPath = {
  cssJob: 'jobfind-pc/original/css/',
  jsJob: 'jobfind-pc/original/js/',
  cssTop: 'voice/top/css/',
  cssCmn: 'voice/css/',
  jsCmn: 'voice/js/'
}
const assetPath = {
  cssJob: '../assets/sass/jobfind/',
  jsJob: '../assets/js/jobfind/',
  cssTop: '../assets/sass/lp/',
  jsCmn: '../assets/js/lp/'
}
const entry = {
  [`${publicPath.jsJob}custom.js`]: path.join(__dirname, `${assetPath.jsJob}custom.js`),
  // [`${publicPath.jsCmn}app.js`]: path.join(__dirname, `${assetPath.jsCmn}app.js`),
  [`${publicPath.cssJob}topPage.css`]: path.join(__dirname, `${assetPath.cssJob}topPage.scss`),
  // [`${publicPath.cssJob}original.css`]: path.join(__dirname, `${assetPath.cssJob}original.scss`),
  [`${publicPath.cssJob}vendor/normalize.css`]: path.join(__dirname, `${assetPath.cssJob}vendor/normalize.scss`),
  // [`${publicPath.cssTop}style.css`]: path.join(__dirname, `${assetPath.cssTop}top/style.scss`),
  // [`${publicPath.cssCmn}style.css`]: path.join(__dirname, `${assetPath.cssTop}common/style.scss`)
}

const extractSass = new ExtractTextPlugin({
  filename: '[name]',
  allChunks: true
})
const extractTopPageHtml = new HtmlWebpackPlugin({
  filename: 'jobfind-pc/index.html',
  inject: false,
  template: './assets/pug/jobfind/index.pug',
})
// const extractInterviewTop = new HtmlWebpackPlugin({
//   filename: 'voice/index.html',
//   inject: false,
//   template: './assets/pug/lp/index.pug',
// })
// const extractInterview1 = new HtmlWebpackPlugin({
//   filename: 'voice/voice1/index.html',
//   inject: false,
//   template: './assets/pug/lp/voice1/index.pug',
// })
// const extractInterview2 = new HtmlWebpackPlugin({
//   filename: 'voice/voice2/index.html',
//   inject: false,
//   template: './assets/pug/lp/voice2/index.pug',
// })
// const extractInterview3 = new HtmlWebpackPlugin({
//   filename: 'voice/voice3/index.html',
//   inject: false,
//   template: './assets/pug/lp/voice3/index.pug',
// })
// const extractInterview4 = new HtmlWebpackPlugin({
//   filename: 'voice/voice4/index.html',
//   inject: false,
//   template: './assets/pug/lp/voice4/index.pug',
// })
// const extractInterview5 = new HtmlWebpackPlugin({
//   filename: 'voice/voice5/index.html',
//   inject: false,
//   template: './assets/pug/lp/voice5/index.pug',
// })
// const extractInterview6 = new HtmlWebpackPlugin({
//   filename: 'voice/voice6/index.html',
//   inject: false,
//   template: './assets/pug/lp/voice6/index.pug',
// })

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.LoaderOptionsPlugin({ debug: true }),
  extractSass,
  extractTopPageHtml,
  // extractInterviewTop,
  // extractInterview1,
  // extractInterview2,
  // extractInterview3,
  // extractInterview4,
  // extractInterview5,
  // extractInterview6,
]

if (!DEV) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: false, warnings: false } }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
  )
}

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, '../www/'),
    filename: '[name]',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)?$/,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
          },
          {
            test: /\.(sass|scss)?$/,
            exclude: /node_modules/,
            use: extractSass.extract({
              use: [
                {
                  loader: 'css-loader',
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: (loader) => [require('autoprefixer')()]
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    outputStyle: 'expanded',
                    file: '[name].css'
                  }
                },
              ],
            }),
          },
          {
            test: /\.pug$/,
            exclude: /(node_modules|partials|components|contents)/,
            use: [
              {
                loader: "raw-loader",
              },
              {
                loader: "pug-html-loader",
                options: {
                  pretty: true,
                  data: SiteData
                }
              }
            ]
          },
          {
            test: /\.(jpg|jpeg|png|gif|svg)$/,
            use: {
              loader: 'file-loader?name=/jobfind-pc/original/images/[name].[ext]'
            }
          },
          {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            loader: 'file-loader?name=/jobfind-pc/original/fonts/[name].[ext]'
          }
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.eot'],
  },
  devtool: DEV ? 'source-map' : false,
  plugins,
}
