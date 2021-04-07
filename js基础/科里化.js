function add(a,b){
    return a+b;
}
function square(a,b){
    return a*b;
}
function pluseOne(n){
    return n+1;
}
let compositeFun = composite(add,square,pluseOne);
function composite(){
    let arg=[...arguments];
    return function(){
        return arg.reduce((pre,cur)=>{
            return pre + cur(...arguments)
        },0);

    }
}
console.log(compositeFun(3,4));