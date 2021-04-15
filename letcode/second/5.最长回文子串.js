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
  let dp=[s[0]],maxStr=s[0];
  for(let i=1;i<s.length;i++){
    let length=dp[i-1].length;
    if(length < i && s[i-length-1]==s[i]){
      dp[i]=s[i]+dp[i-1]+s[i];
    }else if(s[i-1] == s[i]){
      dp[i]=s[i]+s[i];
    }else{
      dp[i]=s[i];
    }
    maxStr=maxStr.length > dp[i].length ?maxStr:dp[i];
  }
  return maxStr;
};
// @lc code=end

