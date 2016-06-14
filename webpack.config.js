var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var values = require('postcss-modules-values');
var autoprefixer = require('autoprefixer')({ browsers: [' b', 'ie 6-8', 'Firefox > 20','Chrome > 30', 'Safari > 5']  });

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index.js'
  ],
  output: {
    path: './static',
    filename: 'bundle.js',
    publicPath: './'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('index.css', {
      allChunks: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-decorators-legacy'],
          presets: [ 'react', 'es2015', 'stage-2' ]
        }
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png)$/,
        loaders: [ 'url?limit=81920' ]
      },
      {
        test: /\.(ttf|eot|otf|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file'
      },
      // {test: /\.ttf$/, loader: 'url?limit=10240&mimetype=application/x-font-ttf'},
      // {test: /\.eot$/, loader: 'url?limit=10240&mimetype=application/vnd.ms-fontobject'},
      // {test: /\.otf$/, loader: 'url?limit=10240&mimetype=application/font-otf'}
    ]
  },
  postcss: [
    values,
    autoprefixer
  ],
  // node: {
  //   net: "empty",
  //   tls: "empty",
  //   fs: "empty",
  //   console: "empty"
  // },
  // target: "node"
}
