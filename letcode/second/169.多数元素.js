/*
 * @lc app=leetcode.cn id=169 lang=javascript
 *
 * [169] 多数元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
   return majorityElementRec(nums,0,nums.length-1)
};
var majorityElementRec = function(nums,lo,hi){
    if(lo == hi){
        return nums[lo];
    }
    let mid= ((hi - lo) >>1 )+ lo;
    let left = majorityElementRec(nums,lo,mid);
    let right = majorityElementRec(nums,mid+1,hi);

    if(left == right){
        return left;
    }
     let leftCount = countInRange(nums,left,lo,hi);
     let rightCount = countInRange(nums,right,lo,hi);

     return leftCount > rightCount ? left:right;
}
function countInRange(nums,target,li,hi){
    let count=0;
    for(let i=li;i<=hi;i++){
        if(nums[i] == target){
            count++;
        }
    }
    return count;
}
// @lc code=end

