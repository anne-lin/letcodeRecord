/*
 * @lc app=leetcode.cn id=300 lang=javascript
 *
 * [300] 最长递增子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
//方法一：动态规划
var lengthOfLIS = function(nums) {
    let dp=[1],max=1;
    for (let i = 1; i < nums.length; i++){
        dp[i] = 1;
        for (let j = 0; j < i; j++){
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[j] + 1, dp[i]);
            }
        }
        max = Math.max(max, dp[i]);
    }
    return max;
};

//方法二：二分法
var lengthOfLIS = function (nums) {
    let resArr = [nums[0]],length =1;
    for (let i = 1; i < nums.length; i++){
        if (nums[i] > resArr[length - 1]) {
            resArr.push(nums[i]);
            length++;
        } else {
            let left = 0, right = length, pos = 0,mid;
            while (left < right) {
                mid = (left + right) >> 1;
                if (resArr[mid] > nums[i]) {
                    right = mid;
                } else {
                    left = mid;
                }
            }
            // while (l <= r) {
            //     int mid = (l + r) >> 1;
            //     if (d[mid] < nums[i]) {
            //         pos = mid;
            //         l = mid + 1;
            //     } else {
            //         r = mid - 1;
            //     }
            // }
            // d[pos + 1] = nums[i];
        }
    }
}
// @lc code=end

