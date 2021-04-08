const path=require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode:"development",
  entry:"./src/index.js",
  output:{
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devServer: {
    hot:true,
    contentBase: path.join(__dirname, 'dist')
  },
  plugins:[
    new htmlWebpackPlugin({
      template:"./index.html",
      filename:"index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}