"use strict";

/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
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
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function reverseList(head) {
  /* if(head==null || head.next==null){
    return head;
  }
  let next = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return next; */
  var pre = null,
      cur = head;

  while (cur) {
    var next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }

  return pre;
}; // @lc code=end