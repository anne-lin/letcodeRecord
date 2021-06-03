let a=[];
a = new Proxy(a,{
  set:function(obj,prop,value,newValue){
    console.log("br:",obj,prop,value,newValue);

    return true;
  }
})
a.push("2");