var test={n:1};
//test.x=test={n:2};
test.x={n:2};
console.log(test={n:2})

var a = {n:1};
var b = a;
a.x = a = {n:2};
 
console.log(a); 
console.log(b);