/*
 * @lc app=leetcode.cn id=844 lang=javascript
 *
 * [844] 比较含退格的字符串
 */

// @lc code=start
/**
 * @param {string} S
 * @param {string} T
 * @return {boolean}
 */
//思路：双指针，从后往前校验
var backspaceCompare = function(S, T) {
    let i=S.length-1,
        j=T.length-1,
        pointS=0,
        pointT=0;
    while(i>=0 || j>=0){
        while(i>=0){
            if(S[i] == "#"){
                pointS++;
                i--;
            }else if(pointS > 0){
                i--;
                pointS--;
            }else{
                break;
            }
        }
        while(j>=0){
            if(T[j] == "#"){
                pointT++;
                j--;
            }else if(pointT > 0){
                j--;
                pointT--;
            }else{
                break;
            }
        }
        if(i>=0 && j>=0){
            if(S[i] != T[j]){
                return false;
            }
        }else if(i>=0 || j>=0){
            return false;
        }
        i--;
        j--;
    }
    return true;
};
// @lc code=end

