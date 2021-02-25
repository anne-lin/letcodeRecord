"use strict";

/*
 * @lc app=leetcode.cn id=36 lang=javascript
 *
 * [36] 有效的数独
 */
// @lc code=start

/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function isValidSudoku(board) {
  for (var _i = 0; _i < board.length; _i++) {
    var setData = new Set();

    for (var _j = 0; _j < board.length; _j++) {
      if (board[_i][_j] != ".") {
        if (setData.has(board[_i][_j])) {
          return false;
        } else {
          setData.add(board[_i][_j]);
        }
      }
    }
  }

  for (var _i2 = 0; _i2 < board.length; _i2++) {
    var _setData = new Set();

    for (var _j2 = 0; _j2 < board.length; _j2++) {
      if (board[_j2][_i2] != ".") {
        if (_setData.has(board[_j2][_i2])) {
          return false;
        } else {
          _setData.add(board[_j2][_i2]);
        }
      }
    }
  }

  var i = 0,
      j = 0;

  while (i <= 6 && j <= 6) {
    var _setData2 = new Set();

    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        if (board[i + row][j + col] != ".") {
          if (_setData2.has(board[i + row][j + col])) {
            return false;
          } else {
            _setData2.add(board[i + row][j + col]);
          }
        }
      }
    }

    if (j == 6) {
      i += 3;
      j = 0;
    } else {
      j += 3;
    }
  }

  return true;
};

var board = [[".", ".", ".", ".", "5", ".", ".", "1", "."], [".", "4", ".", "3", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "3", ".", ".", "1"], ["8", ".", ".", ".", ".", ".", ".", "2", "."], [".", ".", "2", ".", "7", ".", ".", ".", "."], [".", "1", "5", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "2", ".", ".", "."], [".", "2", ".", "9", ".", ".", ".", ".", "."], [".", ".", "4", ".", ".", ".", ".", ".", "."]];
console.log(isValidSudoku(board)); // @lc code=end