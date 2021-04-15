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
var maxProduct = function(nums) {
    let res = nums[0],
        tmp,max=nums[0],min=nums[0];
    for (let i = 1; i < nums.length; i++){
        tmp = max;
        max=Math.max(max * nums[i], min * nums[i], nums[i]);
        min = Math.min(tmp * nums[i], min * nums[i], nums[i]);
        res = Math.max(max, res);
    }
    return res;
};
// @lc code=end

