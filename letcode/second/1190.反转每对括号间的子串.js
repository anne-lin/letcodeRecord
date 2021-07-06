/*
 * @lc app=leetcode.cn id=1190 lang=javascript
 *
 * [1190] 反转每对括号间的子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseParentheses = function(s) {
        const n = s.length;
        const pair = new Array(n).fill(0);
        const stack = [];
        for (let i = 0; i < n; i++) {
            if (s[i] === '(') {
                stack.push(i);
            } else if (s[i] == ')') {
                const j = stack.pop();
                pair[i] = j;
                pair[j] = i;
            }
        }
    
        const sb = [];
        let index = 0, step = 1;
        while (index < n) {
            if (s[index] === '(' || s[index] === ')') {
                index = pair[index];
                step = -step;
            } else {
                sb.push(s[index]);
            }
            index += step;
        }
        return sb.join('');
};
console.log(reverseParentheses("a(bcdefghijkl(mno)p)q"))
// @lc code=end

