/*
 * @lc app=leetcode.cn id=4 lang=javascript
 *
 * [4] 寻找两个正序数组的中位数
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
//头看大了，后期再看
var findMedianSortedArrays = function(nums1, nums2) {
    let length1=nums1.length,
    length2=nums2.length,
    targetIndex=Math.floor((length1+length2)/2),index1=0,index2=0;
    while(index1+index2+1 < targetIndex){
        while(index1+index2+1 < targetIndex && nums1[index1]<nums2[index2]){
            index1++;
        }
        while(index1+index2+1 < targetIndex && nums1[index1]>nums2[index2]){
            index2++;
        }
    }
    if((length1+length2)%2){
        if(nums1[index1]<nums2[index2]){
            return nums2[index2];
        }else{
            return nums1[index1];
        }
    }else{
        return (nums1[index1]+nums2[index2])/2;
    }
};
console.log(findMedianSortedArrays([0,0],[0,0]))
// @lc code=end

