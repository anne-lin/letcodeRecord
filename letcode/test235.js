var lowestCommonAncestor1 = function(root, p, q) {
    if(root == null || root == p || root == q){
        return root;
    }
    if(root.val > p.val && root.val > q.val){
        return lowestCommonAncestor(root.left,p,q);
    }
    if(root.val < p.val && root.val < q.val){
        return lowestCommonAncestor(root.right,p,q);
    }
    return root;
};

var lowestCommonAncestor2 = function(root, p, q) {
    if(root == null || root == p || root == q){
        return root;
    }
    let isFind=false;
    while(!isFind){
        if(root.val > p.val && root.val > q.val){
            root=root.left;
        }else if(root.val < p.val && root.val < q.val){
            root=root.right;
        }else{
            isFind=true;
        }
    }
    return root;
};
