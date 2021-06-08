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
  let begin=0,maxLen=1, dp = [];
  for (let i = 0; i < s.length; i++){
    dp[i] = [];
    dp[i][i] = true;
  }
  for (let L = 2; L <= s.length; L++){
    for (let i = 0; i < s.length; i++){
      let j = i + L - 1;
      if (s[i] != s[j]) {
        dp[i][j] = false;
      } else {
        if (j - i < 3) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i + 1][j - 1];
        }
      }

      if (dp[i][j] && L > maxLen) {
        maxLen = L;
        begin = i;
      }
    }
  }
  return s.substring(begin, begin + maxLen);
};
// @lc code=end

