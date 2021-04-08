"use strict";

var webpack = require("webpack");

var config = require("../webpack.config");

var Server = require("./lib/server/server");

var compiler = webpack(config);
var server = new Server(compiler);
server.listen(9090, "localhost", function () {
  console.log("服务9090已启用");
});