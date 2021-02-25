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
var solveSudoku = function(board) {
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
    for (let i=0; i < board.length; i++){
        for (let j=0; j < board.length; j++){
            if (board[i][j] == ".") {
                let valArr = validValArr(board, i, j);
                for (let n = 0; n < valArr.length; n++){
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
    let setData = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    for (let n = 0; n < board.length; n++){
        setData.delete(board[i][n]);
        setData.delete(board[n][j]);            
        setData.delete(board[3 * Math.floor(i / 3) + Math.floor(n / 3)][3 * Math.floor(j / 3) + n % 3]);
    }
    return [...setData];
}


// @lc code=end

