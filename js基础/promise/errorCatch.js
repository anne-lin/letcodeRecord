//promise异常捕获及优先级
//promise异常捕获优先级：reject function > catch > unhandledrejection
//异常只捕获一次，按优先级捕获

new Promise(function(resolve,reject){
  reject("异常1")
}).then(()=>{},(e)=>{
  console.log("reject1:",e)
}).catch(e=>{
  console.log("catch1:",e);
})

new Promise(function(resolve,reject){
  reject("异常2")
}).then(()=>{}).catch(e=>{
  console.log("catch1:",e);
})

new Promise(function(resolve,reject){
  reject("异常3")
}).then(()=>{})

window.addEventListener("unhandledrejection",function(data){
  console.log("unhandledrejection:",data);
})