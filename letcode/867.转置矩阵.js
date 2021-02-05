/*
 * @lc app=leetcode.cn id=867 lang=javascript
 *
 * [867] 转置矩阵
 */

// @lc code=start
/**
 * @param {number[][]} A
 * @return {number[][]}
 */
var transpose = function(A) {
    let arr=[],pos=0;
    if(A.length < 1){
        return A;
    }
    while(pos<A[0].length){
        arr[pos]=[];
        for(let i=0;i<A.length;i++){
            arr[pos].push(A[i][pos]);
        }
        pos++;
    }
    return arr;
};
// @lc code=end
