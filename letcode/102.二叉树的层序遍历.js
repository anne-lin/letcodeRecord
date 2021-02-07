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
    let arr=[],link=[],nodes,level=0;
    link.push([root]);
    arr[level++]=[root.val];
    while(link.length){
        nodes=link.pop();  
        let currentNode=[];
        let currentNodeVal=[];
        for(let i=0;i<nodes.length;i++){
            nodes[i].left && currentNode.push(nodes[i].left) && currentNodeVal.push(nodes[i].left.val);
            nodes[i].right && currentNode.push(nodes[i].right) && currentNodeVal.push(nodes[i].right.val);            
        }
        if(currentNode.length){
            arr[level++]=currentNodeVal;
            link.push(currentNode);
        }
    }
    return arr;
};
// @lc code=end

