class Queue{
    constructor(){
        this.count=0;
        this.lowestCount=0;
        this.items={};
    }
    //尾部添加
    enqueue(val){
        this.items[this.count]=val;
        this.count++;
    }
    //出队
    dequeue(){
        if(this.isEmpty()){
            return undefined;
        }
        let res=this.items[this.lowestCount];
        delete this.items[this.lowestCount];
        this.lowestCount++;
        return res;
    }
    peek(){
        if(this.isEmpty()){
            return undefined;
        }
        return this.items[this.lowestCount];
    }
    isEmpty(){
        return this.size() === 0;
    }
    size(){
        return this.count-this.lowestCount;
    }
}

//队列的应用：击鼓传花游戏：某一时刻把花传到谁手里谁就推出游戏，最终没离开的人获胜

const names=["John","Jack","Camila","Ingrid","Carl"];
const result=hotPotato(names,7);

function hotPotato(elementList,num){
    let queue1 = new Queue();
    let failList=[];

    for(let i=0;i<elementList.length;i++){
        queue1.enqueue(elementList[i]);
    }
    while(queue1.size() > 1){
        for(let i=0;i<num;i++){
            queue1.enqueue(queue1.dequeue());
        }
        failList.push(queue1.dequeue());
    }
    return {
        winner:queue1.peek()
    }
}
console.log(result);