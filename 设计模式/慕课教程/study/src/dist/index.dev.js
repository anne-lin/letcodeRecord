"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _list = _interopRequireDefault(require("./demo/list"));

var _shoppingCart = _interopRequireDefault(require("./demo/shoppingCart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var App =
/*#__PURE__*/
function () {
  function App(el) {
    _classCallCheck(this, App);

    this.el = $("#" + el);
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      this.initShoppingCart();
      this.initList();
    }
  }, {
    key: "initShoppingCart",
    value: function initShoppingCart() {
      var shoppingCart = new _shoppingCart["default"](app);
      shoppingCart.init();
    }
  }, {
    key: "initList",
    value: function initList() {
      var list = new _list["default"](app);
      list.init();
    }
  }]);

  return App;
}();

var _default = App;
exports["default"] = _default;