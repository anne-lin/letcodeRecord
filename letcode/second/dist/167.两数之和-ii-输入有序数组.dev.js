"use strict";

/*
 * @lc app=leetcode.cn id=167 lang=javascript
 *
 * [167] 两数之和 II - 输入有序数组
 */
var _require = require("constants"),
    SSL_OP_NO_TLSv1_1 = _require.SSL_OP_NO_TLSv1_1; // @lc code=start

/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */


var twoSum = function twoSum(numbers, target) {
  if (numbers.length < 3) {
    return [1, 2];
  }
  /* let cur,end,start,mid;
  for(let i=0;i<numbers.length;i++){
    cur = target-numbers[i];
    start=i+1; 
    end=numbers.length;
    while(start <= end){
      mid=(start+end) >> 1;
      if(numbers[mid] == cur){
        return [i+1,mid+1];
      }else if(numbers[mid] > cur){
        end=mid - 1;
      }else{
        start = mid + 1;
      }
    }
  }   */


  var start = 0,
      end = numbers.length - 1;

  while (start <= end) {
    /* while(start < end && numbers[start] + numbers[end] > target) end--;
    while(start < end && numbers[start] + numbers[end] < target) start++;
    if(numbers[start]+numbers[end] == target){
      return [start+1,end+1];
    }     */
    var sum = numbers[start] + numbers[end];

    if (sum == target) {
      return [start + 1, end + 1];
    } else if (sum > target) {
      end--;
    } else {
      start++;
    }
  }

  return [-1, -1];
}; // @lc code=end