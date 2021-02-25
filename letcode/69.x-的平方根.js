/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
    if (x == 0 || x == 1) {
        return x;
    }
    let left = 0, right = x, ans=-1;
    while (left <= right) {
        let mid =Math.floor((left + right) / 2);
        if (mid * mid <= x) {
            ans = mid;
            left = mid+1;
        } else {
            right =mid-1;
        }
    }
    return ans;
};
var mySqrt2 = function (x,floatNum) { 
    if (x == 0 || x == 1) {
        return x;
    }
    let left = 0, right = x,ans=-1;
    while (right - left > floatNum*0.1) {
        let mid =(left + right) / 2;
        if (mid * mid <= x) {
            ans = mid;
            left = mid;
        } else {
            right =mid;
        }
    }
    return ans.toFixed(floatNum);
}
console.log(mySqrt2(5, 2))
// @lc code=end

