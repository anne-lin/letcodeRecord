//单例模式思想：保证一个类仅有一个实例，并提供全局访问

var createLoginLayer = function () {
    var div = document.createElement("div");
    div.innerHTML = "我是登录浮窗";
    div.style.display = "none";
    document.body.appendChild(div);
    return div;
}
var createIframe = function () {
    var iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    return iframe;
}

var getSingle = function (fn) {
    var result;
    return function () {
        return result || (result = fn.apply(this.arguments));
    }
}

let createSingleLoginLayer = getSingle(createLoginLayer);
let createSingleIframe = getSingle(createIframe);