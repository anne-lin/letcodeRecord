/*
 * @lc app=leetcode.cn id=102 lang=javascript
 *
 * [102] 二叉树的层序遍历
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root){
        return [];
    }
    let queue=[root],res=[],level=0,nodes;
    while(queue.length){
        let currentNode=[];
        res[level]=[];
        while(queue.length){
            nodes=queue.shift();
            res[level].push(nodes.val);
            nodes.left && currentNode.push(nodes.left);
            nodes.right && currentNode.push(nodes.right);
        }
        queue = currentNode;
        level++;
    }
    return res;
};
// @lc code=end

