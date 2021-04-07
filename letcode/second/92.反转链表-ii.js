/*
 * @lc app=leetcode.cn id=92 lang=javascript
 *
 * [92] 反转链表 II
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
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
  if(!head){
    return head;
  }
  let tail=new ListNode(0);
  tail.next=head;
  let start=1,cur=tail;

  while(cur && start < left){
    cur=cur.next;
    start++;
  }
  if(right-left > 0){
    cur.next=reverseLink(cur.next,right-left);
  }
  return tail.next;
};
function reverseLink(head,end){
  let start=0,cur=head,pre=null;
  while(start <= end && cur){
    let next=cur.next;
    cur.next=pre;
    pre=cur;
    cur=next;
    start++;
  }
  if(start > end && cur){
    let curTmp=pre;
    while(curTmp && curTmp.next){
      curTmp=curTmp.next;
    }
    curTmp.next = cur;
  }
  return pre;
}
// @lc code=end

