const Compare = {
    LESS_THAN: -1,
    BIGGER_THAN: 1,
    EQUALS: 0
  };
class Node{
    constructor(key){
        this.key=key;
        this.left=null;
        this.right=null;
    }
}
function defaultEquals(a,b) {
    return a===b;
}    
function CompareFun(a,b){
    if(a == b){
        return Compare.EQUALS;
    }
    return a < b ? Compare.LESS_THAN:Compare.BIGGER_THAN;
}
class BinarySearchTree{
    constructor(){
        this.root=null;
    }
    insert(key){
        if(this.root == null){
            this.root = new Node(key);
        }else{
            this.insertNode(this.root,key);
        }
    }
    insertNode(node,key){
        if(CompareFun(node.key,key) == Compare.BIGGER_THAN){
            if(node.left == null){
                node.left = new Node(key);
            }else{
                this.insertNode(node.left,key);
            }
        }else{
            if(node.right == null){
                node.right = new Node(key);
            }else{
                this.insertNode(node.right,key);
            }
        }
    }
    inOrderTraverse(callback) {
        this.inOrderTraverseNode(this.root, callback);
    }
    inOrderTraverseNode(node,callback){
        if(node != null){
            this.inOrderTraverseNode(node.left,callback);
            callback(node.key);
            this.inOrderTraverseNode(node.right,callback);
        }
    }
    preOrderTraverse(callback) {
        this.preOrderTraverseNode(this.root, callback);
      }
      preOrderTraverseNode(node,callback){
          
      }
}

let tree = new BinarySearchTree();
tree.insert(11);
tree.insert(7);
tree.insert(15);
tree.insert(9);
tree.insert(5);
tree.insert(3);
tree.insert(8);
tree.insert(10);
tree.insert(13);
tree.insert(12);
tree.insert(14);
tree.insert(18);
tree.insert(25);
tree.inOrderTraverse((node)=>{
    console.log(node);
})