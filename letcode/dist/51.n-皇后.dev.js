"use strict";

/*
 * @lc app=leetcode.cn id=51 lang=javascript
 *
 * [51] N 皇后
 */
// @lc code=start

/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function solveNQueens(n) {
  var res = [],
      colSet = new Set(),
      pieSet = new Set(),
      naSet = new Set();
  DFS(n, 0, []);
  return res;

  function DFS(n, row, cur_state) {
    if (row >= n) {
      res.push(cur_state);
    }

    for (var col = 0; col < n; col++) {
      if (colSet.has(col) || pieSet.has(col + row) || naSet.has(row - col)) {
        continue;
      }

      colSet.add(col);
      pieSet.add(col + row);
      naSet.add(row - col);
      DFS(n, row + 1, cur_state.concat([col]));
      colSet["delete"](col);
      pieSet["delete"](col + row);
      naSet["delete"](row - col);
    }
  }
};

console.log(solveNQueens(4)); // @lc code=end