//红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？用Promse实现
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}

function lights(timer, cb) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            cb();
            resolve();
        },timer)
    })
}
let light = function(timer,cb){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            cb();
            resolve();
        },timer);
    });
}
function step(){
    light(300, red).then(() => {
        if (step.stop) {
            throw Error("涨停");
        }
        return light(100,green);
    }).then(() => {
        if (step.stop) {
            throw Error("涨停");
        }
        return light(200,yellow);
    }).then(() => {
        if (step.stop) {
            throw Error("涨停");
        }
        step();
    }).catch((e) => {
        console.log("stop")
    })
}
step.stop = false;
step();

setTimeout(() => {
    step.stop = true;
},2000)