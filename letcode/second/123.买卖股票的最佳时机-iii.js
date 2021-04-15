/*
 * @lc app=leetcode.cn id=123 lang=javascript
 *
 * [123] 买卖股票的最佳时机 III
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let buy1=-prices[0],
        buy2=-prices[1],
        sell1=0,
        sell2=0;
    for(let i=1;i<prices.length;i++){
      buy1=Math.max(buy1,-prices[i]);
      sell1 = Math.max(sell1,buy1+prices[i])
    }
};
// @lc code=end

