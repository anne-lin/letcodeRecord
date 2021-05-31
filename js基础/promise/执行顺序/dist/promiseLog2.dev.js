"use strict";

function async1() {
  return regeneratorRuntime.async(function async1$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("async1 start");
          _context.next = 3;
          return regeneratorRuntime.awrap(async2());

        case 3:
          console.log("async1 end");
          return _context.abrupt("return", "async return");

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function async2() {
  return regeneratorRuntime.async(function async2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("async2");

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
async1().then(function (msg) {
  console.log(msg);
});
new Promise(function (res) {
  console.log("promise1");
  res();
  console.log("promise3");
}).then(function () {
  console.log("promise2");
});
console.log("script end"); //script start,async1 start,async2,promise1,promise3,script end,async1 end,promise2,async return,setTimeout
//start,asy1 start,asy2,pro1,pro3,end,sasy1 end,pro2,async return,setTime