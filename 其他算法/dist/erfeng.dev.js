"use strict";

//二分查找
function fun(nums) {
  var left = 0,
      right = nums.length - 1,
      ans = n;

  while (left <= right) {
    var mid = (right - left >> 1) + left;

    if (target <= nums[mid]) {
      right = mid - 1;
      ans = mid;
    } else {
      left = mid + 1;
    }
  }
}