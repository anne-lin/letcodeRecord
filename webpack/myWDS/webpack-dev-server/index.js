const webpack = require("webpack");
const config = require("../webpack.config");
const Server = require("./lib/server/server")

const compiler = webpack(config);

const server = new Server(compiler);
server.listen(9090, "localhost", () => {
    console.log("服务9090已启用");
})