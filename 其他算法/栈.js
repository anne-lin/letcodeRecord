class Stack{
    constructor(){
        this.count=0;
        this.items={};
    }
    push(value){
        this.items[this.count]=value;
        this.count++;
    }
    pop(){
        if(this.isEmpty()){
            return undefined;
        }
        this.count--;
        let res=this.items[this.count];
        delete this.items[this.count];
        return res;
    }
    isEmpty(){
        return this.count === 0;
    }
    peek(){
        if(this.isEmpty()){
            return undefined;
        }
        return this.items[this.count-1]
    }
    clear(){
        this.count=0;
        this.items={};
    }
}
let stack1=new Stack();
stack1.push(2);
stack1.push(24);
stack1.push(6);
console.log(stack1.pop());