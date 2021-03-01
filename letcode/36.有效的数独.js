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
var isValidSudoku = function (board) {
    for (let i = 0; i < board.length; i++){
        let setData = new Set();
        for (let j = 0; j < board.length; j++){
            if (board[i][j] != ".") {
                if (setData.has(board[i][j])) {
                    return false;
                } else {
                    setData.add(board[i][j]);
                }
            }
        }
    }
    for (let i = 0; i < board.length; i++){
        let setData = new Set();
        for (let j = 0; j < board.length; j++){
            if (board[j][i] != ".") {
                if (setData.has(board[j][i])) {
                    return false;
                } else {
                    setData.add(board[j][i]);
                }
            }
        }
    }
    let i = 0, j = 0;
    while (i<=6 && j<=6) {
        let setData = new Set();
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                if (board[i+row][j+col] != ".") {
                    if (setData.has(board[i+row][j+col])) {
                        return false;
                    } else {
                        setData.add(board[i+row][j+col]);
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
let board = [
    [".", ".", ".", ".", "5", ".", ".", "1", "."],
    [".", "4", ".", "3", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "3", ".", ".", "1"],
    ["8", ".", ".", ".", ".", ".", ".", "2", "."],
    [".", ".", "2", ".", "7", ".", ".", ".", "."],
    [".", "1", "5", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "2", ".", ".", "."],
    [".", "2", ".", "9", ".", ".", ".", ".", "."],
    [".", ".", "4", ".", ".", ".", ".", ".", "."]];
console.log(isValidSudoku(board));
// @lc code=end

