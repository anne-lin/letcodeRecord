/**
 * 装饰器模式
 */
@testDemo
class Demos{

}
function testDemo(targent){
  targent.isDec = true;
} 
console.log(Demos.isDec);


class MathTest{
  @log
  add(a,b){
    return a+b
  }
}
function log(targent,name,descriptor){
  var oldValue = descriptor.value;
  descriptor.value = function(){
    console.log("log:",arguments);
    return oldValue.apply(this,arguments);
  }
  return descriptor;
}
const math=new MathTest();
math.add(1,2);