class Node {
    constructor(element,next){
        this.element=element;
        this.next=next;
    }
}
class DoublyNode extends Node{
    constructor(element,next,pre){
        super(element,next);
        this.pre=pre;
    }
}
function defaultEquals(a,b) {
    return a===b;
}
class DoublyLinkList extends LinkedList{
    constructor(defaultEqualsFun=defaultEquals){
        super(defaultEqualsFun);
        this.tail=undefined;
    }
    insert(element,position){
        if(position < 0 || position>this.count){
            return undefined;
        }
        let node=new DoublyNode(element);
        if(position == 0){
            this.head=node;
            this.tail=node;
        }else{
            let current=this.head;
            for(let i=0;i<position;i++){
                current=current.next;
            }
            node.pre=current;
            node.next=current.next;
            current.next=node;
        }
        this.count++;
    }
}