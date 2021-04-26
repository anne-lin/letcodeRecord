/*
 * @lc app=leetcode.cn id=239 lang=javascript
 *
 * [239] 滑动窗口最大值
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
  if(!Array.isArray(nums)){
    return [];
  }
    if(k == 1){
      return nums;
    }
    let link=[0],maxArr=[];
    for(let i = 1;i<k;i++){
      while(nums[link[0]] < nums[i]){
        link.shift();
      }
      link.push(i);
    }
    maxArr.push(nums[link[0]]);
    for(let i=k;i<nums.length;i++){
      if(link[0] == i-k){
        link.shift();
      }
      while(link.length > 0 && nums[i]>nums[link[link.length-1]]){
        link.pop();
      }
      link.push(i);
      maxArr.push(nums[link[0]]);
    }
    return maxArr;
};
// @lc code=end

