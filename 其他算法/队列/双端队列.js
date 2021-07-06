class Deque{
    constructor(){
        this.count=0;
        this.lowestCount=0;
        this.items={};
    }
    addFront(val){
        this.lowestCount--;
        this.items[this.lowestCount]=val;
    }
    addBack(val){
        this.items[this.count]=val;
        this.count++;
    }
    removeFront(){
        if(this.isEmpty()){
            return undefined;
        }
        let res=this.items[this.lowestCount];
        delete this.items[this.lowestCount];
        this.lowestCount++;
        return res;
    }
    removeBack(){
        if(this.isEmpty()){
            return undefined;
        }
        this.count--;
        let res=this.items[this.count];
        delete this.items[this.count];
        return res;
    }
    peekFront(){
        if(this.isEmpty()){
            return undefined;
        }
        return this.items[this.lowestCount];
    }
    peekBack(){
        if(this.isEmpty()){
            return undefined;
        }
        return this.items[this.count-1];
    }
    isEmpty(){
        return this.size() === 0;
    }
    size(){
        return this.count-this.lowestCount;
    }
    toString(){
        let objectString=this.items[this.lowestCount];
        for(let i=this.lowestCount+1;i<this.count;i++){
            objectString=`${objectString},${this.items[i]}`;
        }
        return objectString;
    }
}

