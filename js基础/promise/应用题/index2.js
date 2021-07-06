// 队列控制
// 100个文件上传，并行2个

function promiseIndex(index) {
    return Promise.resolve(index);
}
let arr = [];
for (let i = 0; i < 10; i++){
    arr.push(promiseIndex(i));
}

arr.splice(3, 0, new Promise((resolve) => {
    setTimeout(() => {
        resolve("aa");
    },0)
}))
class QueueUpload{
    constructor(limit,arr) {
        this.queue = arr;
        this.limit = limit;
        this.result = [];
        this.index = 0;
        while (this.index < limit) {
            this.upload(this.index, arr[this.index]);
            this.index++
        }
    }
    upload(index, item) {
        item.then(res => {
            this.result[index] = res;            
            if (this.index < this.queue.length) {
                this.upload(this.index++, this.queue[this.index-1]);
            }
        })
    }
}

let upload = new QueueUpload(3, arr);
setTimeout(() => {
    console.log(upload.result);
}, 500)