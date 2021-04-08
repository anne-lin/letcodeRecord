"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var express = require("express");

var http = require("http");

var Server =
/*#__PURE__*/
function () {
  function Server(compiler) {
    _classCallCheck(this, Server);

    this.compiler = compiler;
    this.setupApp();
    this.createServer();
  }

  _createClass(Server, [{
    key: "setupApp",
    value: function setupApp() {
      this.app = express();
    }
  }, {
    key: "createServer",
    value: function createServer() {
      this.server = http.createServer(this.app);
    }
  }, {
    key: "listen",
    value: function listen(port, host, cb) {
      this.server.listen(port, host, cb);
    }
  }]);

  return Server;
}();

module.exports = Server;