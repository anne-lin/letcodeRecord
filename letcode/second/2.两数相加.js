/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  let cur=new ListNode(),
      tail=cur,isAddOne=false;
  while(l1 || l2){
    if(l1 && l2){
      val=l1.val+l2.val+(isAddOne ? 1:0);
    }else if(l1){
      val = l1.val + (isAddOne ? 1:0);
    }else{
      val = l2.val + (isAddOne ? 1:0);
    }
    isAddOne = Boolean(val > 9);
    tail.val = isAddOne ? val-10:val;    
    l1=l1 ? l1.next:null;
    l2=l2 ? l2.next:null;
    if(l1 || l2){
      tail.next = new ListNode();
      tail=tail.next;
    }
  }
  if(isAddOne){
    tail.next = new ListNode(1);
  }
  return cur;
}
// @lc code=end

