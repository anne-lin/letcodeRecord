let {...test} = Object.create({x:1});
let test2=Object.create({x:1});
console.log(test2.x);
console.log({...test});
console.log(test.x);