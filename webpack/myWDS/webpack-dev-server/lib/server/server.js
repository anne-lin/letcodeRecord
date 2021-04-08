const express = require("express");
const http = require("http");

class Server{
    constructor(compiler) {
        this.compiler = compiler;
        this.setupApp();
        this.createServer();
    }
    setupApp() {
        this.app = express();
    }
    createServer() {
        this.server = http.createServer(this.app);
    }
    listen(port, host, cb) {
        this.server.listen(port, host, cb);
    }
}
module.exports=Server