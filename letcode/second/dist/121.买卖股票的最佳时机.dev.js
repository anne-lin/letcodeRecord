"use strict";

/*
 * @lc app=leetcode.cn id=121 lang=javascript
 *
 * [121] 买卖股票的最佳时机
 */
// @lc code=start

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function maxProfit(prices) {
  var max = 0,
      min = prices[0];

  for (var i = 1; i < prices.length; i++) {
    if (min < prices[i]) {
      max = Math.max(prices[i] - min, max);
    } else {
      min = prices[i];
    }
  }

  return max;
}; // @lc code=end