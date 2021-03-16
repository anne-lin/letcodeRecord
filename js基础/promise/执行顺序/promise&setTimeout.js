console.log("1");
setTimeout(()=>{
    console.log("2");
    Promise.resolve().then(()=>{
        console.log("3");
    })
},0);
new Promise(function(res,rej){
    console.log("4");
    setTimeout(()=>{
        console.log(5);
        res("6")
    },0);
}).then(res=>{
    console.log(7);
    setTimeout(()=>{
        console.log(res);
    },0);
})

//1,4,2,3,5,7,6