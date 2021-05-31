"use strict";

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
var longestPalindrome = function longestPalindrome(s) {
  var begin = 0,
      maxLen = 1,
      dp = [];

  for (var i = 0; i < s.length; i++) {
    dp[i] = [];
    dp[i][i] = true;
  }

  for (var L = 2; L <= s.length; L++) {
    for (var _i = 0; _i < s.length; _i++) {
      var j = _i + L - 1;

      if (s[_i] != s[j]) {
        dp[_i][j] = false;
      } else {
        if (j - _i < 3) {
          dp[_i][j] = true;
        } else {
          dp[_i][j] = dp[_i + 1][j - 1];
        }
      }

      if (dp[_i][j] && L > maxLen) {
        maxLen = L;
        begin = _i;
      }
    }
  }

  return s.substring(begin, begin + maxLen);
}; // @lc code=end