//原型链继承的多种方式（由劣到优）
//面试的时候如果问到继承，这三种方式都要写出来，分别说出他们的优缺点。不要直接写最优解

/**
 * 方式一
 * 缺点：实列化两次parent1
 */
function parent1(){
    this.name = "parent1";
}
function child1(){
    parent1.call(this);
    this.type = "child1";
}
child1.prototype = new parent1();

/**
 * 方式二
 */
function parent2(){
    this.name = "parent2";
}
function child2(){
    parent2.call(this);
    this.type = "child2";
}
child2.prototype = parent2.prototype;//缺点：child2.constructor指向了parent2.constructor
child2.prototype.constructor = child2;//缺点：把parent2.constructor指向也改变了
let p2=new parent2();
console.log(p2.constructor) //child2

/**
 * 方式三
 * 原因：Object.create可以理解为继承一个对象，其创建后原对象的数据是在新对象的原型下的
 */
function parent3(){
    this.name = "parent3";
}
function child3(){
    parent3.call(this);
    this.type = "child3";
}
child3.prototype = Object.create(parent3.prototype);
child3.prototype.constructor = child3;
let p3=new parent3();
let c3=new child3();
console.log(p3.constructor) //parent3
console.log(c3.constructor) //child3