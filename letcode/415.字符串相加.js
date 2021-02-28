/*
 * @lc app=leetcode.cn id=415 lang=javascript
 *
 * [415] 字符串相加
 */

// @lc code=start
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function(num1, num2) {
    let index1=num1.length-1,
    index2=num2.length-1,
    count=[],tmp,
    isAddOne=false;
    while(index1 >= 0 && index2 >= 0){
        tmp=num1[index1]-0 + (num2[index2]-0);
        if(isAddOne && tmp >= 9){
            count.unshift(tmp - 9);
        }else {
            count.unshift((tmp >= 10 ? tmp-10:tmp)+(isAddOne ? 1:0));
            isAddOne = tmp >= 10 ? true:false;
        }    
        index1 --;
        index2 --;    
    }
    let preStr=isAddOne ? 1:"";
    if(index1 != index2){
        preStr +=(index1 > index2 ? num1.slice(0,index1+1):num2.slice(0,index2+1))-0;
    }
    return preStr+count.join("");
};
//console.log(addStrings("9","99"))
// @lc code=end

