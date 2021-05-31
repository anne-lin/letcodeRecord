const path=require("path");
const webpack = require("webpack");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode:"development",
  entry: {
    "index":"./src/index.js",
    "test":"./src/test.js"
  },
  output:{
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    // library: "App",
    // libraryTarget:"umd",
    // libraryExport:"default"
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        modules: {
          chunks: "all",//引入裤的类型，分为异步（async）,同步（initial）,和所有（all）
          name: "modules",//chunk名
          //priority: 1,//抽离权限，权限更好更优先抽离，
         // minSize: 0, //抽离文件大小限制：如果是太小的文件，可以设置不抽离，减少带宽
         // minChunk:1 //抽离的代码被使用的最少次数
        },
        //常用于抽离第三方公共模块
        // vendor: {
        //   chunks: "all",//引入裤的类型，分为异步（async）,同步（initial）,和所有（all）
        //   name: "vendor",//chunk名
        //   priority: 1,//抽离权限，权限更好更优先抽离，
        //   test: /node_modules/ //抽离的文件目录
        // }
      }
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      template:"./test.html",
      filename: "test.html",
      chunks:["test","modules"],
      inject:"body"
    }),
    new htmlWebpackPlugin({
      template:"./index.html",
      filename: "index.html",
      chunks:["index"],
      inject:"head"
    }),    
    new webpack.HotModuleReplacementPlugin(),
    new cleanWebpackPlugin()
  ]
}