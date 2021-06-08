/*
 * @lc app=leetcode.cn id=10 lang=javascript
 *
 * [10] 正则表达式匹配
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p) {
    if (s == "" || p == "") {
        return false;
    }
    let length = s.length,
        indexS = 0, indexP = 0,mathS;
    while (indexS < length) {
        switch (p[indexP]) {
            case ".": {
                mathS = 1;
                break;
            }
            case "*": {
                if (mathS !== 1) {
                    if (s[indexS] != mathS) {
                        return false;
                    }
                }
                break;
            }
            default: {
                if (s[indexS] != p[indexS]) {
                    return false;
                }
                mathS = p[indexS];
            }
        }
        indexS++;
        indexP++;
    }
    return true;
};
// @lc code=end

