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
//迭代
// var reverseList = function(head) {
//     let cur = head,
//         prev = null;
//     while (cur) {
//         const next = cur.next;
//         cur.next = prev;
//         prev = cur;
//         cur = next;
//     }
//     return prev;
// };
//递归
var reverseList = function(head) {
    if (head == null || head.next == null) {
        return head;
    } 
    const newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
};
// @lc code=end

