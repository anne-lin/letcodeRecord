/*
 * @lc app=leetcode.cn id=98 lang=javascript
 *
 * [98] 验证二叉搜索树
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
/* var isValidBST = function(root) {
    if(root == null){
        return true;
    }
    return helper(root,-Infinity,Infinity)
};
var helper=function(root,lower,max){
    if(root == null){
        return true;
    }
    if(root.val <= lower || root.val >= max){
        return false;
    }
    return helper(root.left,lower,root.val) && helper(root.right,root.val,max); 
} */

//中序遍历
var isValidBST = function(root){
    if(root == null){
        return true;
    }
    let stack=[],
    inorder = -Infinity;
    while(stack.length || root != null){
        while(root != null){
            stack.push(root);
            root=root.left;
        }
        root=stack.pop();
        if(root.val <= inorder){
            return false;
        }
        inorder = root.val;
        root=root.right;
    }
    return true;
}
// @lc code=end

