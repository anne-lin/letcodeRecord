"use strict";

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
var addTwoNumbers = function addTwoNumbers(l1, l2) {
  // let cur=new ListNode(),
  //     tail=cur,isAddOne=false;
  // while(l1 || l2){
  //   if(l1 && l2){
  //     val=l1.val+l2.val+(isAddOne ? 1:0);
  //   }else if(l1){
  //     val = l1.val + (isAddOne ? 1:0);
  //   }else{
  //     val = l2.val + (isAddOne ? 1:0);
  //   }
  //   isAddOne = Boolean(val > 9);
  //   tail.val = isAddOne ? val-10:val;    
  //   l1=l1 ? l1.next:null;
  //   l2=l2 ? l2.next:null;
  //   if(l1 || l2){
  //     tail.next = new ListNode();
  //     tail=tail.next;
  //   }
  // }
  // if(isAddOne){
  //   tail.next = new ListNode(1);
  // }
  // return cur;
  var dummyLink = new ListNode(),
      cur = dummyLink,
      add = 0;

  while (l1 || l2) {
    cur.next = new ListNode();
    cur = cur.next;
    var val = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + add;

    if (val > 9) {
      add = 1;
      cur.val = val - 10;
    } else {
      add = 0;
      cur.val = val;
    }

    if (l1) {
      l1 = l1.next;
    }

    if (l2) {
      l2 = l2.next;
    }
  }

  if (add == 1) {
    cur.next = {
      val: 1,
      next: null
    };
  }

  return dummyLink.next;
}; // @lc code=end