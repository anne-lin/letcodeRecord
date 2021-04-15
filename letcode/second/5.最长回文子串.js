/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    let dp = [{
        str: s[0],
        start: 0
    }];
    for (let i = 1; i < s.length; i++){
        if(dp[i-1].start == 0 ){}
    }
};
// @lc code=end

