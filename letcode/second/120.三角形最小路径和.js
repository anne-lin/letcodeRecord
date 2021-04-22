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
    if (triangle.length == 1) {
        return triangle[0][0];
    }
    let rows = triangle.length,
        dp = triangle[rows - 1];
    for (rows = rows - 2; rows >= 0; rows--){
        for (let i = 0; i < triangle[rows].length; i++){
            dp[i] = Math.min(dp[i], dp[i + 1]) + triangle[rows][i];
        }
    }
    return dp[0];
};
// @lc code=end

