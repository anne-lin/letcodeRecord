const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const optimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode:"production",
  //单入口
  entry: './src/index.js',
  output: {    
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle[chunkHash:8].js',
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
      use:["style-loader","css-loader",{
        loader:"postcss-loader",
        options:{
          plugins:()=>{
            require("autoprefixer")({
              //browser:['last 2 version','>1%']  指定浏览器兼容的版本
            })
          }
        }
      }]
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
  plugins:[
    //压缩html
    new htmlWebpackPlugin({
      template:"./index.html",
      filename:"index.html",
      minify:{
        html5:true,
        collapseWhitespace:true, 
        preserveLineBreaks:false,
        minifyCSS:true,
        minifyJS:true,
        removeComments:false
      }
    }),
    //压缩css
    new optimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require("cssnano")
    }),
    new cleanWebpackPlugin()
  ] 
};