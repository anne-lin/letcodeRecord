const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index/index.js',
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
        ]
    },
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
        })
    ]
}