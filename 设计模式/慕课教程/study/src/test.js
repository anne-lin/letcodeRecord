import List from "./demo/list";


let list = new List(app);

setTimeout(() => {
    import("./demo/cart.js").then(res => {
        console.log("异步加载cart:",res);
    })
},3000)

console.log("我是test")