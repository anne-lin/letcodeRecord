"use strict";

/*
 * @lc app=leetcode.cn id=22 lang=javascript
 *
 * [22] 括号生成
 */
// @lc code=start

/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function generateParenthesis(n) {
  var list = [];

  _gen(0, 0, "");

  function _gen(left, right, result) {
    //（)[, ([), [() ---- ()], (]), ]()
    if (left == n && left == right) {
      list.push(result);
      return;
    }

    if (left < n) {
      _gen(left + 1, right, result + "(");
    }

    if (right < left && right < n) {
      _gen(left, right + 1, result + ")");
    }
  }

  return list;
};

console.log(generateParenthesis(255)); // @lc code=end