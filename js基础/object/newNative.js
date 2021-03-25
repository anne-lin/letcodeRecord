function person(name,age){
    this.name = name;
    this.age = age;
}
person.prototype.sayName = function(){
    console.log(this.name);
}
function newNative(){
    //1：创建一个空对象
    let tmpObj={},
    fn=Array.prototype.shift.apply(arguments);
    //2：将空对象指向构造函数的原型：赋值prototype
    Object.setPrototypeOf(tmpObj,fn.prototype);
    //将空对象绑定到构造函数上（this指向）
    fn.apply(tmpObj,arguments);
    return tmpObj;
}
function newNative2(){
    let fn=Array.prototype.shift.apply(arguments);
    let tmpObj=Object.create(fn.prototype);
    fn.apply(tmpObj,arguments);
    return tmpObj;
}
let personA = newNative2(person,"haha",18);
console.log(personA.__proto__.constructor);
console.log(personA instanceof person);
personA.sayName();