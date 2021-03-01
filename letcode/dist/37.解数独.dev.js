"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/*
 * @lc app=leetcode.cn id=37 lang=javascript
 *
 * [37] 解数独
 */
// @lc code=start

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function solveSudoku(board) {
  if (board == null || board.length == 0) {
    return;
  }

  if (solve(board)) {
    return board;
  } else {
    false;
  }
};

function solve(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] == ".") {
        var valArr = validValArr(board, i, j);

        for (var n = 0; n < valArr.length; n++) {
          board[i][j] = valArr[n];

          if (solve(board)) {
            return true;
          } else {
            board[i][j] = ".";
          }
        }

        return false;
      }
    }
  }

  return true;
}

function validValArr(board, i, j) {
  var setData = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);

  for (var n = 0; n < board.length; n++) {
    setData["delete"](board[i][n]);
    setData["delete"](board[n][j]);
    setData["delete"](board[3 * Math.floor(i / 3) + Math.floor(n / 3)][3 * Math.floor(j / 3) + n % 3]);
  }

  return _toConsumableArray(setData);
} // @lc code=end