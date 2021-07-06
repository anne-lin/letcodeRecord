let a = {
    name: "haha",
    other: {
        age: "18",
        height:"170"
    }
}

function deepCopy(a) {
    if (typeof a !== "object") {
        return a;
    }
    let obj = {};
    for (let [key,val] of Object.entries(a)) {
        obj[key] = deepCopy(val);
    }
    return obj;
}


Object.defineProperty(a, "name", {
    //enumerable: false
})
let b = deepCopy(a);
let c = a;
console.log(Object.is(a, c));
console.log(Object.entries(a));

function fun1(name,age) {
    this.name = name;
    this.age = age;
}
fun1.prototype.sayName = function () {
    console.log(this.name);
}

function newNative() {
    let fn = [].shift.call(arguments);
    let obj = Object.create(fn.prototype);
    fn.apply(obj, arguments);
    return obj;
}

let d = newNative(fun1, "haha", 18);
d.sayName();