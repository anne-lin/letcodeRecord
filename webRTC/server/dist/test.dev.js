"use strict";

var a = {
  name: "haha"
},
    b = {
  name: "enen"
};

function swap(x, y) {
  x.age = "18";
  var _ref = [y, x];
  x = _ref[0];
  y = _ref[1];
}

var c = a;
c.name = "haha1";
swap(a, b);
console.log(a);
var arr = [1, 2, 3];

function changeArr(x) {
  x.pop();
}

changeArr(arr);
console.log(arr);