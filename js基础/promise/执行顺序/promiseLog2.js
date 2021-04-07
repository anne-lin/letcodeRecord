async function async1(){
    console.log("async1 start");
    await async2();
    console.log("async1 end");
    return "async return"
}
async function async2(){
    console.log("async2");
}
console.log("script start");
setTimeout(function(){
    console.log("setTimeout");
},0);
async1().then((msg)=>{
    console.log(msg);
});

new Promise(function(res){
    console.log("promise1");
    res();
    console.log("promise3");
}).then(function(){
    console.log("promise2");
});
console.log("script end");
//start,asy1 start,asy2,pro1,pro3,end,sasy1 end,pro2,async return,setTime