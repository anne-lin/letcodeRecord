var promise = new Promise(function(resolve, reject){
    setTimeout(function() {
      resolve(1);
    }, 3000)
  })

  //2
  promise.then(() => {
    return Promise.resolve(2);
  }).then((n) => {
    console.log("a");
    console.log(n)
  });
  
  // 2
  promise.then(() => {
    return 2
  }).then((n) => {
    console.log("b");
    console.log(n)
  });
  
  // 1
  promise.then(2).then((n) => {
    console.log("c");
    console.log(n)
  });
 
  //b 2 c 1 a 2


  //c,1,a,2,b,2