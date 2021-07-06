function getUrlParams(sUrl, sKey) {
    let result = {};
    sUrl.replace(/\??(\w+)=(\w+)&?/g, function (s, k, v) {
        if (result[k] === void 0) {
            result[k] = [v];
        } else {
            result[k].push(v);
        }
    });
    return result[sKey] || [];
}
console.log(getUrlParams("http://www.nowcoder.com?key=1&key=2&key=3&test=4#hehe", "key"));
