/*
 * @lc app=leetcode.cn id=122 lang=javascript
 *
 * [122] 买卖股票的最佳时机 II
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let i=0;j=1,sum=0;
    while(j<prices.length){
        if(prices[i]<prices[j]){
            sum+=prices[j]-prices[i];
        }
        j++;
        i++;
    }
    return sum;
};
// @lc code=end

