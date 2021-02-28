/*
 * @lc app=leetcode.cn id=746 lang=javascript
 *
 * [746] 使用最小花费爬楼梯
 */

// @lc code=start
/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function(cost) {  
    let dp={
       work:cost[0],
       ready:0
   };
   for(let i=1;i<cost.length;i++){
       dp={
           work:Math.min(dp.work,dp.ready)+cost[i],
           ready:dp.work
       }
   };
   return Math.min(dp.work,dp.ready);
};
// @lc code=end

