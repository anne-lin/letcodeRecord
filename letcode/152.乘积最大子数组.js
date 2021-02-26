/*
 * @lc app=leetcode.cn id=152 lang=javascript
 *
 * [152] 乘积最大子数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
//动态规划,找到局部的最大值和最小值
var maxProduct = function(nums) {
    let dp={
        max:nums[0],
        min:nums[0]
    },
    res=nums[0];
    for(let i=1;i<nums.length;i++){
        dp={
            max:Math.max(dp.max * nums[i],dp.min*nums[i],nums[i]),
            min:Math.min(dp.max * nums[i],dp.min*nums[i],nums[i])
        };
       res=Math.max(res,dp.max);
    }
    return res;
};
// @lc code=end

