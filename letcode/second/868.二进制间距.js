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
    let count = 0,
        flag = n & 1,
        max=0;
    while(n >> 1){
        if(flag == 1){
            count++;
        }else{
            count--;
        }
    }
};
// @lc code=end

