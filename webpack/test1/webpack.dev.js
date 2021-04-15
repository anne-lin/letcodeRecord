const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode:"development",
  //单入口
  entry: './src/index.js',
  output: {    
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library:"Test1",
    libraryTarget:"umd",
    libraryExport:"default"
  },
  //多入口 
  /* entry:{
    "app":"./src/index.js",
    "other":"./src/test.js"
  },
  output:{
    path:path.resolve(__dirname, 'dist'),
    filename:"[name].min.js"
  } */
  module:{
    rules:[{
      test:/\.js$/,
      use:"babel-loader"
    },{
      test:/\.css$/,
      use:["style-loader","css-loader"]
    },{
      test:/\.less$/,
      use:["style-loader","css-loader","less-loader"] 
    }/* ,{
      test:/\.(png|svg|jpg|gif|jpeg)$/,
      use:["file-loader"]
    } */
    ,{
      test:/\.(png|svg|jpg|gif|jpeg)$/,
      use:[{
        loader:"url-loader",
        options:{
          //如果图片的大小小于10k,则自动转为base64的编码
          limit:10240
        }
      }]     
    } 
  ]},
  devServer: {
    hot:true,
    contentBase: path.join(__dirname, 'dist')
  },
  plugins:[
    new htmlWebpackPlugin({
      template:"./index.html",
      filename:"index.html"
    }),
  ] 
};