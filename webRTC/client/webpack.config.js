const path = require("path");

module.exports = (env,argv)=>{
  const mode = argv.mode;
  console.log("mode:",mode);

  let config={
    mode,
    entry:"./js/index.js", 
    output:{
      /* library: "qnrtc",
      libraryTarget:"umd",
      libraryExport:"default", */
      path:path.resolve(__dirname,"dist"),
      filename:"client.min.js"
    },
    module:{
      rules:[{
        test:/\.js$/,
        exclude: /(node_modules|bower_components)/,
        use:"babel-loader"
      }]
    },
    devServer:{
      //contentBase:path.join(__dirname,"dist"),
      compress:true,
      port:9093,
      https:true,
      host:"10.130.15.34"
    }
  }
  if(mode == "development"){
    config.devtool = "source-map";
  }
  return config;
}