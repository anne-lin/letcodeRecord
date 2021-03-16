/*
 * @lc app=leetcode.cn id=1544 lang=javascript
 *
 * [1544] 整理字符串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var makeGood = function(s) {
    let stack=[],stackIndex=-1;
    for(let i=0;i<s.length;i++){
        if(stackIndex >= 0 && stack[stackIndex] != s[i] && Math.abs(stack[stackIndex].charCodeAt() - s[i].charCodeAt()) == 32){
            stack.pop();
            stackIndex--;
        }else{
            stack.push(s[i]);
            stackIndex++;
        }
    }
    return stack.length ? stack.join(""):"";
};
// @lc code=end

