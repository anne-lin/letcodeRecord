/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
    if (s.length & 1) {
        return false;
    }
    let map = new Map([
        [")", "("],
        ["]", "["],
        ["}", "{"]
    ]),
        stack=[];
    for (let i = 0; i < s.length; i++){
        if (map.has(s[i])) {
            if (!stack.length || stack.pop() !== map.get(s[i])) {
                return false;
            }
        } else {
            stack.push(s[i]);
        }
    }
    return stack.length == 0;
};
// @lc code=end

