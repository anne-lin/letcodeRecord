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
    if(nums.length == 1){
        return nums[0];
    }
    let map=new Map(),count,length=nums.length,target=length/2;
    for(let i=0;i<length;i++){
        count=1;
        if(map.has(nums[i])){
            count=map.get(nums[i])+1;
            if(count >= target){
                return nums[i];
            }6
        }
        map.set(nums[i],count);
    }
};
//时间复杂度：O（n）
//空间复杂度：O(n)
// @lc code=end

