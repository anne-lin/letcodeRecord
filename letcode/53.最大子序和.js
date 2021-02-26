/*
 * @lc app=leetcode.cn id=53 lang=javascript
 *
 * [53] 最大子序和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let dp=nums[0],max=nums[0];
    for(let i=1;i<nums.length;i++){
        dp=Math.max(nums[i]+dp,nums[i]);
        max=Math.max(max,dp);
    }
    return max;
};
// @lc code=end

