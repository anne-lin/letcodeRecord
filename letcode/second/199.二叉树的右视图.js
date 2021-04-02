/*
 * @lc app=leetcode.cn id=199 lang=javascript
 *
 * [199] 二叉树的右视图
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
 * @return {number[]}
 */
var rightSideView = function(root) {
  if(!root){
    return [];
  }
  /* 广度优先搜索  
  let queue=[root],res=[root.val],length=1;
  while(length){
    let root;
    for(let i=0;i<length;i++){
      root=queue.shift();
      root.left && queue.push(root.left);
      root.right && queue.push(root.right);
    }
    length=queue.length;
    if(length > 0){
      res.push(queue[length-1].val);
    }
  }
  return res; */

  //深度优先搜索
  let res=[];
  dfs(root,res,1);
  return res;
};
function dfs(root,ans,h){
  if(!root){
    return false;
  }
  if(ans.length < h){
    ans.push(root.val);
  }
  root.right && dfs(root.right,ans,h+1);
  root.left && dfs(root.left,ans,h+1);
}
// @lc code=end

