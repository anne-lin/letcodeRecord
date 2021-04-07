/*
 * @lc app=leetcode.cn id=22 lang=javascript
 *
 * [22] 括号生成
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    let res=[];
    function check(leftNum,rightNum,str){
        if(str.length == 2*n){
            res.push(str);
            return;
        }
        if(leftNum < n){
            check(leftNum+1,rightNum,str+"(");
        }
        if(rightNum < leftNum){
            check(leftNum,rightNum+1,str+")");
        }
    }
    check(0,0,"");
    return res;
};
// @lc code=end

