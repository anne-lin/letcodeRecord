var indexMap=new Map();
var buildTree = function(preorder, inorder) {
    let n=preorder.length;
    for(let i=0;i<n;i++){
        indexMap.set(inorder[i],i);
    }
    return myBuildTree(preorder,inorder,0,n-1,0,n-1)
};
function myBuildTree(preorder, inorder,preorder_left,preorder_right,inorder_left,inorder_right){
    if(preorder_left > preorder_right){
        return null;
    }
    let preorder_root = preorder_left,
    inorder_root = indexMap.get(preorder[preorder_root]),
    root = new TreeNode(preorder[preorder_root]),
    size_left_subTree = inorder_root-inorder_left;
    root.left = myBuildTree(preorder,inorder,preorder_left+1,preorder_left+size_left_subTree,inorder_left,inorder_root-1);
    root.right = myBuildTree(preorder,inorder,preorder_left+size_left_subTree+1,preorder_right,inorder_root
        +1,inorder_right);
    return root;
}