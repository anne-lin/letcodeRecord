/*
 * @lc app=leetcode.cn id=283 lang=javascript
 *
 * [283] 移动零
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
  let stack=[],index;
  for(let i=0;i<nums.length;i++){
    if(nums[i] == 0){
      stack.push(i);
    }
  }
  while(stack.length){
    index = stack.pop();
    nums.push(nums.splice(index,1));
  }
  return nums;
};
moveZeroes([0,1,0,3,12]);
// @lc code=end

