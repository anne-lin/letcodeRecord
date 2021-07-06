/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    if (s == "") {
        return 0;
    }
    let max = 1,str=s[0];
    for (let i = 1; i < s.length; i++){
        let index = str.indexOf(s[i]);
        if (index != -1) {
            str = str.slice(index+1) + s[i];
        } else {
            str += s[i];
            max = Math.max(max, str.length);
        }
    }
    return max;
};
// @lc code=end

