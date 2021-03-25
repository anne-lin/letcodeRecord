/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    if(nums.length < 3){
        return [];
    }
    nums.sort((a,b)=>a-b);
    if(nums[0] > 0){
        return [];
    }
    let length=nums.length,res=[];
    for(let i=0;i<length;i++){
        if(i>0 && nums[i] == nums[i-1]){
            continue;
        }
        let last = length -1;
        for(let j=i+1;j<length;j++){
            if(j > i+1 && nums[j] == nums[j-1]){
                continue;
            }
            while(j<last && nums[last] + nums[i] + nums[j] > 0){
                --last;
            }
            if(last == j){
                j=length;
                continue;
            }
            if(nums[last] + nums[i] + nums[j] == 0){
                res.push([nums[i],nums[j],nums[last]]);
            }

        }
    }
    return res;
};
// @lc code=end

