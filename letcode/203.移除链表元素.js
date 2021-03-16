/*
 * @lc app=leetcode.cn id=203 lang=javascript
 *
 * [203] 移除链表元素
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
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
    if(head == null){
        return [];
    }
    let dummyLink = new ListNode(-1);
    dummyLink.next = head,
    cur = head,
    prev = dummyLink;
    while(cur && cur.next){
        if(cur.val == val){
            cur.val =cur.next.val;
            cur.next = cur.next.next;
        }else{
            cur = cur.next;
            prev=cur;
        }        
    }
    if(cur.val == val){
        prev.next = null;
    }
    return dummyLink.next;
};
// @lc code=end

