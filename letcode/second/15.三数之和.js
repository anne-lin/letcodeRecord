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
// var threeSum1 = function(nums) {
//     if(nums.length < 3){
//         return [];
//     }
//     nums.sort((a,b)=>a-b);
//     if(nums[0] > 0){
//         return [];
//     }
//     let length=nums.length,res=[];
//     for(let i=0;i<length;i++){
//         if(i>0 && nums[i] == nums[i-1]){
//             continue;
//         }
//         let last = length -1;
//         for(let j=i+1;j<length;j++){
//             if(j > i+1 && nums[j] == nums[j-1]){
//                 continue;
//             }
//             while(j<last && nums[last] + nums[i] + nums[j] > 0){
//                 --last;
//             }
//             if(last == j){
//                 j=length;
//                 continue;
//             }
//             if(nums[last] + nums[i] + nums[j] == 0){
//                 res.push([nums[i],nums[j],nums[last]]);
//             }

//         }
//     }
//     return res;
// };

var threeSum = function (nums) {
    if (nums.length < 3) {
        return [];
    }
    nums.sort((a, b) => a - b);
    let res = [];
    for (let i = 0; i < nums.length - 2; i++){        
        if (nums[i] > 0) {
            return res;
        }
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }
        for (let j = i + 1; j < nums.length-1; j++){
            if (j > i + 1 && nums[j] == nums[j - 1]) {
                continue;
            }
            let k = nums.length-1;
            while (k>j && nums[k] + nums[j] + nums[i] > 0) {
                k--;
            }
            if (k == j) {
                continue;
            }
            if (nums[k] + nums[j] + nums[i] == 0) {
                res.push([nums[i], nums[j], nums[k]]);
            }
        }
    }
    return res;
}


// @lc code=end

