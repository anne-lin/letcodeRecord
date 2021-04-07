//箭头函数不能作为构造函数
//箭头函数不知持arguments，使用rest
let fun = (...rest)=>{
    //console.log(arguments)
    //this.name =name;
}
//let a = new fun("haha"); //报异常
fun("haha");

let fun2 = (name)=>{
    this.name = name;
}
let b= new fun2("haha");
console.log(b.name)
