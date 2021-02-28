/*
 * @lc app=leetcode.cn id=120 lang=javascript
 *
 * [120] 三角形最小路径和
 */

// @lc code=start
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
    if(triangle.length == 1){
        return triangle[0][0]
    }
    let row=triangle.length,
    dp=triangle[row-1];
    return getMinRoot(triangle,row-2,dp);
};
function getMinRoot(triangle,row,dp){
    if(row==0){
        return Math.min(dp[0],dp[1])+triangle[0][0];
    }
    for(let i=0;i<triangle[row].length;i++){
        dp[i]=Math.min(dp[i],dp[i+1])+triangle[row][i];
    }
    return getMinRoot(triangle,row-1,dp);
}
//优化后
var minimumTotal2 = function(triangle) {
    if(triangle.length == 1){
        return triangle[0][0]
    }
    let row=triangle.length,
    dp=triangle[row-1];
    for(let row = row-2;row>=0;row--){
        for(let i=0;i<triangle[row].length;i++){
            dp[i]=Math.min(dp[i],dp[i+1])+triangle[row][i];
        }
    }
    return dp[0];
};
// @lc code=end

