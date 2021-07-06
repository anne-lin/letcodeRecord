"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 队列控制
// 100个文件上传，并行2个
function promiseIndex(index) {
  return Promise.resolve(index);
}

var arr = [];

for (var i = 0; i < 10; i++) {
  arr.push(promiseIndex(i));
}

arr.splice(3, 0, new Promise(function (resolve) {
  setTimeout(function () {
    resolve("aa");
  }, 0);
}));

var QueueUpload =
/*#__PURE__*/
function () {
  function QueueUpload(limit, arr) {
    _classCallCheck(this, QueueUpload);

    this.queue = arr;
    this.limit = limit;
    this.result = [];
    this.index = 0;

    while (this.index < limit) {
      this.upload(this.index++, arr[this.index - 1]);
    }
  }

  _createClass(QueueUpload, [{
    key: "upload",
    value: function upload(index, item) {
      var _this = this;

      item.then(function (res) {
        _this.result[index] = res;

        if (_this.index < _this.queue.length) {
          _this.upload(_this.index++, _this.queue[_this.index - 1]);
        }
      });
    }
  }]);

  return QueueUpload;
}();

var upload = new QueueUpload(3, arr);
setTimeout(function () {
  console.log(upload.result);
}, 500);