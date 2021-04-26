/*
 * @lc app=leetcode.cn id=35 lang=javascript
 *
 * [35] 搜索插入位置
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  let start = 0 ,
      end = nums.length -1,
      mid;
    if(target > nums[end]){
      return end+1;
    }
    if(target < nums[start]){
      return start;
    }
    while(start < end){
      mid = ((end - start)>>1) + start;
      if(nums[mid] < target){
        start=mid+1;
      }
      if(nums[mid] > target){
        end = mid;
      }
      if(nums[mid] == target){
        return mid;
      }
    }
    return start;
};
//searchInsert([1,3,5,6],2);
// @lc code=end

