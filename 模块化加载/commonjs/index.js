let {a,b} = require('./index2');
console.log(a,b);
setTimeout(()=>{
    console.log(a,b);
},300)