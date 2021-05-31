const optimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");
const webpackCommonConfig = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(webpackCommonConfig,{
  mode: "production", 
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
      // },{
      //   test: /\.less$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     "css-loader",
      //     "less-loader"
      //   ]
      // }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
     // filename:"css/mian.[contentHash:8].css"
    }),
    //压缩css
    new optimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require("cssnano")
    }),
    new cleanWebpackPlugin()
  ] 
});