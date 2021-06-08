"use strict";

//传入一个带promise方法的数组，数组内的方法全部执行成功才返回事件
Promise.prototype.all = function (list) {
  if (!Array.isArray(list)) {
    throw Error("arguments must be array");
    return;
  }

  return new Promise(function (resolve, reject) {
    var len = list.length,
        resArr = [],
        count = 0;

    var _loop = function _loop(i) {
      //使用Promise.resolve是为了预防部分数组元素不是promise对象
      Promise.resolve(list[i]).then(function (data) {
        //使用resArr[i]赋值是因为数据的回调顺序可能不一样，为保证返回值顺序一致
        resArr[i] = data;
        count++;

        if (count == len) {
          resolve(resArr);
        }
      })["catch"](function (e) {
        reject(e);
      });
    };

    for (var i = 0; i < list.length; i++) {
      _loop(i);
    }
  });
}; //传入一个带promise方法的数组，数组内的方法全部执行（不管失败与否）返回事件


Promise.prototype.allSetter = function (list) {
  if (!Array.isArray(list)) {
    throw Error("arguments must be array");
    return;
  }

  return new Promise(function (resolve, reject) {
    var len = list.length,
        resArr = [];

    var _loop2 = function _loop2(i) {
      list[i].then(function (data) {
        resArr[i] = data;
      }, function (e) {
        resArr[i] = e;
      })["finally"](function () {
        if (resArr.length == len) {
          resolve(resArr);
        }
      });
    };

    for (var i = 0; i < list.length; i++) {
      _loop2(i);
    }
  });
};