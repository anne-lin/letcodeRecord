var o = {
    valueof: () => {
        console.log("valueof");
        return {};
    },
    toString: () => {
        console.log("toString");
        return {};
    }
}
o[Symbol.toPrimitive] = () => {
    console.log("toPrimitive");
    return "hello";
}
console.log(o * 2);
console.log(String(o));