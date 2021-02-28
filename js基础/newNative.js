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
let personA = newNative(person,"haha",18);
console.log(personA);
personA.sayName();