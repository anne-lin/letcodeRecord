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
    let length1 = num1.length-1,
        length2 = num2.length-1,
        isAddOne=0,
        curRes=0,stack=[];
    /* while(length1 >= 0 && length2 >= 0){
      curRes=Math.floor(num1[length1])+Math.floor(num2[length2])+(isAddOne ? 1:0);
      if(curRes>9){
        stack.push(curRes - 10);
        isAddOne=true;
      }else{
        stack.push(curRes);
        isAddOne=false;
      }
      length1--;
      length2--;
    }
    while(length1 >= 0){
      curRes=Math.floor(num1[length1])+(isAddOne ? 1:0);
      if(curRes>9){
        stack.push(curRes - 10);
        isAddOne=true;
      }else{
        stack.push(curRes);
        isAddOne=false;
      }
      length1--;
    }
    while(length2 >= 0){
      curRes=Math.floor(num2[length2])+(isAddOne ? 1:0);
      if(curRes>9){
        stack.push(curRes - 10);
        isAddOne=true;
      }else{
        stack.push(curRes); 
        isAddOne=false;
      }
      length2--;
    }
    if(isAddOne){
      stack.push(1);
    } */
    while(length1 >= 0 || length2 >=0 || isAddOne){
      curRes=Math.floor(length1 < 0 ? 0:num1[length1])+Math.floor(length2 < 0 ? 0:num2[length2])+isAddOne;
      if(curRes>9){
        stack.push(curRes - 10);
        isAddOne=1;
      }else{
        stack.push(curRes);
        isAddOne=0;
      }
      length1 >= 0 && length1--;
      length2 >= 0 && length2--;
    }
    return stack.reverse().join("");
};
// @lc code=end

