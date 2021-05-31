"use strict";

var first = function first() {
  return new Promise(function (resolve, reject) {
    console.log(3);
    resolve(2); //

    var p = new Promise(function (resolve, reject) {
      console.log(7);
      setTimeout(function () {
        console.log(5);
        resolve(6);
      }, 0);
      resolve(1);
    });
    p.then(function (arg) {
      console.log(arg);
    });
  });
};

first().then(function (arg) {
  console.log(arg);
});
console.log(4); //3,7,4,1,2,5