/*
 * @lc app=leetcode.cn id=70 lang=javascript
 *
 * [70] 爬楼梯
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
   /*  let arr=[];
    arr[0]=1;
    arr[1]=2;
    for(let i=2;i<n;i++){
        arr[i]=arr[i-1]+arr[i-2];
    }
    return arr[n-1];  */
    let step1 = 1,step2=2;
    if(n == 1 || n== 2){
        return n;
    }
    for(let i=2;i<n;i++){
        [step1,step2] = [step2,step1+step2];
    }
    return step2;
};

// @lc code=end

