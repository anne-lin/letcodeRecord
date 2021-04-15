/*
 * @lc app=leetcode.cn id=409 lang=javascript
 *
 * [409] 最长回文串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function(s) {
  let length=s.length;
  if(s.length < 2){
    return length;
  }
  /* let map=new Map(),count=0;
  for(let i=0;i<length;i++){
    if(map.has(s[i])){
      count=map.get(s[i]);
      map.set(s[i],count+1);
    }else{
      map.set(s[i],1);
    }
  }
  count=1;
  map.forEach((val)=>{
    if(val > 1){
      if(!(val & 1)){
        count+=val;
      }else{
        count+=val-1;
      }
    }
    
  })
  return count > length ? length:count; */
  let set = new Set();
  let count = 0;
  for(let i=0;i<length;i++){
    if(set.has(s[i])){
      set.delete(s[i]);
      count+=2;
    }else{
      set.add(s[i]);
    }
  }
  return count + (set.size ? 1:0);
};
// @lc code=end

