function A(name,age){
  this.name = name;
  this.age = age;
}
A.prototype.say=function(){
  console.log("name:",this.name);
}
//let a=new A("yinghan",18);
function newNative(){
  let fn=[].shift.apply(arguments);
  let obj= Object.create(fn.prototype)
  fn.apply(obj,arguments);
  return obj; 
}
let a = newNative(A,"yinghan",18);
a.say();