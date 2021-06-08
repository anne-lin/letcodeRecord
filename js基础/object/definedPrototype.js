var data={
  name:"boss",
  age:3
}

defineFun(data,"age",4);

data.age=5;
console.log(data.age);

console.log(Reflect.get(data, "age"));

function defineFun(data,key,val){
  Object.defineProperty(data,key,{
    get:function(){
      console.log("get")
      return Reflect.get(data, key);
    },
    set:function(newVal){
      val=newVal+1;
    }
  })
}