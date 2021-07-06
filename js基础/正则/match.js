// let str = "Hello world!"

// let a = str.match(/(\w{3})+/);
// console.log(a);

let set = new WeakSet();
let key={};
let key2 = {};
set.add(key);
set.add(key2);
set.delete(key);
console.log(set.size); //2

//key=null;
console.log(set); //2