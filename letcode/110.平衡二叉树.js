/*
 * @lc app=leetcode.cn id=110 lang=javascript
 *
 * [110] 平衡二叉树
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
 * @return {boolean}
 */
var isBalanced = function(root) {
    if(!root){
        return [];
    }
    let leftDeep=root.left ? 1:0,
        rightDeep = root.right ? 1:0,
        rootLeft=root.left,
        rootRight=root.right;
    while(rootLeft && rootRight || Math.abs(leftDeep - rightDeep) < 2){
        if(rootLeft){
            rootLeft=rootLeft.left;
            leftDeep++;
        }
        if(rootRight){
            rootRight=rootRight.right;
            rootRight++;
        }
    }
};
// @lc code=end

