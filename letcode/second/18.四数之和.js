/*
 * @lc app=leetcode.cn id=18 lang=javascript
 *
 * [18] 四数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function(nums, target) {
    if(nums.length < 4){
        return [];
    }
    nums.sort((a,b)=>a-b);
    let result=[],path=[];
    function backtrace(start,sum){
        if(path.length == 4){
            if(sum == target){
                result.push([...path]);
            }
            return;
        }
        let r;
        for(let i=start;i<nums.length;i++){
            if(nums[i]==r){
                continue;
            }
            r=nums[i];
            path.push(nums[i]);
            sum+=nums[i];
            if(sum <= target || nums[i] <= 0){
                backtrace(i+1,sum);                
            }
            path.pop();
            if(sum > target && nums[i] > 0){
                return;
            }
            sum-=nums[i];            
        }
    }
    backtrace(0,0);
    return result;
};
fourSum([1,-2,-5,-4,-3,3,3,5],-11);
// @lc code=end

