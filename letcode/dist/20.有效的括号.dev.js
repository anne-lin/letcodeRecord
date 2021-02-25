"use strict";

/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */
// @lc code=start

/**
 * @param {string} s
 * @return {boolean}
 */
var left = function left(l) {
  return l == "(" || l == "[" || l == "{";
};

var match = function match(l, r) {
  return l == "(" && r == ")" || l == "[" && r == "]" || l == "{" && r == "}";
};

var isValid = function isValid(s) {
  var stack = [s[0]];

  for (var i = 1; i < s.length; i++) {
    if (match(stack[stack.length - 1], s[i])) {
      stack.pop();
    } else if (left(s[i])) {
      stack.push(s[i]);
    } else {
      return false;
    }
  }

  return stack.length == 0;
}; // @lc code=end