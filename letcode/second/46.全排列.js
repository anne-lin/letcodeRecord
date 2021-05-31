/*
 * @lc app=leetcode.cn id=46 lang=javascript
 *
 * [46] 全排列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
    let length = nums.length;
    if (!length) {
        return [];
    }
    if (length == 1) {
        return [nums]
    }
    let result = [];
    function permuteDFS(set, arr) {
        if (arr.length == length) {
            result.push(arr.slice(0));
            return;
        }
        for (let i = 0; i < length; i++){
            if (set.has(nums[i])) continue;
            arr.push(nums[i]);
            set.add(nums[i]);
            permuteDFS(set, arr);
            arr.pop(nums[i]);
            set.delete(nums[i]);    
        }
    }
    permuteDFS(new Set(), []);
    return result;
}

// @lc code=end

