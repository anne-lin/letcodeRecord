// 要求分别输出：1，2，3，done,[1, 2, 3]
const timeout = ms => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, ms);
});

const ajax1 = () => timeout(2000).then(() => {
    console.log('1');
    return 1;
});

const ajax2 = () => timeout(1000).then(() => {
    console.log('2');
    return 2;
});

const ajax3 = () => timeout(2000).then(() => {
    console.log('3');
    return 3;
});

const mergePromise = ajaxArray => {
    let res=[],sequence=Promise.resolve();
    
    ajaxArray.forEach((item)=>{
        sequence = sequence.then(item).then((data)=>{
            res.push(data);
            return res;
        })
    });
    return sequence;
};
const mergePromise1 =(ajaxArray)=>{
    return new Promise(async (resolve,reject)=>{
        let length = ajaxArray.length;
        let valueArr=[];
        for(let i=0;i<length;i++){            
            valueArr.push(await ajaxArray[i]());
        }
        resolve(valueArr);
    })
} 
const mergePromise2 =(ajaxArray)=>{
    return (async function(){
        let length = ajaxArray.length;
        let valueArr=[];
        let i=0;
        while(i < length){
            let value = await ajaxArray[i]();
            valueArr.push(value);
            i++;
        }
        return valueArr;
    })()
}
mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log('done');
    console.log(data); // data 为 [1, 2, 3]
});

