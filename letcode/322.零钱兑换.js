/*
 * @lc app=leetcode.cn id=322 lang=javascript
 *
 * [322] 零钱兑换
 */

// @lc code=start
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    let dp=[0];
    for(let i=1;i<=amount;i++){
        dp[i]=amount+1;
        for(let j=0;j<coins.length;j++)
            if(i - coins[j] >= 0){
                dp[i]=Math.min(dp[i],dp[i-coins[j]]+1);
            }
    }  
    return dp[amount] > amount ? -1:dp[amount];
};
// @lc code=end

