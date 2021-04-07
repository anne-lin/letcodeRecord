/*
 * @lc app=leetcode.cn id=104 lang=javascript
 *
 * [104] 二叉树的最大深度
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root){
        return 0;
    }
    //广度优先搜索
    /* let queue=[root],level=0,nodes;
    while(queue.length){
        let length=queue.length;
        for(let i=0;i<length;i++){
            nodes=queue.shift();
            nodes.left && queue.push(nodes.left);
            nodes.right && queue.push(nodes.right);
        }
        level++;
    }
    return level */

    //深度优先搜索
    return Math.max(maxDepth(root.left),maxDepth(root.right))+1;
};
// @lc code=end

