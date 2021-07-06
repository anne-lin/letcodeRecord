//实现节流函数升级版，函数触发最小时间间隔200ms,时间间隔未到函数执行下次时间到了触发

function fun(fn, delay) {
    let time=0;
    let isFirst=true;//100
    return function(){
        let now = Date.now();              
        if(time+delay < now){
            fn.call(this,arguments);
            time=now;
            isFirst=false;
        }
    }
}

function fun2(fn,delay){
    let queue = [];
    return function(){
        let arg = arguments;
        if (queue.length == 0) {
            fn.call(this, arg);
            queue.push(now());
        } else {
            let lastExecTime = queue[queue.length - 1];
            let gapTime = now() - lastExecTime;
            if (gapTime > delay) {
                fn.call(this, arg);
                queue.shift();
                queue.push(now());
            } else {
                let realDelay = delay - gapTime;
                setTimeout(() => {
                    fn.call(this, arg);
                    queue.shift();
                    queue.push(now());
                }, realDelay);
                queue.push(now() + realDelay);
            }
        }
    }
}

function fun2(fn,delay){
    let queue = [];
    let time = 0;
    return function(){
        let arg = arguments;
        if (queue.length == 0) {
            if (time == 0 || now() - time > delay) {
                fn.call(this, arg);
                time = now();
            } else {
                setTimeout(() => {
                    new TimeoutExecute(queue, time + delay - now()).execute();
                });
                queue.push(() => {queue.shift().execute();})
            }
        } else {
            queue.push(() => {
                new TimeoutExecute(queue, delay).execute();
            });
        }
    }
}

class TimeoutExecute {
    constructor(queue, delay) {
        this.queue = queue;
        this.delay = delay;
    }

    execute() {
        setTimeout(() => {
            fn.call(this, arg);
            if (queue.length != 0) {
                queue.shift().execute();
            }
        }, delay)
    }
}

const fn = () => {
    console.log("执行了");
}
const res = fun2(fn, 200); //限制为200ms

setTimeout(()=>{
    res();
    console.log(1);
}, 100); //执行了
setTimeout(()=>{
    res()
}, 200); //距离上次执行只有100ms，不执行
setTimeout(()=>{
    res()
    console.log(2);
}, 250); //距离上次执行有250ms，执行
setTimeout(()=>{
    res()
    console.log(3);
}, 600); //距离上次执行有250ms，执行

// 1.css 两个子元素一左一右分布
// 2.ES6新特性 set / map的特性
// map和对象的区别

// 3.web安全 怎么防御csrf攻击
// 4.怎么做前端token持久化
// 5.localStorage sessionStorage
// 6.浏览器和nodejs的事件循环
// 7.arguments和解构arg的区别
// 8.节流函数的实现
// 9.设计模式
// 10.sessionStorage, localStorage数据过期，数据存哪里
// 11.map,set的区别