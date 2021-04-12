/*
 * @lc app=leetcode.cn id=70 lang=javascript
 *
 * [70] 爬楼梯
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
  if(n==1){
    return 1;
  }
  let step1=1,step2=2,ans;
  for(let i=2;i<n;i++){
    ans=step2+step1;
    step1=step2;
    step2=ans;
  }
  return step2;
};
// @lc code=end

