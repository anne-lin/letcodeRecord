const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const optimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const glob = require("glob");

const setMPA = ()=>{
  const entry={};
  const htmlWebpackPlugins=[];
  const entryFiles=glob.sync(path.join(__dirname,"./src/*/index.js"))

  Object.keys(entryFiles).map(index=>{
    console.log(entryFiles[index]);
    const match=entryFiles[index].match(/src\/(.*)\/index\.js/); 
    const pageName = match && match[1];
    entry[pageName]=entryFiles[index];
    htmlWebpackPlugins.push(new htmlWebpackPlugin({
      template:path.join(__dirname,`./src/${pageName}/index.html`),
      filename:`${pageName}.html`,
      chunks:[pageName],
      inject:true,
      minify:{
        html5:true,
        collapseWhitespace:true, 
        preserveLineBreaks:false,
        minifyCSS:true,
        minifyJS:true,
        removeComments:false
      }
    }))
  })
  return {
    entry,
    htmlWebpackPlugins
  }
}
const {entry,htmlWebpackPlugins}=setMPA()
//多页面模块配置
module.exports = {
  mode:"production",
  entry: entry,
  output: {    
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle[chunkHash:8].js'
  },
  module:{},
  plugins:[
    //压缩css
    new optimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require("cssnano")
    }),
    new cleanWebpackPlugin()
  ].concat(htmlWebpackPlugins)
};