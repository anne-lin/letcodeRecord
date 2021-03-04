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
//未实现
var isBalanced = function(root) {
    if(!root){
        return [];
    }
    let leftDeep=root.left ? 1:0,
        rightDeep = root.right ? 1:0,
        rootLeft=root.left,
        rootRight=root.right;
        while(rootLeft && leftDeep++) rootLeft=rootLeft.left;
        while(rootRight && rightDeep++) rootRight=rootRight.right;
    return Math.abs(leftDeep - rightDeep) < 2;
   
};
// @lc code=end

