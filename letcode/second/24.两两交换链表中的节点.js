/*
 * @lc app=leetcode.cn id=24 lang=javascript
 *
 * [24] 两两交换链表中的节点
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
// var swapPairs = function(head) {
//     let dummyHead = new ListNode(0, head),
//         tmp = dummyHead;
    
//     while (tmp.next && tmp.next.next) {
//         let node1 = tmp.next,
//             node2 = tmp.next.next;
//         tmp.next = node2;
//         node1.next = node2.next;
//         node2.next = node1;
//         tmp = node1;
//     }
//     return dummyHead.next;
// };

var swapPairs = function (head) {
    if (head == null || head.next == null) {
        return head;
    }
    let newHead = head.next;
    head.next = swapPairs(newHead.next);
    newHead.next = head;
    return newHead;
 }
// @lc code=end

