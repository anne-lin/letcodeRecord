//传入一个带promise方法的数组，数组内的方法全部执行成功才返回事件
Promise.prototype.all = function (list) {
    if (!Array.isArray(list)) {
        throw Error("arguments must be array");
        return;
    }
    return new Promise((resolve, reject) => {
        let len = list.length, resArr = [];
        for (let i = 0; i < list.length; i++){
            list[i].then((data) => {
                resArr.push(data);
                if (resArr.length == len) {
                    resolve(resArr);
                }
            }).catch(e => {
                reject(e);
            })
        }
    })
}
//传入一个带promise方法的数组，数组内的方法全部执行（不管失败与否）返回事件
Promise.prototype.allSetter = function (list) {
    if (!Array.isArray(list)) {
        throw Error("arguments must be array");
        return;
    }
    return new Promise((resolve, reject) => {
        let len = list.length, resArr = [];
        for (let i = 0; i < list.length; i++){
            list[i].then((data) => {
                resArr[i] = data;
            },e => {
                resArr[i] = e;
            }).finally(() => {
                if (resArr.length == len) {
                    resolve(resArr);
                }
            })
        }
    })
}