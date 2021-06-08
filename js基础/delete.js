let a = 18;
console.log(delete a);//false
console.log(a);//18

console.log(delete b);//true

let obj = {
    name: "haha"
}

Object.defineProperty(obj, "name", {
    configurable:false
})

console.log(delete obj.name);
console.log(obj);