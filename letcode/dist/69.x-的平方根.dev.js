"use strict";

/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根
 */
// @lc code=start

/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function mySqrt(x) {
  if (x == 0 || x == 1) {
    return x;
  }

  var left = 0,
      right = x,
      ans = -1;

  while (left <= right) {
    var mid = Math.floor((left + right) / 2);

    if (mid * mid <= x) {
      ans = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return ans;
};

var mySqrt2 = function mySqrt2(x, floatNum) {
  if (x == 0 || x == 1) {
    return x;
  }

  var left = 0,
      right = x,
      ans;

  while (left <= right) {
    var mid = (left + right) / 2;

    if (mid * mid <= x) {
      ans = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return ans;
};

console.log(mySqrt2(5)); // @lc code=end