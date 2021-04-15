/*
 * @lc app=leetcode.cn id=64 lang=javascript
 *
 * [64] 最小路径和
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
  let n=grid.length,
      m=grid[0].length,
      dp=[[]];
  /* for(let i=0;i<n;i++){
    for(let j=0;j<m;j++){
      if(i==0){
        dp[0][j]= j == 0 ? grid[0][0]:dp[0][j-1]+grid[0][j];
        continue;
      }
      if(j==0){
        dp[i]=[];
        dp[i][0]=dp[i-1][0]+grid[i][j];
        continue;
      }
      dp[i][j]=Math.min(dp[i-1][j],dp[i][j-1])+grid[i][j];
    }
  }
  return dp[n-1][m-1]; */
  dp=Array.fill(0)
  for(n;n>0;n--){
    for(m;m>=0;m--){

    }
  }
};
// @lc code=end

