/*
 * @lc app=leetcode.cn id=868 lang=javascript
 *
 * [868] 二进制间距
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var binaryGap = function(n) {
    let count = 0, max = 0;
    if ((n & (n - 1)) == 0) {
        return 0;
    }
    while ((n & 1) !== 1) {
        n = n >> 1;
    }
    while (n > 0) {
        if (n & 1) {
            max = Math.max(max, count);
            count = 0;
        } else {
            count++;
        }
        n = n >> 1;
    }
    return max+1;
};
// @lc code=end

