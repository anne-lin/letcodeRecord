/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  let left = 0,right = nums.length-1;
  while(left < right){
    while(left < right && nums[right]- target > nums[left]){
      left++;
    }
    while(left < right && nums[right]- target < nums[left]){
      right--;
    }
    if(nums[right]- target == nums[left]){
      return [left,right]
    }
  }
};
// @lc code=end

