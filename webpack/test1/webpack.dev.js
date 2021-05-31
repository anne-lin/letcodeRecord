const path = require('path');
const webpackCommonConfig = require("./webpack.common");
const { merge } = require("webpack-merge");


module.exports = merge(webpackCommonConfig,{
  mode: "development",  
  module: {
    rules:[{
      test:/\.css$/,
      use:["style-loader","css-loader"]
    },{
      test:/\.less$/,
      use:["style-loader","css-loader","less-loader"] 
    }]
  },
  devServer: {
    hot:true,
    contentBase: path.join(__dirname, 'dist'),
    //代理
    proxy: {
      //将本地/api/xxx代理到localhost:3000/api/xxx
      "/api":"http://localhost:3000"
    }
  },
});