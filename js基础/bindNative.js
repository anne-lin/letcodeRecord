let obj={
    name:"haha",
    sayName:function(age){
        console.log(age);
        console.log(this.name);
    }
}
//obj.sayName();
let obj2={
    name:"haha3"
}
Function.prototype.bindNative=function(){
    let obj=Array.prototype.shift.call(arguments);
    let that=this;
    return function(){
        that.apply(obj,arguments);
    }
}
obj.sayName.bindNative(obj2)(18);


function bindThis(f, oTarget) {
    return function(){
      return f.apply(oTarget,arguments)
    }
}

    var r = bindThis(function(a, b){
        return this.test + a + b
    }, {test: 2})(2, 3); 
console.log(r);
