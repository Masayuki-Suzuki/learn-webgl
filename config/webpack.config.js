require('babel-polyfill')

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SiteData = require('../assets/siteData')

const DEV = !process.argv.includes('--env.prod')

const publicPath = {
  cssMain: 'dist/css/',
  jsMain: 'dist/js/',
}
const assetPath = {
  cssMain: '../assets/sass/',
  jsMain: '../assets/js/',
}
const entry = {
  [`${publicPath.jsMain}app.js`]: path.join(__dirname, `${assetPath.jsMain}app.js`),
  [`${publicPath.cssMain}topPage.css`]: path.join(__dirname, `${assetPath.cssMain}style.scss`),
  [`${publicPath.cssMain}vendor/normalize.css`]: path.join(__dirname, `${assetPath.cssMain}vendor/normalize.scss`),
}

const extractSass = new ExtractTextPlugin({
  filename: '[name]',
  allChunks: true
})
const extractIndexHtml = new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: false,
  template: './assets/pug/index.pug',
})

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.LoaderOptionsPlugin({ debug: true }),
  extractSass,
  extractIndexHtml,
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
