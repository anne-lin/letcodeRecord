//链表
class Node {
    constructor(element){
        this.element=element;
        this.next=undefined;
    }
}
function defaultEquals(a,b) {
    return a===b;
}
class LinkedList{
    constructor(defaultEqualsFun=defaultEquals){
        this.count=0;
        this.head=undefined;
        this.defaultEqualsFun=defaultEqualsFun;
    }
    //尾部添加
    push(element){
        const node=new Node(element);
        let current;
        if(!this.head){
            this.head=node;
        }else{
            current=this.head;
            while(current.next != null){
                current=current.next;
            }
            current.next=node;
        }
        this.count++;
    }
    //在指定位置插入元素
    insert(element,position){
        if(position < 0 || position>this.count){
            return undefined;
        }
        let node = new Node(element);
        if(position == 0){
            let current=this.head;
            node.next=current;
            this.head=node;
        }else{
            let pre=this.getElementAt(position-1);
            node.next=pre.next;
            pre.next=node;
        }
        this.count++;
    }
    //返回指定位置的元素
    getElementAt(index){
        if(index>=0 && index <= this.count){
            let node=this.head;
            for(let i=0;i<index && node != null;i++){
                node=node.next;
            }
            return node;
        }else{
            return undefined;
        }
    }
    //移除某个元素
    remove(element){
        if(this.count == 0){
            return undefined;
        }
        let index=this.indexOf(element)
        if( index== -1){
            return false;
        }
        this.removeAt(index);

    //     let current=this.head;
    //     if(defaultEquals(current.element,element)){
    //         this.head=current.next;
    //         this.count--;
    //         return true;
    //     }
    //     let pre;
    //     for(let i=0;i<this.count;i++){
    //         pre=current;
    //         current=current.next;
    //         if(defaultEquals(current.element,element)){
    //             pre.next=current.next;
    //             this.count--;
    //             return true;
    //         }
    //     }
    //    return false;
        
    }
    //移除指定位子的某个元素
    removeAt(position){
        if(position>=0 && position < this.count){
            let current=this.head;
            if(position == 0){
                this.head=current.next;
            }else{
                // let pre;
                // for(let i=0;i<position;i++){
                //     pre=current;
                //     current=current.next;
                // }
                // pre.next=current.next;

                let pre=this.getElementAt(position-1);
                current=pre.next;
                pre.next=current.next;
            }
            this.count--;
            return current.element;
        }
    }
    indexOf(element){
        if(!this.count){
            return -1;
        }
        let node=this.head;
        for(let i=0;i<this.count;i++){            
            if(defaultEquals(node.element,element)){
                return i;
            }
            node=node.next;
        }
        return -1;
    }
    isEmpty(){
        return this.size() > 0;
    }
    size(){
        return this.count;
    }
    toString(){
        let stringObj="";
        let node=this.head;
        for(let i=0;i<this.count;i++){
            //console.log(node);
            stringObj=`${stringObj}${i}:${node.element},`;
            node=node.next;
        }
        return stringObj;
    }
}
let link=new LinkedList();
link.push("haha");
link.push("haha2");
link.push("haha23");
link.insert("haha5",1);
console.log(link.remove("haha23"));
console.log(link.toString());