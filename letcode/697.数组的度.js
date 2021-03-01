/*
 * @lc app=leetcode.cn id=697 lang=javascript
 *
 * [697] 数组的度
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findShortestSubArray = function(nums) {
    let maxShow={
        time:1,
        key:nums[0]
    },map=new Map(),tmpVal;
    for(let i=0;i<nums.length;i++){
        if(map.has(nums[i])){
            tmpVal=map.get(nums[i]);
            map.set(nums[i],{
                startPos:tmpVal.startPos,
                time:++tmpVal.time,
                endPos:i
            });
            if(maxShow.time < tmpVal.time){
                maxShow={
                    time:tmpVal.time,
                    key:nums[i]
                }
            }
        }else{
            map.set(nums[i],{
                startPos:i,
                time:1,
                endPos:i
            })
        }
    }
    tmpVal=map.get(maxShow.key);
    return tmpVal.endPos - tmpVal.startPos+1;
};
// @lc code=end

