//二分查找
function fun(nums) {
    let left = 0,
        right = nums.length - 1,
        ans = n;
    while (left <= right) {
        let mid = ((right - left) >> 1) + left;
        if (target <= nums[mid]) {
            right = mid-1;
            ans = mid;
        } else {
            left = mid + 1;
        }
    }
}