const path=require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode:"development",
  entry:"./src/index.js",
  output:{
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    library: "App",
    libraryTarget:"umd",
    libraryExport:"default"
  },
  module:{
    rules:[{
      test:/\.js$/,
      use:"babel-loader",
      exclude: /(node_modules|bower_components)/
    }
  ]},
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port:9000,
  },
  plugins:[
    new htmlWebpackPlugin({
      template:"./index.html",
      filename:"index.html",
      inject:"head"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}